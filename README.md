# Kern Plumbing Pros

Editable, production-ready Astro source repository for GitHub, Bolt.new, and Netlify.

## Open in Bolt.new

1. Create a GitHub repository and upload every file and folder from this package.
2. In Bolt.new, import the GitHub repository.
3. Tell Bolt to preserve the existing Astro static-site architecture and run the existing project before editing.

Recommended first instruction for Bolt:

> Preserve this existing Astro static-site project. Do not convert it to React, Next.js, a Vite SPA, or another framework. Run `npm ci`, `npm run check`, and `npm run build` before making changes. Preserve all routes, English and Spanish content, metadata, structured data, hreflang, canonicals, sitemap generation, conversion tracking hooks, forms, and internal linking.

## Local development

```bash
npm ci
npm run dev
```

## Validation

```bash
npm run check
npm run build
npm run audit
```

## Netlify deployment

The included `netlify.toml` configures Netlify to run:

```bash
npm run build
```

and publish:

```text
dist
```

Connect Netlify to the same GitHub repository. Netlify will create `dist/` automatically, so generated build files should not be committed.

## Important files

- `src/` — layouts, components, route generation, styles, SEO, schema, forms, and tracking.
- `public/` — favicons, manifest, and image assets.
- `content-pack-*.md` — page content used by the Astro build. These files are required and must not be deleted.
- `netlify.toml` — Netlify build, publish, header, and redirect settings.
- `scripts/audit.mjs` — post-build site audit.

## Before public launch

1. Replace the placeholder phone number in `src/lib/site.ts` if needed.
2. Replace `G-XXXXXXXXXX` with the real GA4 measurement ID.
3. Add the real CallRail DNI snippet in `src/layouts/BaseLayout.astro`.
4. Confirm and activate the lead-form endpoint configured in `src/lib/site.ts`.
5. Replace placeholder images and review slots only with real business assets and real reviews.
