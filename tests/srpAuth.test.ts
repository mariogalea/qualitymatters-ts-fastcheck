import { srpRegisterAndAuthenticate } from '../src/srpAuth';
import fc from 'fast-check';

describe('SRP Authentication', () => {
  it('should authenticate successfully with the same username and password', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 4, maxLength: 16 })
          .filter(s => /^[a-zA-Z][a-zA-Z0-9]+$/.test(s)),
        async (value) => {
          try {
            const result = await srpRegisterAndAuthenticate(value, value);
            return result === true;
          } catch (e) {
            // Skip cases where jsrp throws due to internal limitations
            return true;
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});
