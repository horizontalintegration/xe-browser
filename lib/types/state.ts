import { Dispatch, SetStateAction } from 'react';

export type UseStateReturn<T> = [T, Dispatch<SetStateAction<T>>];
