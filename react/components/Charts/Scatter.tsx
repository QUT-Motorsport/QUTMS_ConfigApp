import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";

import {
  Range,
  ScatterChartSpec,
  RangeTypesWithYAxisRT
} from "../../ts/chartTypes";
import { StateHook } from "../../ts/hooks";
import { QmsData, Channel, useChannels } from "../../ts/qmsData";

export default ({
  // xAxis, TODO: Handle vs distance
  spec,
  // rangeType,
  data,
  _xRangeState: [xRange, setXRange] = useState(),
  _yRangeState: [yRange, setYRange] = useState(),
  _channels: channels = useChannels(
    data,
    useMemo(
      () => [
        spec.xAxis,
        ...RangeTypesWithYAxisRT.match(
          ({ yAxis }) => [yAxis],
          ({ yAxes }) => yAxes.flat()
        )(spec)
      ],
      [spec]
    )
  )
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  _xRangeState?: StateHook<Range>;
  _yRangeState?: StateHook<Range>;
  _channels?: Channel[] | null;
}) =>
  channels ? (
    (([xChannel, ...yChannels] = channels) => (
      <Plot
        data={yChannels.map(({ name, data, idx }) => ({
          type: "scattergl", // its faster! like, WAY faster!
          name,
          x: xChannel.data!,
          y: data!,
          yaxis: `y${RangeTypesWithYAxisRT.match(
            () => 1,
            ({ yAxes }) =>
              yAxes.findIndex(yAxis => yAxis.find(chIdx => idx === chIdx)) + 1
          )(spec)}`,
          mode: "markers"
        }))}
        useResizeHandler={true}
        layout={{
          title: spec.title,
          xaxis: {
            title: (({ name, unit } = xChannel) => `${name} (${unit})`)(),
            range: xRange
          },
          autosize: true,
          ...RangeTypesWithYAxisRT.match(
            () => ({
              yaxis1: {
                range: yRange,
                title: (({ name, unit } = yChannels[0]) =>
                  `${name} (${unit})`)()
              }
            }),
            ({ yAxes }) => {
              const axesLayout: any = {};

              yAxes.forEach((_, idx) => {
                const axisNo = idx + 1;
                axesLayout[`yaxis${axisNo}`] = {
                  overlaying: idx > 0 ? "y" : undefined,
                  side: idx % 2 === 0 ? "left" : "right",
                  range:
                    idx === 0 && yRange !== undefined ? [...yRange] : undefined,
                  title:
                    yChannels.length === 1
                      ? (({ name, unit } = yChannels[0]) =>
                          `${name} (${unit})`)()
                      : undefined
                };
              });

              return axesLayout;
            }
          )(spec)
        }}
        style={{
          width: "100%",
          height: "450px"
        }}
        onUpdate={(
          {
            layout: {
              xaxis: { range: newXRange },
              yaxis: { range: newYRange }
            }
          }: any // Figure, with 100% defined xaxis and yaxis atts
        ) => {
          const anyChange = (old: Range, new_: Range) =>
            (old === undefined && new_ !== undefined) ||
            (old !== undefined && new_ === undefined) ||
            old!.find((r, idx) => r !== new_![idx]) !== undefined;

          if (anyChange(xRange, newXRange)) {
            setXRange(newXRange);
          }
          if (anyChange(yRange, newYRange)) {
            setYRange(newYRange);
          }
        }}
      />
    ))()
  ) : (
    <Spin />
  );
