import { DateTime } from 'luxon';

export async function delay(mili) {
  return new Promise(resolve => setTimeout(resolve, mili));
}

export function isoSorter(a, b) {
  const dt1 = DateTime.fromISO(a);
  const dt2 = DateTime.fromISO(b);
  const result = dt1.diff(dt2, 'milliseconds');
  return result.milliseconds;
}
