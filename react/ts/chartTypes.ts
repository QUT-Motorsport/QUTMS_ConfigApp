import { Union, Literal, Static } from "runtypes";

export const ChartTypeEnum = Union(
  Literal("Line"),
  Literal("Scatter"),
  Literal("Box Plot"),
  Literal("Histogram")
);

export type ChartSpec = {
  type: Static<typeof ChartTypeEnum>;
  channelIdxs: number[];
};

export type Range = [number, number] | undefined;
