import { Dispatch, SetStateAction } from "react";

export type StateHook<T> = [T, Dispatch<SetStateAction<T>>];
