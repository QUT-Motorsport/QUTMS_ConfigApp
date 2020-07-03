import { useMemo } from "react";
import interpolate from "everpolate";

import { QmsData, Datum, ChannelHeader } from "../../ts/qmsData/types";
import {
  DiscretelyColourScaled,
  WithYAxis,
} from "./Editors/Range/ColorScaledRangeEditor";

import { AnyChartSpec, ChartRange } from "../../components/Charts/AnyChart";
import { Layout, Icons, ModeBarButton } from "plotly.js";
import useHydratedChannels from "../../ts/qmsData/useHydratedChannels";
import {
  Crossfilter,
  GroupedChannelGroups,
} from "../../ts/qmsData/crossfilter/types";
import useCrossfilteredData from "../../ts/qmsData/crossfilter/useCrossfilteredData";
import { StateHook } from "../../ts/hooks";
import { PlotParams } from "react-plotly.js";
import { ScatterChartDomain } from "./Editors/Domain/ScatterDomainEditor";

export const spec2ChannelIdxs = (spec: AnyChartSpec) =>
  spec.rangeType === "ColourScaled"
    ? "yAxis" in spec
      ? [spec.yAxis, spec.colourAxis]
      : [spec.colourAxis]
    : spec.yAxes.flat();

export function anyChangeInRange(old: ChartRange, new_: ChartRange) {
  return (
    !(old === undefined && new_ === undefined) &&
    ((old === undefined && new_ !== undefined) ||
      (old !== undefined && new_ === undefined) ||
      old!.find((r, idx) => r !== new_![idx]) !== undefined)
  );
}

export const getUpdateHandler = (
  [filter, setFilter]: StateHook<Crossfilter>,
  x: "byTime" | ChannelHeader,
  y: ChannelHeader
) => (
  {
    layout: {
      xaxis: { range: newXRange },
      yaxis: { range: newYRange },
    },
  }: any // react-plotly.js/Figure, with 100% defined xaxis and yaxis atts
) => {
  const { filters } = filter;
  const xRange = x === "byTime" ? filters.byTime : filters.byChannels.get(x);
  const yRange = filters.byChannels.get(y);

  if (
    anyChangeInRange(yRange, newYRange) ||
    anyChangeInRange(xRange, newXRange)
  ) {
    const updateChannelRange = (
      channel: ChannelHeader,
      newRange: ChartRange
    ) => {
      if (newRange) {
        filters.byChannels.set(channel, newRange);
      } else {
        filters.byChannels.delete(channel);
      }
    };
    if (x === "byTime") {
      filters.byTime = newXRange;
    } else {
      updateChannelRange(x, newXRange);
    }
    updateChannelRange(y, newYRange);

    setFilter({ ...filter });
  }
};

export const axisTitle = ({ name, unit }: ChannelHeader) => `${name} (${unit})`;

export function yAxesLayout(
  range: ChartRange,
  channel: ChannelHeader | undefined,
  spec: AnyChartSpec
): Partial<Layout> {
  if (spec.rangeType === "ColourScaled") {
    return {
      yaxis: {
        range,
        title: channel
          ? (({ name, unit } = channel) => `${name} (${unit})`)()
          : undefined,
      },
    };
  } else {
    const yAxesLayout: any = {};

    spec.yAxes.forEach((_, idx) => {
      yAxesLayout[`yaxis${idx + 1}`] = {
        overlaying: idx > 0 ? "y" : undefined,
        side: idx % 2 === 0 ? "left" : "right",
        range: idx === 0 && range !== undefined ? [...range] : undefined,
        title: channel !== undefined ? axisTitle(channel) : undefined,
      };
    });

    return yAxesLayout;
  }
}

export const yAxisName = (channel: ChannelHeader, spec: AnyChartSpec) =>
  spec.rangeType === "ColourScaled"
    ? "y1"
    : `y${
        spec.yAxes.findIndex((yAxis) => yAxis.find((ch2) => channel === ch2)) +
        1
      }`;

export const baseChartSettings: Partial<PlotParams> = {
  style: {
    width: "100%",
  },
  useResizeHandler: true,
  config: {
    modeBarButtons: [
      ["select2d"],
      ["zoom2d", "pan2d", "autoScale2d"],
      [
        {
          name: "edit",
          title: "Edit Chart",
          icon: Icons["pencil"],
          click: () => {
            // TODO
            throw Error("Chart editing not implemented yet!");
          },
        },
      ],
    ] as ModeBarButton[][],
  },
};

const range = (start: number, stop: number, step: number = 1) => {
  let result = [];
  for (let x = start; x < stop; x += step) {
    result.push(x);
  }
  return result;
};

export function discreteJetColorsCalculator(min: Datum, max: Datum) {
  // cache the last result
  let prevNColorBins: number | null = null;
  let prevResult: DiscreteColorBins | null = null;

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

type DiscreteColorBins = {
  start: Datum;
  stop: Datum;
  color: string;
}[];

export function useCrossfilteredDataColourBinned(
  data: QmsData,
  spec: DiscretelyColourScaled & WithYAxis & ({} | ScatterChartDomain),
  filterState: StateHook<Crossfilter>
): null | {
  discreteJetColors: (nColorBins: number) => DiscreteColorBins;
  filtered: GroupedChannelGroups;
} {
  const { nColourBins, colourAxis, yAxis } = spec;
  const xAxis = "xAxis" in spec ? spec.xAxis : null;
  const hydrated = useHydratedChannels(
    data,
    useMemo(() => [colourAxis], [colourAxis])
  );

  const discreteJetColors = useMemo(
    () =>
      hydrated ? discreteJetColorsCalculator(...hydrated[0].minMax) : null,
    [hydrated]
  );

  const groupBy = useMemo(
    () =>
      hydrated && discreteJetColors
        ? {
            channel: hydrated[0],
            grouper: (val: Datum) =>
              discreteJetColors(nColourBins).findIndex(
                ({ start, stop }) => val >= start && val <= stop
              ),
          }
        : undefined,
    [nColourBins, discreteJetColors, hydrated]
  );

  const filtered = useCrossfilteredData(
    data,
    useMemo(() => [yAxis, colourAxis].concat(xAxis ? [xAxis] : []), [
      yAxis,
      colourAxis,
      xAxis,
    ]),
    filterState,
    groupBy!
  );

  return filtered && discreteJetColors
    ? {
        discreteJetColors,
        filtered,
      }
    : null;
}
