# SEO Pre-Launch QA Checklist

## Crawl and Indexing
- [ ] `robots.txt` is reachable and correct at `/robots.txt`.
- [ ] `sitemap.xml` is reachable and contains only valid indexable URLs.
- [ ] Canonical URLs use `https://nepatronix.org` consistently.
- [ ] Private routes (`/admin`, `/studio`, APIs) are blocked or noindexed as intended.
- [ ] Key pages are request-indexed in Google Search Console.

## Metadata and Social Cards
- [ ] Every key page has unique title and description.
- [ ] Canonical is present for all key route groups.
- [ ] Open Graph and Twitter metadata are present and accurate.
- [ ] Site icon and manifest icons render clearly on desktop and mobile.

## Structured Data
- [ ] Organization/WebSite schema validates with no critical errors.
- [ ] Breadcrumb schema exists on major route groups.
- [ ] Course/Video/FAQ schema validates on relevant pages.
- [ ] Contact page schema includes email, phone, and organization links.

## Performance (Core Web Vitals)
- [ ] Mobile LCP for `/` is under 2.5s.
- [ ] Mobile LCP for `/services` is under 2.5s.
- [ ] Mobile INP is under 200ms on top pages.
- [ ] CLS is under 0.1 on top pages.
- [ ] Non-critical images are lazy-loaded and sized correctly.

## Content and Internal Linking
- [ ] Homepage links to services, courses, contact, and blog.
- [ ] Services and blog pages include contextual internal links.
- [ ] Important pages have clear H1 and topical relevance.
- [ ] Duplicate/legacy pages are noindexed or cleaned up.

## Search Console and Bing
- [ ] Google property is verified and sitemap submitted.
- [ ] Bing Webmaster property is verified and sitemap submitted.
- [ ] Coverage report has no unexpected spikes in exclusions.
- [ ] Rich results and schema validation checks are complete.

## AI Discovery
- [ ] `/llms.txt` and `/llms-full.txt` are live and accurate.
- [ ] AI-facing docs list canonical URLs and current key pages.
- [ ] Organization details are consistent across metadata and schema.
