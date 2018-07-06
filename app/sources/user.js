import handler, { gqlClient } from './handler';
import gql from 'graphql-tag';

import { getCards } from './cards';

export async function add({ name, rfid, type = 2 }) {
  const { data } = await gqlClient.mutate({
    mutation: gql`
      mutation($data: UserQuery) {
        updateUser(data: $data) {
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
  const rfidArr = await getCards();

  const rfid = rfidArr[0].EPCString;
  console.log(rfid);

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

  return data;
}
