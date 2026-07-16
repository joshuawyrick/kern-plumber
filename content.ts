---
import Icon from './Icon.astro';
import PhoneLink from './PhoneLink.astro';
import { PHONE_DISPLAY, PHONE_TEL, richTextForRoute } from '@/lib/site';
import { heroAlt, needsLeadForm, type PageData } from '@/lib/content';
interface Props { page: PageData; locale?: 'en' | 'es'; }
const { page, locale = 'en' } = Astro.props;
const es = locale === 'es';
const isHome = page.route === '/' || page.route === '/es/';
const hero = page.sections.find((section) => section.name === 'hero');
const lineValue = (key: string) => hero?.lines.find((line) => line.startsWith(`${key}:`))?.slice(key.length + 1).trim();
const subhead = lineValue('Subhead');
const cta1 = lineValue('CTA-1');
const cta2 = lineValue('CTA-2');
const badges = (lineValue('Trust badges') || '').split(' · ').filter(Boolean);
const requestHref = needsLeadForm(page) ? '#request-service' : (es ? '/es/contacto/' : '/contact/');
const category = page.route.includes('/services/') || page.route.includes('/servicios/') ? (es ? 'SERVICIO DE PLOMERÍA' : 'PLUMBING SERVICE') : page.route.includes('/locations/') || page.route.includes('/areas-de-servicio/') ? (es ? 'ÁREA DE SERVICIO' : 'SERVICE AREA') : (es ? 'KERN PLUMBING PROS' : 'KERN PLUMBING PROS');
---
{isHome ? (
  <section class="home-hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">{es ? 'PLOMERÍA LOCAL DEL CONDADO DE KERN' : 'KERN COUNTY LOCAL PLUMBING'}</span>
        <h1>{page.h1}</h1>
        {subhead && <p class="hero-subhead" set:html={richTextForRoute(subhead, page.route)} />}
        <div class="hero-actions">
          <a href={PHONE_TEL} class="button button-primary" data-phone-link><Icon name="phone" />{cta1}</a>
          <a href={requestHref} class="button button-secondary">{cta2}<Icon name="arrow-right" /></a>
        </div>
        <div class="trust-badges" aria-label={es ? 'Beneficios del servicio' : 'Service benefits'}>
          {badges.map((badge) => <span><Icon name="check" size={16} />{badge}</span>)}
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-image-frame">
          <img src="/images/hero-placeholder.webp" width="960" height="720" alt={heroAlt(page)} fetchpriority="high" />
        </div>
        <div class="hero-phone-panel">
          <span>{es ? 'LLAME O MANDE TEXTO — 24/7' : 'CALL OR TEXT — 24/7'}</span>
          <PhoneLink />
        </div>
      </div>
    </div>
  </section>
) : (
  <section class="interior-hero">
    <div class="container interior-hero-grid">
      <div class="interior-hero-copy">
        <span class="eyebrow">{category}</span>
        <h1>{page.h1}</h1>
        <div class="interior-actions">
          <a href={PHONE_TEL} class="button button-primary" data-phone-link><Icon name="phone" />{es ? 'Llame al (661) 555-0142' : `Call ${PHONE_DISPLAY}`}</a>
          <a href={requestHref} class="button button-secondary">{es ? 'Solicitar Servicio' : 'Request Service'}<Icon name="arrow-right" /></a>
        </div>
      </div>
      <div class="interior-visual">
        {page.imageAlts.some((line) => line.toLowerCase().startsWith('hero:')) && (
          <div class="interior-image-frame"><img src="/images/hero-placeholder.webp" width="960" height="720" alt={heroAlt(page)} loading="eager" /></div>
        )}
        <div class="interior-phone-card">
          <div class="icon-container"><Icon name="phone" size={27} /></div>
          <div><span>{es ? 'RESPUESTA 24/7' : '24/7 RESPONSE'}</span><PhoneLink /></div>
        </div>
      </div>
    </div>
  </section>
)}
