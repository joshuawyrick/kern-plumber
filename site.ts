---
import Icon from './Icon.astro';
import PhoneLink from './PhoneLink.astro';
import { PUBLIC_EMAIL, cityLinksFor, serviceLinksFor } from '@/lib/site';
const { route, locale = 'en' } = Astro.props;
const es = locale === 'es';
const services = serviceLinksFor(route);
const cities = cityLinksFor(route);
---
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href={es ? '/es/' : '/'} class="brand">
        <span class="brand-mark" aria-hidden="true"><Icon name="droplets" size={24} /></span>
        <span class="brand-copy"><strong>Kern Plumbing</strong><span>Pros</span></span>
      </a>
      <p>Kern Plumbing Pros<br />Serving Kern County, CA</p>
      <p><PhoneLink /><br /><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a></p>
    </div>
    <div>
      <h2>{es ? 'Servicios' : 'Services'}</h2>
      <ul>{services.map((item) => <li><a href={item.href}>{item.label}</a></li>)}</ul>
    </div>
    <div>
      <h2>{es ? 'Áreas de Servicio' : 'Service Areas'}</h2>
      <ul>{cities.map((item) => <li><a href={item.href}>{item.label}</a></li>)}</ul>
    </div>
    <div>
      <h2>{es ? 'Horario y Servicio' : 'Hours & Service'}</h2>
      <p>{es ? '24/7 — servicio de emergencia disponible.' : '24/7 — emergency service available.'}</p>
      <p>{es ? 'Precios por adelantado — usted aprueba el precio antes de empezar.' : 'Upfront pricing — you approve the price before work begins.'}</p>
      <p>{es ? 'Plomeros con licencia y seguro.' : 'Licensed & insured plumbers.'}</p>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© {new Date().getFullYear()} Kern Plumbing Pros</span>
    <span><a href="/privacy-policy/">Privacy Policy</a><a href="/terms/">Terms</a></span>
  </div>
</footer>
