import gql from 'graphql-tag';
import * as R from 'ramda';
import { gqlClient } from './handler';

import * as cards from './cards';

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

  return data.updateEquipment;
}

export async function scanAndView() {
  const rfids = await cards.getCards();

  if (rfids.length <= 0) {
    throw new Error('未扫描到标签');
  }

  console.log(rfids);

  const ids = R.map(R.prop('EPCString'))(rfids);
  console.log(ids);

  return Promise.all(
    ids.map(async id => {
      const data = await queryData({ rfid: id });
      return R.prop(0, data);
    }),
  );
}
