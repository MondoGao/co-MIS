import { gqlClient } from './handler';
import gql from 'graphql-tag';

export async function editSportRecord(newData) {
  const { data } = await gqlClient.mutate({
    mutation: gql`
      mutation($data: SportRecordMutation) {
        updateSportRecord(data: $data) {
          id
          startTime
          endTime
          user {
            id
          }
          tracker {
            id
          }
          path {
            x
            y
          }
        }
      }
    `,
    variables: {
      data: newData,
    },
  });

  return data.updateSportRecord;
}
