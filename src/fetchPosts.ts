import https from 'https';

export async function fetchPosts(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    https.get('https://jsonplaceholder.typicode.com/posts', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
