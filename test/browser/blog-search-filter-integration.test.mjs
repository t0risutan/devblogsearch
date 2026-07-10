/**
 * Integrationstest (Browser): dieselbe Modul-Logik wie in der App, aber im echten Browser
 * mit DOM — nicht nur Node/Mocha.
 *
 * Ausführen: npm run test:browser
 * (E2E mit laufendem `aem up`: npm run test:e2e — siehe test/e2e/)
 */
import { expect } from '@esm-bundle/chai';
import filterData from '../../web-components/search/blog-search-filter-data.js';

describe('blog-search filter integration (Web Test Runner)', () => {
  const rows = [
    {
      title: 'Intro to Creative Cloud',
      description: 'Overview for developers',
      path: '/en/publish/2024/intro-creative-cloud',
    },
    {
      title: 'AEM Forms Guide',
      description: 'Creative automation',
      path: '/en/publish/2024/aem-forms',
    },
  ];

  it('renders filterData results into a list like the search UI would', () => {
    const terms = ['creative'];
    const hits = filterData(terms, rows);

    const ul = document.createElement('ul');
    ul.className = 'search-results';
    hits.forEach((row) => {
      const li = document.createElement('li');
      li.dataset.path = row.path;
      li.textContent = row.title;
      ul.appendChild(li);
    });
    document.body.appendChild(ul);

    try {
      expect(ul.querySelectorAll('li')).to.have.lengthOf(2);
      const titles = [...ul.querySelectorAll('li')].map((li) => li.textContent);
      expect(titles.some((t) => t.includes('Creative'))).to.equal(true);
    } finally {
      ul.remove();
    }
  });

  it('simulates query-index payload shape: json.data passed through filterData', () => {
    const payload = { data: rows };
    const terms = ['aem'];
    const hits = filterData(terms, payload.data);

    expect(hits).to.have.lengthOf(1);
    expect(hits[0].title).to.equal('AEM Forms Guide');
  });
});
