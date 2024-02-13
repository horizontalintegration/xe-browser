export const deepSearch = <T>(
  root: any,
  predicate: (obj: T | any) => boolean,
  stopAtFirst = false
) => {
  const processedObjects: any[] = [];
  const matchingObjects: T[] = [];
  (function find(obj) {
    if (obj === null || obj === undefined) {
      return;
    }
    if (predicate(obj) === true) {
      matchingObjects.push(obj);
      if (stopAtFirst) {
        return;
      }
    }
    for (const key of Object.keys(obj)) {
      const o: any = (obj as any)[key] as any;
      if (o && typeof o === "object") {
        if (!processedObjects.find((obj) => obj === o)) {
          processedObjects.push(o);
          find(o);
        }
      }
    }
  })(root);
  return matchingObjects;
};
