---
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageRenderer from '@/components/PageRenderer.astro';
import { pageForRoute } from '@/lib/content';
const page = pageForRoute('/404/');
if (!page) throw new Error('404 content is missing');
---
<BaseLayout page={page}><PageRenderer page={page} locale="en" /></BaseLayout>
