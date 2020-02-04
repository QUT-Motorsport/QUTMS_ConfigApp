import Plot from "react-plotly.js";
import { useState, ComponentProps } from "react";
import { Spin } from "antd";

import { ChartSpec, Range } from "../ts/chartTypes";
import { StateHook } from "../ts/hooks";
import { QmsData, ChannelGroup, useChannelGroup } from "../ts/qmsData";

export default ({
  channelIdxs,
  data,
  showRangeSlider = false,
  domainState: [domain, setDomain],
  _rangeState: [range, setRange] = useState(),
  _channelGroup: channelGroup = useChannelGroup(data, channelIdxs)
}: ChartSpec & {
  data: QmsData;
  showRangeSlider?: boolean;
  domainState: StateHook<Range>;
  _rangeState?: StateHook<Range>;
  _channelGroup?: ChannelGroup | null;
}) =>
  channelGroup ? (
    <Plot
      data={channelGroup.channels.map(({ channel, y }) => ({
        name: channel.name,
        x: channelGroup.x,
        y: y,
        mode: "lines"
      }))}
      useResizeHandler={true}
      layout={{
        xaxis: {
          range: domain,
          ...(showRangeSlider
            ? {
                rangeslider: {
                  range: [0, channelGroup.x[channelGroup.x.length - 1]]
                }
              }
            : {})
        },
        yaxis: { range },
        autosize: true
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
