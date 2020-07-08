import crossfilter, { NaturallyOrderedValue } from "crossfilter2";

import { Time, Datum, Data, Range, ChannelHeader } from "../types";

export type Record = {
  time: Time;
  data: Map<ChannelHeader, Datum>;
};

export type Dimension<T extends NaturallyOrderedValue> = crossfilter.Dimension<
  Record,
  T
>;

export type GroupIdx = number;

export type ChannelGroup = {
  time: Time[];
  channels: Map<ChannelHeader, Data>;
};

// used for grouping by eg, discrete color-scale, or track-map segment
export type GroupedChannelGroups = {
  timeRange: Range;
  groups: Map<GroupIdx, ChannelGroup>;
};

export type Crossfilter = {
  // the crossfilter index that links them all together
  index: crossfilter.Crossfilter<Record>;

  // crossfilter dimensions to be accessed by multiple components
  dimensions: {
    byTime: Dimension<Time>;
    byChannels: Map<ChannelHeader, Dimension<Datum>>;
  };

  filters: {
    byTime?: Range<Time>;
    byChannels: Map<ChannelHeader, Range<Datum>>;
  };
};
