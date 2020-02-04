import {
  Union,
  Literal,
  Static,
  Number,
  Undefined,
  Array,
  Record,
  Boolean
} from "runtypes";

const ChannelIdxRT = Number;

export type ChannelIdx = Static<typeof ChannelIdxRT>;

// outer array = y axis (can have multiple per plot)
// inner array = multiple channels plotted per axis
const YAxisRT = Array(Array(ChannelIdxRT));

export const ChartSpecRT = Record({
  type: Literal("Track-Map"),
  colorAxis: ChannelIdxRT
}).Or(
  Union(
    Record({
      type: Literal("Line"),
      xAxis: Union(Literal("Time"), Literal("Distance"))
    }),

    Record({
      type: Literal("Scatter"),
      xAxis: ChannelIdxRT,
      trendline: Boolean
    }),

    Record({
      type: Literal("Histogram"),
      bins: Number
    })
  ).And(
    Union(
      Record({
        channel: Literal("Colour-Scaled"),
        nbins: Number.Or(Undefined), // if undefined, use continous-colorscale
        colorAxis: ChannelIdxRT, // typically Throttle Pos
        yAxis: YAxisRT
      }),

      Record({
        channel: Literal("Multi-Channel"),
        yAxis: Array(YAxisRT)
      })
    )
  )
);

export type ChartSpec = Static<typeof ChartSpecRT>;

export type Range = [number, number] | undefined;
