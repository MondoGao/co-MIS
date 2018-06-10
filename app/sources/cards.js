import handler from './handler';

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
  return handler(
    'getCard',
    {},
    {
      id: 'X001',
      type: 'tracker',
    },
  );
}


