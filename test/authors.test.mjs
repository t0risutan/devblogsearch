import { expect } from 'chai';
import { getAuthorPagePath, getAuthorInfoFromPathAndHash } from '../scripts/devblog/authors.js';

describe('Test author pages paths mapping', () => {
  const codeRoot = '/code/root';

  // These are the mappings before the May 16 2025 changes
  // Including problematic strings such as '--' or and ending '-'
  const testCases = [
    { name:'Paul Blokk', path:'/code/root/en/authors/Paul_20Blokk', imageFilename:'paul-blokk' },
    { name:'Mark A. Bee', path:'/code/root/en/authors/Mark_20A#_20Bee', imageFilename:'mark-a-bee' },
    { name:'Simon F. Gee (The Boss)', path:'/code/root/en/authors/Simon_20F#_20Gee_20(The_20Boss)', imageFilename:'simon-f-gee-the-boss' },
    { name:'C', path:'/code/root/en/authors/C', imageFilename:'c' },
    { name:'CafeBa b  e.', path:'/code/root/en/authors/CafeBa_20b_20_20e#', imageFilename:'cafeba-b-e' },
    { name:'Michel F. Scherrer', path:'/code/root/en/authors/Michel_20F#_20Scherrer', imageFilename:'michel-f-scherrer'},
    { name:'Simon G Gardner (Gardisto)', path:'/code/root/en/authors/Simon_20G_20Gardner_20(Gardisto)', imageFilename:'simon-g-gardner-gardisto'}
  ];

  testCases.forEach(tc => {
    it(`Correctly maps [${tc.name}] to its page path`, () => {
      const path = getAuthorPagePath(codeRoot, tc.name);
      expect(path).to.equal(tc.path);

    });
  });

  testCases.forEach(tc => {
    it(`Correctly maps the author path [${tc.path}] back to its name and image filename`, () => {
      const info = getAuthorInfoFromPathAndHash(tc.path);
      expect(info.authorName).to.equal(tc.name);
      expect(info.authorImageFilename).to.equal(tc.imageFilename);
    });
  });
});