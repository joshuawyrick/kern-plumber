---
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import '@/styles/global.css';
import UtilityBar from '@/components/UtilityBar.astro';
import Header from '@/components/Header.astro';
import Breadcrumbs from '@/components/Breadcrumbs.astro';
import Footer from '@/components/Footer.astro';
import MobileStickyBar from '@/components/MobileStickyBar.astro';
import { absoluteUrl, GA4_ID, localeForRoute, PUBLIC_EMAIL, SITE_NAME, SITE_URL, twinForRoute, PHONE_NUMBER } from '@/lib/site';
import { extractFaqs, type PageData } from '@/lib/content';

interface Props { page: PageData; }
const { page } = Astro.props;
const locale = localeForRoute(page.route);
const twin = twinForRoute(page.route);
const canonical = absoluteUrl(page.route);
const englishUrl = locale === 'en' ? canonical : twin ? absoluteUrl(twin) : undefined;
const spanishUrl = locale === 'es' ? canonical : twin ? absoluteUrl(twin) : undefined;
const description = page.meta || page.h1;
const faqs = extractFaqs(page);
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'Plumber',
  name: SITE_NAME,
  telephone: PHONE_NUMBER,
  email: PUBLIC_EMAIL,
  areaServed: [
    { '@type': 'City', name: 'Bakersfield' },
    { '@type': 'City', name: 'Delano' },
    { '@type': 'City', name: 'Arvin' },
    { '@type': 'City', name: 'Taft' },
    { '@type': 'City', name: 'Tehachapi' },
    { '@type': 'AdministrativeArea', name: 'Kern County, CA' }
  ],
  openingHours: 'Mo-Su 00:00-23:59',
  url: SITE_URL
};
const faqSchema = faqs.length ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question', name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer }
  }))
} : null;
const arrivalConversion = page.route === '/thank-you/' || page.route === '/es/gracias/';
---
<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{page.title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="canonical" href={canonical} />
    {page.noindex && <meta name="robots" content="noindex,follow" />}
    {englishUrl && <link rel="alternate" hreflang="en" href={englishUrl} />}
    {spanishUrl && <link rel="alternate" hreflang="es" href={spanishUrl} />}
    {englishUrl && <link rel="alternate" hreflang="x-default" href={englishUrl} />}
    {!englishUrl && locale === 'en' && <link rel="alternate" hreflang="en" href={canonical} />}
    {!englishUrl && locale === 'en' && <link rel="alternate" hreflang="x-default" href={canonical} />}

    <meta property="og:title" content={page.title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={`${SITE_URL}/images/og-placeholder.webp`} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:locale" content={locale === 'es' ? 'es_US' : 'en_US'} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={page.title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`${SITE_URL}/images/og-placeholder.webp`} />

    <link rel="preload" href="/images/hero-placeholder.webp" as="image" type="image/webp" />
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#FAFAF8" />

    <script is:inline type="application/ld+json" set:html={JSON.stringify(localBusiness)} />
    {faqSchema && <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />}

    <!-- REPLACE WITH REAL GA4 ID -->
    <script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}></script>
    <script is:inline define:vars={{ GA4_ID }}>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA4_ID);
    </script>
    <!-- CALLRAIL DNI SNIPPET HERE -->
  </head>
  <body>
    <a class="skip-link" href="#main-content">{locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
    <UtilityBar locale={locale} />
    <Header route={page.route} locale={locale} />
    <Breadcrumbs route={page.route} />
    <main id="main-content">
      <slot />
    </main>
    <Footer route={page.route} locale={locale} />
    <MobileStickyBar locale={locale} route={page.route} />
    <script is:inline define:vars={{ arrivalConversion }}>
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;
        if (link.matches('[data-phone-link]')) {
          /* GA4 conversion */
          window.gtag?.('event', 'phone_click', { page_path: window.location.pathname });
        }
        if (link.matches('[data-sms-link]')) {
          /* GA4 conversion */
          window.gtag?.('event', 'sms_click', { page_path: window.location.pathname });
        }
      });
      if (arrivalConversion) {
        /* GA4 conversion */
        window.gtag?.('event', 'lead_form_submit', { page_path: window.location.pathname });
      }
    </script>
  </body>
</html>
