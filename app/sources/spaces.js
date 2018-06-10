import handler from './handler';

export const reservations = {
  all({ spaceId }) {
    return handler('spaces/${spaceId}/reservations', {}, [
      {
        id: 'res123',
        startTime: Date.now(),
        endTime: Date.now(),
        isActived: false,
        isClosed: false,
        user: {
          id: 'us123',
          name: 'Mondo',
        },
      },
    ]);
  },
};

export const types = {
  all() {
    return handler('spaces/types', {}, [
      {
        id: 'ty123',
        name: '篮球场',
      },
    ]);
  },
};

export async function all() {
  return handler('spaces', {}, [
    {
      id: 'sp123',
      type: {
        id: 'ty123',
        name: '篮球场',
      },
      name: '1',
      addTime: Date.now(),
      isAvaliable: true,
      avaliableDuration: {
        start: Date.now(),
        end: Date.now(),
      },
      reservations: [
        {
          id: 'res123',
          startTime: Date.now(),
          endTime: Date.now(),
          isActived: false,
          isClosed: false,
          user: {
            id: 'us123',
            name: 'Mondo',
          },
        },
      ],
    },
  ]);
}

export async function add() {
  return handler('spaces', {}, {});
}
