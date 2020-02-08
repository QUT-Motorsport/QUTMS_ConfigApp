import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";

import { Range, LineChartSpec, RangeTypesWithYAxisRT } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { QmsData, ChannelGroup, useChannelGroup } from "../ts/qmsData";

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
        name: `${channel.name} [${channel.freq}]`,
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
        xaxis: {
          title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
          range: domain,
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
          () => ({ yaxis1: { range } }),
          ({ yAxes }) => {
            const axesLayout: any = {};

            yAxes.forEach((yAxis, idx) => {
              const axisNo = idx + 1;
              axesLayout[`yaxis${axisNo}`] = {
                title: `Axis ${axisNo}`
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
      onRelayout={(e: any) => {
        [
          { name: "xaxis", set: setDomain },
          { name: "yaxis", set: setRange }
        ].forEach(({ name, set }) => {
          if (set !== undefined) {
            // axisChange events come in 3 consumable forms
            const event_newrange_attr = `${name}.range`;
            const event_newrange_attrs = [
              `${name}.range[0]`,
              `${name}.range[1]`
            ];
            const event_resetrange_attr = `${name}.autorange`;

            if (event_newrange_attr in e) {
              set(e[event_newrange_attr]);
            } else if (event_newrange_attrs.every(attr => attr in e)) {
              set(event_newrange_attrs.map(attr => e[attr]) as Range);
            } else if (event_resetrange_attr in e) {
              set(undefined); // if axis range == undefined, plotly sets it to 100%
            }
          }
        });
      }}
    />
  ) : (
    <Spin />
  );
