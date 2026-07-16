import fs from 'node:fs';
import path from 'node:path';
import { cities, normalizeRoute, servicesEn, servicesEs } from './site';

export type ContentSection = { name: string; lines: string[] };
export type PageData = {
  route: string;
  title: string;
  meta: string;
  h1: string;
  sections: ContentSection[];
  imageAlts: string[];
  linkAnchors: string[];
  noindex: boolean;
  source: string;
  missingPack?: boolean;
};

const packFiles = [
  'content-pack-en-core.md',
  'content-pack-en-services-batch1.md',
  'content-pack-en-services-batch2.md',
  'content-pack-en-services-batch3.md',
  'content-pack-en-services-batch4.md',
  'content-pack-en-cities.md',
  'content-pack-en-city-services-delano.md',
  'content-pack-en-city-services-arvin.md',
  'content-pack-en-city-services-taft.md',
  'content-pack-en-city-services-tehachapi.md',
  'content-pack-es-core.md',
  'content-pack-es-services-and-cities.md',
  'content-pack-es-city-services-delano-arvin.md'
];

function parsePageBlock(raw: string, source: string): PageData | null {
  const lines = raw.replace(/\r/g, '').split('\n');
  const pageLine = lines.find((line) => line.startsWith('## PAGE:'));
  if (!pageLine) return null;
  const routeToken = pageLine.replace('## PAGE:', '').trim();
  const noindex = /noindex/i.test(routeToken) || routeToken.startsWith('404');
  const routeRaw = routeToken.replace(/\s*\(.*?\)\s*$/, '').trim();
  const route = routeRaw === '404' ? '/404/' : normalizeRoute(routeRaw);
  const value = (key: string) => lines.find((line) => line.startsWith(`${key}:`))?.slice(key.length + 1).trim() || '';
  const title = value('TITLE');
  const meta = value('META');
  const h1 = value('H1');
  const h1Index = lines.findIndex((line) => line.startsWith('H1:'));
  const sections: ContentSection[] = [];
  const imageAlts: string[] = [];
  const linkAnchors: string[] = [];
  let current: ContentSection | null = null;
  let mode: 'body' | 'alts' | 'links' = 'body';

  const addCurrent = () => {
    if (current && current.lines.some((line) => line.trim())) sections.push({ ...current, lines: current.lines.filter((line) => line.trim()) });
    current = null;
  };

  for (let i = h1Index + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line || line === '---' || /^\(.*twin.*\)$/i.test(line)) continue;
    if (line.startsWith('### IMAGE-ALTS')) { addCurrent(); mode = 'alts'; continue; }
    if (line.startsWith('### LINK-ANCHORS')) { addCurrent(); mode = 'links'; continue; }
    if (line.startsWith('### SECTION:')) {
      addCurrent();
      current = { name: line.replace('### SECTION:', '').trim(), lines: [] };
      mode = 'body';
      continue;
    }
    if (mode === 'alts') { imageAlts.push(line); continue; }
    if (mode === 'links') { linkAnchors.push(line); continue; }

    const compact = line.match(/^(INTRO|SEÑALES|CTA|ANCLAS):\s*(.*)$/);
    if (compact) {
      addCurrent();
      const names: Record<string, string> = { INTRO: 'direct-answer intro', 'SEÑALES': 'symptoms', CTA: 'cta', ANCLAS: 'anchors' };
      current = { name: names[compact[1]], lines: [compact[2]] };
      addCurrent();
      continue;
    }
    if (line.startsWith('ÁNGULO LOCAL')) {
      addCurrent();
      const colon = line.indexOf(':');
      current = { name: 'local-detail', lines: colon > -1 ? [`H2: ${line.slice(0, colon).replace('ÁNGULO LOCAL — ', '')}`, line.slice(colon + 1).trim()] : [line] };
      addCurrent();
      continue;
    }
    if (line.startsWith('FAQ —')) {
      addCurrent();
      current = { name: 'faq', lines: [line.replace(/^FAQ —\s*/, '')] };
      addCurrent();
      continue;
    }
    if (!current) current = { name: 'content', lines: [] };
    current.lines.push(line.replace(/^Body:\s*/, ''));
  }
  addCurrent();
  return { route, title, meta, h1, sections, imageAlts, linkAnchors, noindex, source };
}

function parsePacks(): PageData[] {
  const pages: PageData[] = [];
  for (const file of packFiles) {
    const fullPath = path.join(process.cwd(), file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const blocks = raw.split(/(?=^## PAGE:)/m).slice(1);
    for (const block of blocks) {
      const page = parsePageBlock(block, file);
      if (page) pages.push(page);
    }
  }
  return pages;
}

const stubs: PageData[] = [
  { route: '/services/', title: 'Plumbing Services | Kern Plumbing Pros', meta: 'Browse plumbing services available in Bakersfield and Kern County, CA.', h1: 'Plumbing Services in Kern County', sections: [{ name: 'services-hub', lines: [] }], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true },
  { route: '/locations/', title: 'Service Areas | Kern Plumbing Pros', meta: 'Browse plumbing service areas across Bakersfield and Kern County, CA.', h1: 'Plumbing Service Areas in Kern County', sections: [{ name: 'locations-hub', lines: [] }], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true },
  { route: '/es/servicios/', title: 'Servicios de Plomería | Kern Plumbing Pros', meta: 'Vea los servicios de plomería disponibles en Bakersfield y el condado de Kern.', h1: 'Servicios de Plomería en el Condado de Kern', sections: [{ name: 'services-hub', lines: [] }], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true },
  { route: '/es/areas-de-servicio/', title: 'Áreas de Servicio | Kern Plumbing Pros', meta: 'Vea las áreas de servicio de plomería en Bakersfield y el condado de Kern.', h1: 'Áreas de Servicio de Plomería', sections: [{ name: 'locations-hub', lines: [] }], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true },
  { route: '/emergency/', title: 'Emergency Plumbing | Kern Plumbing Pros', meta: 'Emergency plumbing service information for Kern County, CA.', h1: 'Emergency Plumbing in Kern County', sections: [], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true },
  { route: '/privacy-policy/', title: 'Privacy Policy | Kern Plumbing Pros', meta: 'Privacy policy for Kern Plumbing Pros.', h1: 'Privacy Policy', sections: [], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true },
  { route: '/terms/', title: 'Terms | Kern Plumbing Pros', meta: 'Website terms for Kern Plumbing Pros.', h1: 'Terms', sections: [], imageAlts: [], linkAnchors: [], noindex: false, source: 'build-spec.md', missingPack: true }
];

let cached: PageData[] | null = null;
export function loadPages(): PageData[] {
  if (!cached) cached = [...parsePacks(), ...stubs].sort((a, b) => a.route.localeCompare(b.route));
  return cached;
}

export function pageForRoute(route: string): PageData | undefined {
  return loadPages().find((page) => page.route === normalizeRoute(route));
}

export function extractFaqs(page: PageData): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  for (const section of page.sections.filter((s) => s.name.toLowerCase().includes('faq'))) {
    let current: { question: string; answer: string } | null = null;
    for (const line of section.lines) {
      const compact = line.match(/^(?:P|Q):\s*(.*?)\s+(?:R|A):\s*(.*)$/);
      if (compact) {
        if (current) { faqs.push(current); current = null; }
        faqs.push({ question: compact[1], answer: compact[2] });
      } else if (line.startsWith('Q:') || line.startsWith('P:')) {
        if (current) faqs.push(current);
        current = { question: line.slice(2).trim(), answer: '' };
      } else if (line.startsWith('A:') || line.startsWith('R:')) {
        if (current) current.answer = line.slice(2).trim();
      }
    }
    if (current) faqs.push(current);
  }
  return faqs.filter((item) => item.question && item.answer);
}

export function heroAlt(page: PageData): string {
  const hero = page.imageAlts.find((line) => line.toLowerCase().startsWith('hero:'));
  return hero ? hero.replace(/^Hero:\s*/i, '') : (page.h1 || 'Kern Plumbing Pros service illustration');
}

export function relatedLinks(page: PageData): Array<{ href: string; label: string }> {
  const results: Array<{ href: string; label: string }> = [];
  const add = (href: string, label: string) => {
    const clean = href.startsWith('/') ? href : `/${href}`;
    if (!results.some((item) => item.href === clean && item.label === label)) results.push({ href: clean, label });
  };
  const raw = [...page.linkAnchors, ...page.sections.filter((s) => s.name === 'anchors').flatMap((s) => s.lines)].join(' ');
  for (const match of raw.matchAll(/→\s*(\/[^\s·]+)\s+(?:anchor\s+)?["“]([^"”]+)["”]/g)) add(match[1], match[2]);
  for (const match of raw.matchAll(/→\s*(\/[^\s·]+)\s+anchor\s+([^·]+)/g)) add(match[1], match[2].trim().replace(/^"|"$/g, ''));

  const enServiceMatch = page.route.match(/^\/services\/([^/]+)\/$/);
  if (enServiceMatch) {
    const service = servicesEn.find(([slug]) => slug === enServiceMatch[1]);
    if (service) {
      for (const [citySlug, city] of cities) {
        const href = citySlug === 'bakersfield-ca' ? `/locations/${citySlug}/` : `/locations/${citySlug}/${service[0]}/`;
        add(href, `${service[1].toLowerCase()} in ${city}`);
      }
    }
  }
  const esServiceMatch = page.route.match(/^\/es\/servicios\/([^/]+)\/$/);
  if (esServiceMatch) {
    const index = servicesEs.findIndex(([slug]) => slug === esServiceMatch[1]);
    if (index > -1) {
      const [esSlug, esLabel] = servicesEs[index];
      for (const [citySlug, city] of cities) {
        const href = citySlug === 'delano-ca' || citySlug === 'arvin-ca' ? `/es/areas-de-servicio/${citySlug}/${esSlug}/` : `/es/areas-de-servicio/${citySlug}/`;
        add(href, `${esLabel.toLowerCase()} en ${city}`);
      }
    }
  }
  return results.slice(0, 10);
}

export function needsLeadForm(page: PageData): boolean {
  if (page.route === '/' || page.route === '/es/' || page.route === '/contact/' || page.route === '/es/contacto/') return true;
  if (/^\/(?:es\/servicios|services)\//.test(page.route)) return true;
  if (/^\/locations\/[^/]+\/$/.test(page.route)) return true;
  if (/^\/es\/areas-de-servicio\/[^/]+\/$/.test(page.route)) return true;
  if (/^\/locations\/(?:delano-ca|arvin-ca|taft-ca|tehachapi-ca)\/[^/]+\/$/.test(page.route)) return true;
  if (/^\/es\/areas-de-servicio\/(?:delano-ca|arvin-ca)\/[^/]+\/$/.test(page.route)) return true;
  return page.sections.some((section) => section.name.includes('lead-form'));
}
