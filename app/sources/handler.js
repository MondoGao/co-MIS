import ApolloClient from 'apollo-boost';
import { delay } from '@/utils';

export const publicPath = 'http://192.168.0.11:54759/api/';
export const graphqlPath = 'http://localhost:3000/graphql';

export const gqlClient = new ApolloClient({
  uri: graphqlPath,
  cache: null,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default async function handler(url, options, mockData) {
  if (mockData) {
    await delay(Math.random() * 600 + 300);
    return mockData;
  }

  console.log(url, options);

  const res = await fetch(`${publicPath}${url}`, options);

  if (res.status >= 400 || res.status < 200) {
    throw new Error(res.statusText);
  }

  return res.json();
}
