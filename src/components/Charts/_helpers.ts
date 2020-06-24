import { useMemo } from "react";

import { ChannelIdx, QmsData, Channel, Datum } from "../../ts/qmsData";
import { discreteJetColorsCalculator } from "../../ts/chart/helpers";
import { ColourScaled } from "../../ts/chart/types";
import { AnyChartSpec } from "./AnyChart";

export function getChannels(data: QmsData, channelIdxs: ChannelIdx[]) {
  return channelIdxs.map((channelIdx) => data.channels[channelIdx] as Channel);
}

export function useGroupByColorBins({ channels }: QmsData, spec: AnyChartSpec) {
  const discreteJetColors = useMemo(discreteJetColorsCalculator, []);

  return {
    discreteJetColors,
    groupBy: useMemo(
      () => ({
        channel: channels[colourAxis] as Channel,
        grouper: (val: Datum, min: Datum, max: Datum) =>
          discreteJetColors(min, max, nColourBins!).findIndex(
            ({ start, stop }) => val >= start && val <= stop
          ),
      }),
      [nColourBins, colourAxis, rangeType, channels]
    ),
  };
}
