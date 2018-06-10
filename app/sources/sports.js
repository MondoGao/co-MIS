import handler from './handler';

export function add() {
  return handler(
    'sports',
    {},
    {
      id: 'xx1',
      isFinished: false,
      startTime: Date.now(),
      path: [
        {
          x: 1,
          y: 1,
        },
      ],
    },
  );
}

export function edit() {
  return handler(
    'sports',
    {},
    {
      id: 'xx1',
      isFinished: false,
      startTime: Date.now(),
      path: [
        {
          x: 1,
          y: 1,
        },
        {
          x: 2,
          y: 2,
        },
      ],
    },
  );
}

export function all() {
  return handler('sports', {}, [
    {
      id: 'xx1',
      isFinished: false,
      startTime: Date.now(),
      path: [
        {
          x: 1,
          y: 1,
        },
      ],
    },
  ]);
}
