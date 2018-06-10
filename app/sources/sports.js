import handler from './handler'

export function startSport() {
  return handler('startSport', {}, {
    time: Date.now(),
  })
}
