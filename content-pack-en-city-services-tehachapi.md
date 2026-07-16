import type { APIRoute } from 'astro';
import { loadPages } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

export const GET: APIRoute = () => {
  const urls = loadPages().filter((page) => !page.noindex && page.route !== '/404/');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((page) => `  <url><loc>${absoluteUrl(page.route)}</loc><changefreq>monthly</changefreq><priority>${page.route === '/' || page.route === '/es/' ? '1.0' : '0.7'}</priority></url>`).join('\n')}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
