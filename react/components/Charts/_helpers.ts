import { useMemo } from "react";
import interpolate from "everpolate";

import { ChannelIdx, QmsData, Channel, Datum } from "../../ts/qmsData";
import { ChartSpec } from "../../ts/chart/types";

const range = (start: number, stop: number, step: number = 1) => {
  let result = [];
  for (let x = start; x < stop; x += step) {
    result.push(x);
  }
  return result;
};

export const discreteJetColorsCalculator = () => {
  // cache the last result
  let prevMin: number | null = null;
  let prevMax: number | null = null;
  let prevNColorBins: number | null = null;

  type DiscreteColorBins = {
    start: number;
    stop: number;
    color: string;
  }[];
  let prevResult: DiscreteColorBins | null = null;

  return (min: number, max: number, nColorBins: number): DiscreteColorBins => {
    if (prevMin === min && prevMax === max && prevNColorBins === nColorBins) {
      return prevResult!;
    } else {
      prevMin = min;
      prevMax = max;
      prevNColorBins = nColorBins;
    }

    const span = max - min;
    const step = span / nColorBins;

    const midpoints = range(min + step / 2, max, step);

    // plotly jet color-scale
    // ripped from https://github.com/plotly/plotly.js/blob/be93eb6e48d130b6419202e8b3aae28156dfdfbe/src/components/colorscale/scales.js#L90
    const jetColorScale = {
      x: [0, 0.125, 0.375, 0.625, 0.875, 1].map(x => min + span * x),
      red: [0, 0, 5, 255, 250, 128],
      green: [0, 60, 255, 255, 0, 0],
      blue: [131, 170, 255, 0, 0, 0]
    };

    const midpointColors = {
      red: interpolate.linear(midpoints, jetColorScale.x, jetColorScale.red),
      green: interpolate.linear(
        midpoints,
        jetColorScale.x,
        jetColorScale.green
      ),
      blue: interpolate.linear(midpoints, jetColorScale.x, jetColorScale.blue)
    };

    const halfStep = step / 2;

    const result = midpoints.map((midpoint, idx) => ({
      start: midpoint - halfStep,
      stop: midpoint + halfStep,
      color: `rgb(${midpointColors.red[idx]}, ${midpointColors.green[idx]}, ${midpointColors.blue[idx]})`
    }));

    prevResult = result;

    return result;
  };
};

export function getChannels(data: QmsData, channelIdxs: ChannelIdx[]) {
  return channelIdxs.map(channelIdx => data.channels[channelIdx] as Channel);
}

export function useMaybeGroupByColorBins(data: QmsData, spec: ChartSpec) {
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
                )
            }
          : undefined,
      [(spec as any).nColorBins, (spec as any).colorAxis, spec.rangeType]
    )
  };
}
