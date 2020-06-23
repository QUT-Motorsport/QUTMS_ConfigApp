import { useMemo } from "react";

import { ChannelIdx, QmsData, Channel, Datum } from "../../ts/qmsData";
import { discreteJetColorsCalculator } from "../../ts/chart/helpers";
import { AnyChartSpec } from "./AnyChart";

export function getChannels(data: QmsData, channelIdxs: ChannelIdx[]) {
  return channelIdxs.map((channelIdx) => data.channels[channelIdx] as Channel);
}

export function useGroupByColorBins(data: QmsData, spec: AnyChartSpec) {
  const discreteJetColors = useMemo(discreteJetColorsCalculator, []);

  return {
    discreteJetColors,
    groupBy: useMemo(
      () =>
        spec.rangeType === "Colour-Scaled" && spec.nColorBins !== null
          ? {
              channel: data.channels[spec.colorAxis] as Channel,
              grouper: (val: Datum, min: Datum, max: Datum) =>
                discreteJetColors(min, max, spec.nColorBins!).findIndex(
                  ({ start, stop }) => val >= start && val <= stop
                ),
            }
          : undefined,
      [(spec as any).nColorBins, (spec as any).colorAxis, spec.rangeType]
    ),
  };
}
