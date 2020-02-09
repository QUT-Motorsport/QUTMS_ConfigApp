import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";

import {
  Range,
  LineChartSpec,
  RangeTypesWithYAxisRT
} from "../../ts/chartTypes";
import { StateHook } from "../../ts/hooks";
import { QmsData, ChannelGroup, useChannelGroup } from "../../ts/qmsData";

export default ({
  // xAxis, TODO: Handle vs distance
  spec,
  // rangeType,
  data,
  showDomainSlider = false,
  domainState: [domain, setDomain] = useState(),
  _rangeState: [range, setRange] = useState(),
  _channelGroup: channelGroup = useChannelGroup(
    data,
    useMemo(
      () =>
        RangeTypesWithYAxisRT.match(
          ({ yAxis }) => [yAxis],
          ({ yAxes }) => yAxes.flat()
        )(spec),
      [spec]
    )
  )
}: {
  spec: LineChartSpec;
  data: QmsData;
  showDomainSlider?: boolean;
  domainState?: StateHook<Range>;
  _rangeState?: StateHook<Range>;
  _channelGroup?: ChannelGroup | null;
}) =>
  channelGroup ? (
    <Plot
      data={channelGroup.channels.map(({ channel, y }) => ({
        name: channel.name,
        x: channelGroup.x,
        y: y,
        yaxis: `y${RangeTypesWithYAxisRT.match(
          () => 1,
          ({ yAxes }) =>
            yAxes.findIndex(yAxis =>
              yAxis.find(chIdx => channel.idx === chIdx)
            ) + 1
        )(spec)}`,
        mode: "lines"
      }))}
      useResizeHandler={true}
      layout={{
        title: spec.title,
        xaxis: {
          title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
          range: domain === undefined ? domain : [...domain],
          ...(showDomainSlider
            ? {
                rangeslider: {
                  range: [0, channelGroup.x[channelGroup.x.length - 1]]
                }
              }
            : {})
        },
        autosize: true,
        ...RangeTypesWithYAxisRT.match(
          () => ({
            yaxis1: {
              range,
              title:
                channelGroup.channels.length > 0
                  ? `${channelGroup.channels[0].channel.name} (${channelGroup.channels[0].channel.unit})`
                  : undefined
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
                  idx === 0 && range !== undefined ? [...range] : undefined,
                title:
                  channelGroup.channels.length === 1
                    ? `${channelGroup.channels[0].channel.name} (${channelGroup.channels[0].channel.unit})`
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
            xaxis: { range: newDomain },
            yaxis: { range: newRange }
          }
        }: any // Figure, with 100% defined xaxis and yaxis atts
      ) => {
        const anyChange = (old: Range, new_: Range) =>
          (old === undefined && new_ !== undefined) ||
          (old !== undefined && new_ === undefined) ||
          old!.find((r, idx) => r !== new_![idx]) !== undefined;

        if (anyChange(domain, newDomain)) {
          setDomain(newDomain);
        }
        if (anyChange(range, newRange)) {
          setRange(newRange);
        }
      }}
    />
  ) : (
    <Spin />
  );
