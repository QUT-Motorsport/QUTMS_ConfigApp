import { Source } from "./crossfilter/types";

// object acts as both the file interface and a cache for channel data
export type QmsData = {
  filename: string;

  // totalTime: number;
  // lapTimes: number[];
  channels: (ChannelHeader | Channel)[]; // just the header if un-hydrated

  // objects related to crossfiltering
  // TODO: separate crossfilter into it's own state to support multiple indexes
  crossfilter: null | Source;

  // Max time
  maxTime: null | Time;
};

export type ChannelHeader = {
  idx: ChannelIdx;
  name: string;
  freq: number;
  unit: string;
};

export type ChannelIdx = number;

export type Channel = ChannelHeader & {
  data: Data;
  minMax: Range;
};

export type Time = number;
export type Datum = number; // singular of data (a single point)
export type Data = Datum[];
export type Range<T = Datum> = [T, T];
