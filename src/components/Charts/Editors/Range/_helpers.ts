import { Channel } from "../../../../ts/qmsData";

export const channelOptionAttrs = (
  { name, freq, unit }: Channel,
  idx: number
) => ({
  key: idx,
  value: idx,
  title: name,
  children: `${name} ${unit ? `(${unit})` : ""} [${freq} hz]`
});
