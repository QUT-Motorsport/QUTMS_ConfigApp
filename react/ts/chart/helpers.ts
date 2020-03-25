import { RangeTypesWithYAxisRT, Range } from "../../ts/chart/types";
import { Channel } from "../../ts/qmsData";
import { StateHook } from "../../ts/hooks";
import interpolate from "everpolate";

export const spec2ChannelIdxs = RangeTypesWithYAxisRT.match(
  ({ yAxis, colorAxis }) => [yAxis, colorAxis],
  ({ yAxes }) => yAxes.flat()
);

export const getUpdateHandler = (
  [xRange, setXRange]: StateHook<Range>,
  [yRange, setYRange]: StateHook<Range>
) => (
  {
    layout: {
      xaxis: { range: newXRange },
      yaxis: { range: newYRange }
    }
  }: any // Figure, with 100% defined xaxis and yaxis atts
) => {
  const anyChange = (old: Range, new_: Range) =>
    !(old === undefined && new_ === undefined) &&
    ((old === undefined && new_ !== undefined) ||
      (old !== undefined && new_ === undefined) ||
      old!.find((r, idx) => r !== new_![idx]) !== undefined);

  if (anyChange(xRange, newXRange)) {
    setXRange(newXRange);
  }
  if (anyChange(yRange, newYRange)) {
    setYRange(newYRange);
  }
};

export const axisTitle = ({ name, unit }: Channel) => `${name} (${unit})`;

export const yAxesLayout = (range: Range, channel: Channel | undefined) =>
  RangeTypesWithYAxisRT.match(
    () => ({
      yaxis1: {
        range,
        title:
          channel !== undefined
            ? (({ name, unit } = channel) => `${name} (${unit})`)()
            : undefined
      }
    }),
    ({ yAxes }) => {
      const yAxesLayout: any = {};

      yAxes.forEach((_, idx) => {
        yAxesLayout[`yaxis${idx + 1}`] = {
          overlaying: idx > 0 ? "y" : undefined,
          side: idx % 2 === 0 ? "left" : "right",
          range: idx === 0 && range !== undefined ? [...range] : undefined,
          title: channel !== undefined ? axisTitle(channel) : undefined
        };
      });

      return yAxesLayout;
    }
  );

export const yAxisName = (idx: number) =>
  RangeTypesWithYAxisRT.match(
    () => "y1",
    ({ yAxes }) =>
      `y${yAxes.findIndex(yAxis => yAxis.find(chIdx => idx === chIdx)) + 1}`
  );

export const baseChartSettings = {
  style: {
    width: "100%"
  },
  useResizeHandler: true
};

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

export const display: <T>(item: T) => T = item => {
  console.log(item);
  return item;
};
