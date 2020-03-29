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
