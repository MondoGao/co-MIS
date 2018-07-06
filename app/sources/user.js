import handler, { gqlClient } from './handler';
import gql from 'graphql-tag';

import { getCards } from './cards';

export async function add({ name, rfid, type = 2 }) {
  const { data } = await gqlClient.mutate({
    mutation: gql`
      mutation($data: UserQuery) {
        users(data: $data) {
          rfid
          name
          type
          id
        }
      }
    `,
    variables: {
      data: {
        name,
        rfid,
        type,
      },
    },
  });
}

export async function login() {
  const rfidArr = await getCards(1);

  const rfid = rfidArr[0].EPCString;

  const { data } = await gqlClient.query({
    query: gql`
      query($query: UserQuery) {
        users(query: $query) {
          rfid
          name
          type
          id
        }
      }
    `,
    variables: {
      query: {
        rfid,
      },
    },
  });
}
