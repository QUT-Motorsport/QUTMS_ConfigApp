import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";

import { Range, LineChartSpec } from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  baseChartSettings
} from "../../ts/chart/helpers";
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
    useMemo(() => spec2ChannelIdxs(spec), [spec])
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
      {...baseChartSettings}
      data={channelGroup.channels.map(({ channel: { name, idx }, y }) => ({
        name,
        x: channelGroup.x,
        y: y,
        yaxis: yAxisName(idx)(spec),
        mode: "lines",
        opacity: 1 - channelGroup.channels.length * 0.1
      }))}
      layout={{
        title: spec.title,
        autosize: true,
        ...yAxesLayout(
          range,
          channelGroup.channels.map(({ channel }) => channel)
        )(spec),
        xaxis: {
          title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
          range: domain === undefined ? undefined : [...domain],
          ...(showDomainSlider
            ? {
                rangeslider: {
                  range: [0, channelGroup.x[channelGroup.x.length - 1]]
                }
              }
            : {})
        }
      }}
      onUpdate={getUpdateHandler([domain, setDomain], [range, setRange])}
    />
  ) : (
    <Spin />
  );
