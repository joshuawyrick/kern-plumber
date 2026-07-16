---
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageRenderer from '@/components/PageRenderer.astro';
import { loadPages } from '@/lib/content';
import { localeForRoute } from '@/lib/site';

export function getStaticPaths() {
  return loadPages()
    .filter((page) => page.route !== '/' && page.route !== '/404/')
    .map((page) => ({ params: { slug: page.route.replace(/^\/|\/$/g, '') }, props: { page } }));
}
const { page } = Astro.props;
const locale = localeForRoute(page.route);
---
<BaseLayout page={page}><PageRenderer page={page} locale={locale} /></BaseLayout>
