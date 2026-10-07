import { describe, expect, it } from "vitest";
import type { ITelemetryItem } from "@microsoft/applicationinsights-web";
import { removeQueryStrings, stripQueryString, toError } from "@/shared/lib/telemetry";

const SUPABASE_REQUEST =
  "https://project.supabase.co/rest/v1/assignments?select=id,user_id&user_id=eq.00000000-0000-0000-0000-000000000002";

describe("stripQueryString", () => {
  it("removes the query string and fragment", () => {
    expect(stripQueryString(SUPABASE_REQUEST)).toBe(
      "https://project.supabase.co/rest/v1/assignments",
    );
    expect(stripQueryString("/plan?user=abc#top")).toBe("/plan");
    expect(stripQueryString("/plan#top")).toBe("/plan");
  });

  it("leaves URLs without a query unchanged", () => {
    expect(stripQueryString("/documents")).toBe("/documents");
  });
});

describe("removeQueryStrings", () => {
  it("strips user ids and query details from Supabase dependency calls", () => {
    const item: ITelemetryItem = {
      name: "dependency",
      baseType: "RemoteDependencyData",
      baseData: {
        name: `GET ${SUPABASE_REQUEST}`,
        data: SUPABASE_REQUEST,
        target: "project.supabase.co",
      },
    };
    removeQueryStrings(item);
    expect(JSON.stringify(item)).not.toContain("user_id");
    expect(item.baseData?.["data"]).toBe("https://project.supabase.co/rest/v1/assignments");
  });

  it("strips query strings from page view URLs", () => {
    const item: ITelemetryItem = {
      name: "pageview",
      baseType: "PageviewData",
      baseData: { name: "Plan", uri: "https://app/plan?user=123", refUri: "https://app/hr?tab=1" },
    };
    removeQueryStrings(item);
    expect(item.baseData).toEqual({
      name: "Plan",
      uri: "https://app/plan",
      refUri: "https://app/hr",
    });
  });

  it("leaves other telemetry types untouched", () => {
    const item: ITelemetryItem = {
      name: "exception",
      baseType: "ExceptionData",
      baseData: { message: "a?b" },
    };
    removeQueryStrings(item);
    expect(item.baseData).toEqual({ message: "a?b" });
  });
});

describe("toError", () => {
  it("keeps Error instances", () => {
    const error = new TypeError("Failed to fetch");
    expect(toError(error)).toBe(error);
  });

  it("uses the message of plain Supabase error objects", () => {
    const supabaseError = { message: "permission denied for table assignments", code: "42501" };
    expect(toError(supabaseError).message).toBe("permission denied for table assignments");
  });

  it("falls back to the string form", () => {
    expect(toError("boom").message).toBe("boom");
  });
});
