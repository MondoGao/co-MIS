import ApolloClient from 'apollo-boost';
import { delay } from '@/utils';

export const publicPath = 'http://localhost:3000/';
export const graphqlPath = 'http://localhost:3000/graphql';

export const gqlClient = new ApolloClient({
  uri: graphqlPath,
});

export default async function handler(url, options, mockData) {
  if (mockData) {
    await delay(Math.random() * 600 + 300);
    return mockData;
  }

  return fetch(`${publicPath}${url}`, options);
}
