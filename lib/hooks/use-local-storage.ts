import equal from "fast-deep-equal/es6/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const KEY_PREFIX = "xe-browser:";
const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue);

  const prefixedKey = KEY_PREFIX + key;
  useEffect(() => {
    let value = window.localStorage.getItem(prefixedKey);
    // If we don't have the prefixed value, see if we have the unprefixed one from before we added prefix.
    if (!value) {
      value = window.localStorage.getItem(key);
      // If it is found, re-add it with the prefixed value, then remove the unprefixed one.
      if (value) {
        window.localStorage.setItem(prefixedKey, value);
        window.localStorage.removeItem(key);
      }
    }
    // Check if the local storage already has any values,
    // otherwise initialize it with the passed initialValue
    let parsedValue;
    try {
      parsedValue = value ? (JSON.parse(value) as T) : initialValue;
    } catch {
      parsedValue = initialValue;
    }

    if (!equal(parsedValue, state)) {
      setState(parsedValue);
    }
  }, [initialValue, key, prefixedKey, state]);

  const setValue = (value: T | ((arg0: T) => T)) => {
    // If the passed value is a callback function,
    //  then call it with the existing state.
    const valueToStore = value instanceof Function ? value(state) : value;
    window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
    setState(value);
  };

  return [state, setValue];
};

export default useLocalStorage;
