export function log<T>(item: T) {
  console.log(item);
  return item;
}

export function assert<T>(item: T | undefined | null) {
  if (item === undefined || item === null) {
    throw new Error(`${item} was not expected to be null or undefined`);
  }
  return item;
}
