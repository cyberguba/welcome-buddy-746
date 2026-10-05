const SITE_NAME = "Postimees sisseelamine";

export function buildPageMeta(title: string, description: string) {
  const fullTitle = `${title} — ${SITE_NAME}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
    ],
  };
}
