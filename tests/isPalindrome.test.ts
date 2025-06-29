import { isPalindrome } from '../src/isPalindrome';
import fc from 'fast-check';

describe('isPalindrome', () => {
  it('should return true for any string that is the same forwards and backwards (ignoring case and non-alphanumerics)', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        // Normalize string: remove non-alphanumerics, lowercase
        const normalized = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const reversed = normalized.split('').reverse().join('');
        // If normalized === reversed, isPalindrome should be true
        if (normalized === reversed && normalized.length > 0) {
          return isPalindrome(s) === true;
        }
        // Otherwise, we don't care about the result
        return true;
      })
    );
  });

  it('should return false for a string and its reverse if they are not palindromes', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        // Skip palindromes
        const normalized = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const reversed = normalized.split('').reverse().join('');
        if (normalized.length > 0 && normalized !== reversed) {
          return isPalindrome(s) === false || isPalindrome(s.split('').reverse().join('')) === false;
        }
        return true;
      })
    );
  });
});
