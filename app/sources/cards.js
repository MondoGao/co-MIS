import handler, { gqlClient } from './handler';
import gql from 'graphql-tag';

export async function getCards(position = 2) {
  const rfidArr = await handler('rfidConnect', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      position,
    }),
  });

  console.log(rfidArr);
  if (!rfidArr || rfidArr.length <= 0) {
    throw new Error('未扫到标签');
  }

  return rfidArr;
}

export async function getTracker() {
  const rfidArr = await getCards();

  const rfid = rfidArr[0].EPCString;

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
