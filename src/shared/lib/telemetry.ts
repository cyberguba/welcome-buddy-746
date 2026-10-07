import type { ApplicationInsights, ITelemetryItem } from "@microsoft/applicationinsights-web";

/**
 * Purpose: sends page views and errors to Azure Application Insights.
 * Dependencies: VITE_APPINSIGHTS_CONNECTION_STRING; without it nothing is sent (local dev, tests).
 * Constraints: no cookies, and query strings are stripped from every URL, so user ids and
 * database query details never reach the logs. The SDK loads after the app starts, so events
 * that happen before that wait in a short queue.
 */
const MAX_QUEUED_EVENTS = 50;

type TelemetryEvent = (appInsights: ApplicationInsights) => void;

let appInsights: ApplicationInsights | null = null;
const queuedEvents: TelemetryEvent[] = [];

function sendOrQueue(event: TelemetryEvent): void {
  if (appInsights) event(appInsights);
  else if (queuedEvents.length < MAX_QUEUED_EVENTS) queuedEvents.push(event);
}

export function stripQueryString(url: string): string {
  const queryStart = url.search(/[?#]/);
  return queryStart === -1 ? url : url.slice(0, queryStart);
}

// Which baseData fields hold URLs, per telemetry type.
const URL_FIELDS_BY_TYPE: Record<string, string[]> = {
  PageviewData: ["uri", "refUri"],
  RemoteDependencyData: ["name", "data", "target"],
};

/** Telemetry initializer: removes query strings and fragments from URL fields before sending. */
export function removeQueryStrings(item: ITelemetryItem): void {
  const urlFields = URL_FIELDS_BY_TYPE[item.baseType ?? ""];
  const baseData = item.baseData;
  if (!urlFields || !baseData) return;
  for (const field of urlFields) {
    const value = baseData[field];
    if (typeof value === "string") baseData[field] = stripQueryString(value);
  }
}

export async function initTelemetry(connectionString: string): Promise<void> {
  try {
    const { ApplicationInsights } = await import("@microsoft/applicationinsights-web");
    const instance = new ApplicationInsights({
      config: {
        connectionString,
        disableCookiesUsage: true,
        // Page views are sent from the router (see main.tsx) so each one has the right path.
        enableAutoRouteTracking: false,
        // Correlation headers on Supabase requests would trigger CORS preflights.
        enableCorsCorrelation: false,
      },
    });
    instance.loadAppInsights();
    instance.addTelemetryInitializer(removeQueryStrings);
    appInsights = instance;
    for (const event of queuedEvents.splice(0)) event(instance);
  } catch (error) {
    // Telemetry must never break the app. Plain console (not logger) because logger reports here.
    console.warn("[induction] Could not start Application Insights", error);
  }
}

export function trackPageView(path: string): void {
  const title = document.title;
  sendOrQueue((instance) => instance.trackPageView({ name: title, uri: path }));
}

/** Supabase errors are plain objects with a `message`, not Error instances. */
export function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error;
    if (typeof message === "string") return new Error(message);
  }
  return new Error(String(error));
}

export function trackException(error: unknown, message: string): void {
  const exception = toError(error);
  // Only the message is sent: log contexts can contain ids and query keys.
  sendOrQueue((instance) => instance.trackException({ exception }, { message }));
}
