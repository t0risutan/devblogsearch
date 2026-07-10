/**
 * Example browser test: runs under Web Test Runner (real browser), not `npm test` (Node Mocha).
 * Run: npm run test:browser
 */
import { expect } from '@esm-bundle/chai';

describe('DOM example (Web Test Runner + Mocha)', () => {
  it('creates an element and reads it back from the document', () => {
    const el = document.createElement('div');
    el.id = 'wtr-example-fixture';
    el.textContent = 'hello';
    document.body.appendChild(el);

    const found = document.getElementById('wtr-example-fixture');
    expect(found).to.be.an.instanceof(HTMLDivElement);
    expect(found.textContent).to.equal('hello');

    el.remove();
  });
});
