import { fetchPosts } from '../src/fetchPosts';
import fc from 'fast-check';

describe('fetchPosts', () => {
  it('should return an array of posts with required properties', async () => {
    const posts = (await fetchPosts()) as Array<any>;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    // Property-based: every post has userId, id, title, and body
    fc.assert(
      fc.property(fc.integer({ min: 0, max: posts.length - 1 }), (i) => {
        const post = posts[i];
        return (
          typeof post.userId === 'number' &&
          typeof post.id === 'number' &&
          typeof post.title === 'string' &&
          typeof post.body === 'string'
        );
      })
    );
  });
});
