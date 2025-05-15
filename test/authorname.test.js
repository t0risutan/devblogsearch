import { expect } from 'chai';
import { getAuthorName,getAuthorId } from '../scripts/devblog/devblog.js';

describe('Test author names to IDs mapping', () => {
  const testCases = [
    { name:'Paul A. Blokk', id:'paul-a--blokk', back:'Paul A--Blokk'},
    { name:'Paul A. Blokk  ', id:'paul-a--blokk', back:'Paul A--Blokk'},
    { name:'Paul A.Blokk', id:'paul-a-blokk', back:'Paul A-Blokk'},
    { name:'Paul.A.Blokk', id:'paul-a-blokk', back:'Paul A-Blokk'},
    { name:'Paul Arkner (Blokk)', id:'paul-arkner--blokk-', back:'Paul Arkner--Blokk-'},
  ];

  testCases.forEach(tc => {
    it(`Correctly maps [${tc.name}] to [${tc.id}]`, () => {
      expect(getAuthorId(tc.name)).to.equal(tc.id);

    });
    it(`Correctly maps back [${tc.id}] to [${tc.back}]`, () => {
      expect(getAuthorName(tc.id)).to.equal(tc.back);

    });
  });
});