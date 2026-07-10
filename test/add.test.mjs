import add from '../scripts/add.js';
import { expect } from 'chai';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).to.equal(3);
  });
});