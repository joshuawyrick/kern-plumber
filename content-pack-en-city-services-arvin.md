---
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageRenderer from '@/components/PageRenderer.astro';
import { pageForRoute } from '@/lib/content';
const page = pageForRoute('/');
if (!page) throw new Error('Homepage content is missing');
---
<BaseLayout page={page}><PageRenderer page={page} locale="en" /></BaseLayout>
