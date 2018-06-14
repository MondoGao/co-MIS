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
  const { rfid } = await handler(
    'getCard',
    {},
    {
      rfid: 'tracker1',
    },
  );

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
