import handler, { gqlClient } from './handler';
import gql from 'graphql-tag';

export async function getCard() {
  return handler(
    'getCard',
    {},
    {
      id: 'U001',
      type: 'user',
    },
  );
}

export async function getTracker() {
  const rfidArr = await handler(
    'rfidConnect',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        position: 2,
      }),
    },
    // [
    // {
    //   EPCString: '000000000000000000000090',
    // },
    // ]
  );

  console.log(rfidArr);
  if (!rfidArr || rfidArr.length <= 0) {
    throw new Error('未扫到标签');
  }

  const rfid = rfidArr[0];

  const { data } = await gqlClient.query({
    query: gql`
      query($query: TrackerQuery) {
        trackers(query: $query) {
          channel
          id
          rfid
        }
      }
    `,
    variables: {
      query: {
        rfid,
      },
    },
  });

  return data.trackers[0];
}
