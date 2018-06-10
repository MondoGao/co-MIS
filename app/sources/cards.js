import handler from './handler';

export async function getCard() {
  return handler(
    'getCard',
    {},
    {
      id: 'X001',
      type: 'tracker',
    },
  );
}
