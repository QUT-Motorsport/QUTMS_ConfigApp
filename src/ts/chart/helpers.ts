import { Channel } from "../../ts/qmsData";
import interpolate from "everpolate";
import { AnyChartSpec, ChartRange } from "../../components/Charts/AnyChart";
import { Layout } from "plotly.js";

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
  xRange: ChartRange,
  yRange: ChartRange,
  setRanges: (xRange: ChartRange, yRange: ChartRange) => void
) => (
  {
    layout: {
      xaxis: { range: newXRange },
      yaxis: { range: newYRange },
    },
  }: any // react-plotly.js/Figure, with 100% defined xaxis and yaxis atts
) => {
  if (
    anyChangeInRange(xRange, newXRange) ||
    anyChangeInRange(yRange, newYRange)
  ) {
    setRanges(newXRange, newYRange);
  }
};

export const axisTitle = ({ name, unit }: Channel) => `${name} (${unit})`;

export function yAxesLayout(
  range: ChartRange,
  channel: Channel | undefined,
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

export const yAxisName = (idx: number) => (spec: AnyChartSpec) =>
  spec.rangeType === "ColourScaled"
    ? "y1"
    : `y${
        spec.yAxes.findIndex((yAxis) => yAxis.find((chIdx) => idx === chIdx)) +
        1
      }`;

export const baseChartSettings = {
  style: {
    width: "100%",
  },
  useResizeHandler: true,
};

const range = (start: number, stop: number, step: number = 1) => {
  let result = [];
  for (let x = start; x < stop; x += step) {
    result.push(x);
  }
  return result;
};

export function discreteJetColorsCalculator() {
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
