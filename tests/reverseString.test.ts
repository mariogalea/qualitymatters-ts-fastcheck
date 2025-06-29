import { reverseString } from '../src/reverseString';
import fc from 'fast-check';

describe('reverseString', () => {
  it('should reverse a string twice to get the original', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        return reverseString(reverseString(s)) === s;
      })
    );
  });
});
