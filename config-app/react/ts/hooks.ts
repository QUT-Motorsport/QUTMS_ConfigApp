import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { QmsData } from "./api";

export { QmsData } from "./api";

export type SetState<T> = Dispatch<SetStateAction<T>>;
export type StateHook<T> = [T, SetState<T>];

export const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    QmsData.download(filename).then(setQmsData);
  }, []);

  return qmsData;
};
