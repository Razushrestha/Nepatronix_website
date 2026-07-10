/**
 * Image URLs often include query strings with `&`.
 * In XML (including sitemap.xml), bare `&` must be written as `&amp;` or parsers fail with EntityRef errors.
 * Crawlers resolve `&amp;` in `<loc>` / `<image:loc>` the same as `&` in the URL.
 */
export function escapeXmlUrlForSitemap(url: string): string {
  if (!url.includes("&")) return url;
  return url.replace(/&/g, "&amp;");
}
