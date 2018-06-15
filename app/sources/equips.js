import gql from 'graphql-tag';
import { gqlClient } from './handler';

export async function queryData(query) {
  const { data } = await gqlClient.query({
    query: gql`
      query($query: ResourceQuery) {
        equipments(query: $query) {
          id
          name
          type {
            id
            name
          }
          isAvaliable
          avaliableDuration {
            start {
              hour
              minute
            }
            end {
              hour
              minute
            }
          }
          rfid
        }
      }
    `,
    variables: {
      query,
    },
    fetchPolicy: 'no-cache',
  });

  return data.equipments;
}

export async function queryTypeData(query) {
  const { data } = await gqlClient.query({
    query: gql`
      query($query: ResourceTypeQuery) {
        equipmentTypes(query: $query) {
          id
          name
        }
      }
    `,
    variables: {
      query,
    },
    fetchPolicy: 'no-cache',
  });

  return data.equipmentTypes;
}

export async function edit(newData) {
  const { data } = await gqlClient.mutate({
    mutation: gql`
      mutation($data: ResourceMutation) {
        updateEquipment(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: newData,
    },
  });

  return data.updaetEquipment;
}
