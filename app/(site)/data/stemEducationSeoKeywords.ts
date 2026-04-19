import stemEducationSeoKeywordsJson from "./stem-education-seo-keywords.json";

/** Curated STEM / STEAM / science-education phrases for meta keywords (deduped in source JSON). */
export const STEM_EDUCATION_SEO_KEYWORDS: readonly string[] =
  stemEducationSeoKeywordsJson as string[];

/** Case-insensitive dedupe; preserves first spelling of each phrase. */
export function mergeSeoKeywordGroups(
  ...parts: (string | readonly string[])[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const items = typeof p === "string" ? [p] : [...p];
    for (const x of items) {
      const k = String(x).trim();
      if (!k) continue;
      const low = k.toLowerCase();
      if (seen.has(low)) continue;
      seen.add(low);
      out.push(k);
    }
  }
  return out;
}
