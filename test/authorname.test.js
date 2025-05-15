import { expect } from 'chai';
import { getAuthorName,getAuthorId } from '../scripts/devblog/devblog.js';

describe('Test author names to IDs mapping', () => {
  it('computes author ID correctly', () => {
    expect(getAuthorId('Paul A. Blokk')).to.equal('paul-a--blokk');
  });

  it('computes author name correctly', () => {
    expect(getAuthorName('bab-el-plakk')).to.equal('Bab El-Plakk');
  });
});