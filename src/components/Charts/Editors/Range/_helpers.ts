import { ChannelHeader } from "../../../../ts/qmsData/types";

export const channelOptionAttrs = (
  { name, freq, unit }: ChannelHeader,
  idx: number
) => ({
  key: idx,
  value: idx,
  title: name,
  children: `${name} ${unit ? `(${unit})` : ""} [${freq} hz]`,
});
