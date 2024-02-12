import equal from "fast-deep-equal/es6/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const value = window.localStorage.getItem(key);
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
  }, [initialValue, key, state]);

  const setValue = (value: T | ((arg0: T) => T)) => {
    // If the passed value is a callback function,
    //  then call it with the existing state.
    const valueToStore = value instanceof Function ? value(state) : value;
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
    setState(value);
  };

  return [state, setValue];
};

export default useLocalStorage;
