import { expect } from 'chai';
import { getAuthorPagePath, getAuthorInfoFromPath } from '../scripts/devblog/authors.js';

describe('Test author pages paths mapping', () => {
  const codeRoot = '/code/root';

  // These are the mappings before the May 16 2025 changes
  // Including problematic strings such as '--' or and ending '-'
  const testCasesBeforeMappingChanges = [
    { name:'Paul Blokk', path:'/code/root/en/authors/paul-blokk', imageFilename:'paul-blokk' },
    { name:'Mark A. Bee', path:'/code/root/en/authors/mark-a--bee', imageFilename:'mark-a--bee' },
    { name:'Simon F. Gee (The Boss)', path:'/code/root/en/authors/simon-f--gee--the-boss-', imageFilename:'simon-f--gee--the-boss-' },
    { name:'C', path:'/code/root/en/authors/c', imageFilename:'c' },
    { name:'CafeBa b  e.', path:'/code/root/en/authors/cafeba-b--e-', imageFilename:'cafeba-b--e-' },
  ];

  // Add new mappings that do not have these problematic strings
  const testCases = [
    ...testCasesBeforeMappingChanges,
    /*
    { name:'Mark A. Bee', path:'/code/root/en/authors/mark-a-bee'},
    { name:'Simon F. Gee (The Boss)', path:'/code/root/en/authors/simon-f-gee-the-boss'},
    { name:'C', path:'/code/root/en/authors/c'},
    { name:'CafeBa b  e.', path:'/code/root/en/authors/cafeba-b-e'},
    */
  ];

  testCases.forEach(tc => {
    it(`Correctly maps [${tc.name}] to its page path`, () => {
      const path = getAuthorPagePath(codeRoot, tc.name);
      expect(path).to.equal(tc.path);

    });
  });

  testCases.forEach(tc => {
    it(`Correctly maps the author path [${tc.path}] back to its name and image filename`, () => {
      const info = getAuthorInfoFromPath(tc.path);
      //expect(info.authorName).to.equal(tc.name);
      expect(info.authorImageFilename).to.equal(tc.imageFilename);
    });
  });
});