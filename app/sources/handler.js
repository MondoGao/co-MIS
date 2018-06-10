import { delay } from '@/utils';

export const publicPath = 'http://localhost:3000/';

export default async function handler(url, options, mockData) {
  if (mockData) {
    await delay(Math.random() * 600 + 300);
    return mockData;
  }

  return fetch(`${publicPath}${url}`, options);
}
