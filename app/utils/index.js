export async function delay(mili) {
  return new Promise(resolve => setTimeout(resolve, mili));
}
