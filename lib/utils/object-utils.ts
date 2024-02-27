export const deepSearch = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  root: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  predicate: (obj: any) => boolean,
  stopAtFirst = false
) => {
  const processedObjects: object[] = [];
  const matchingObjects: T[] = [];
  (function find(obj) {
    if (obj === null || obj === undefined) {
      return;
    }
    if (predicate(obj) === true) {
      matchingObjects.push(obj as T);
      if (stopAtFirst) {
        return;
      }
    }
    for (const key of Object.keys(obj)) {
      const o = obj[key];
      if (o && typeof o === 'object') {
        if (!processedObjects.find((obj) => obj === o)) {
          processedObjects.push(o);
          find(o);
        }
      }
    }
  })(root);
  return matchingObjects;
};
