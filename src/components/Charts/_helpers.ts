import { useMemo } from "react";
import interpolate from "everpolate";

import { QmsData, Channel, Datum } from "../../ts/qmsData";
import { DiscretelyColourScaled } from "../../ts/chart/types";

const range = (start: number, stop: number, step: number = 1) => {
  let result = [];
  for (let x = start; x < stop; x += step) {
    result.push(x);
  }
  return result;
};

export function discreteJetColorsCalculator(min: number, max: number) {
  // cache the last result
  let prevNColorBins: number | null = null;
  let prevResult: DiscreteColorBins | null = null;

  type DiscreteColorBins = {
    start: number;
    stop: number;
    color: string;
  }[];

  return (nColorBins: number): DiscreteColorBins => {
    if (prevNColorBins === nColorBins) {
      return prevResult!;
    } else {
      prevNColorBins = nColorBins;
    }

    const span = max - min;
    const step = span / nColorBins;

    const midpoints = range(min + step / 2, max, step);

    // plotly jet color-scale
    // ripped from https://github.com/plotly/plotly.js/blob/be93eb6e48d130b6419202e8b3aae28156dfdfbe/src/components/colorscale/scales.js#L90
    const jetColorScale = {
      x: [0, 0.125, 0.375, 0.625, 0.875, 1].map((x) => min + span * x),
      red: [0, 0, 5, 255, 250, 128],
      green: [0, 60, 255, 255, 0, 0],
      blue: [131, 170, 255, 0, 0, 0],
    };

    const midpointColors = {
      red: interpolate.linear(midpoints, jetColorScale.x, jetColorScale.red),
      green: interpolate.linear(
        midpoints,
        jetColorScale.x,
        jetColorScale.green
      ),
      blue: interpolate.linear(midpoints, jetColorScale.x, jetColorScale.blue),
    };

    const halfStep = step / 2;

    const result = midpoints.map((midpoint, idx) => ({
      start: midpoint - halfStep,
      stop: midpoint + halfStep,
      color: `rgb(${midpointColors.red[idx]}, ${midpointColors.green[idx]}, ${midpointColors.blue[idx]})`,
    }));

    prevResult = result;

    return result;
  };
}

export function useGroupByColorBins(
  { channels }: QmsData,
  { nColourBins, colourAxis }: DiscretelyColourScaled
) {
  const channel = channels[colourAxis] as Channel;
  const discreteJetColors = useMemo(
    () => discreteJetColorsCalculator(...channel.minMax),
    [channel]
  );

  return {
    discreteJetColors,
    groupBy: useMemo(
      () => ({
        channel,
        grouper: (val: Datum) =>
          discreteJetColors(nColourBins).findIndex(
            ({ start, stop }) => val >= start && val <= stop
          ),
      }),
      [nColourBins, discreteJetColors, channel]
    ),
  };
}
