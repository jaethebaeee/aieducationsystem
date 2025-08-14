## Search/IR PhD — Technical SEO Lead (KR-first)

Purpose: Ensure perfect crawl, render, and indexation for a CSR React app in the Korean market (Naver Yeti, Bing, Google), while building durable information architecture, schema, and measurement.

### Profile
- 5–10+ years in search/IR or web rendering (Google/Bing/Naver, major crawler, or leading JS-SEO platform)
- Deep expertise: bot rendering, pre-render/SSR tradeoffs, log analysis, link graphs, schema at scale, Core Web Vitals
- Korea-first: experience with Naver/Yeti crawler behavior and Bing parity

### Mission (30/60/90)
- 30 days
  - Crawl diagnostics: server logs + GSC + Naver WMT; JS-render parity checks (users vs bots)
  - Bot rendering reliability: Rendertron tuning, Nginx routing, cache strategy; failover detection
  - Index hygiene: robots/sitemap/headers audit; private route protection, canonicals
- 60 days
  - IA and internal links: hub/cluster design; university/topic entities graph; crawl budget efficiency
  - Schema program: Organization, WebSite, Article, FAQ, Product, Breadcrumb at scale; templates + governance
  - CWV roadmap: budgets, RUM, image/CDN strategy; bundle split plan (future SSR/Next path)
- 90 days
  - KR market parity: Naver/Bing diagnostics dashboard, parity KPIs, anomaly alerts
  - Content signals: E-E-A-T integration, author/entity markup, review/UGC policy, KR-language authority plan
  - Experimentation: diff-in-diff SEO framework; guardrail KPIs

### KPIs
- Bot-render success rate (Naver/Google/Bing) ≥ 99%
- Indexed-to-submitted ratio (sitemaps) ≥ 95%
- Private-route indexation leakage ≤ 0.5%
- CWV: LCP p75 ≤ 2.5s, INP p75 ≤ 200ms, CLS p75 ≤ 0.1 (field)
- KR parity: Naver impressions/clicks within 10–15% of Google trend-adjusted baseline for public pages

### Deliverables
- Crawl and rendering playbook (Nginx + prerender config, bot lists, cache)
- Link architecture spec and internal linking rules (components + CMS guidance)
- Schema templates (React + JSON-LD utilities) and validation CI checks
- Monitoring: log-based crawler dashboard, Search Console + Naver WMT pipelines
- A/B-safe SEO change protocol, experiment templates and MDE calculators

### Interview Rubric (signals)
- Diagnoses a CSR SPA with poor Naver indexing and proposes concrete prerender/SSR tradeoffs
- Reads nginx rules and suggests safer bot UA detection and fallback strategies
- Designs a KR-first IA and entity schema strategy (universities, majors, financial aid) with measurable tests
- Explains how to measure “JS render success” and detect cloaking risks vs dynamic rendering
- Produces a plan for Core Web Vitals with minimal rewrites; outlines staged SSR migration

### First 2-week Task List (for AdmitAI Korea)
- Validate dynamic rendering:
  - Fetch as Yeti/Bingbot/Googlebot; confirm fully rendered HTML, correct canonicals, hreflang-off, and robots
  - Add synthetic checks + alerts for prerender timeouts and 5xx
- Sitemap/robots:
  - Build sitemap generator (future) for public routes; ensure daily timestamps and coverage tests
  - Robots: verify disallows match app guards; add stage-specific controls
- Schema rollout:
  - Add WebSite JSON-LD with potentialAction (SearchAction) on homepage
  - Add FAQPage schema to Pricing and About where content fits
  - Author/Organization enrichment (logo dimensions, social verification)
- Measurement:
  - Set up Naver WMT; implement log shipping to dashboard; define render pass rate KPIs

### Longer-term Architecture
- Partial SSR (Next.js) for public pages, retain SPA for app; preserve dynamic rendering until decommissioned
- Content platform for schema-rich articles and university weather briefs with KR NLP entity extraction

