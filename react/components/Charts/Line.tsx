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
import { QmsData, useChannelGroup } from "../../ts/qmsData";

export default ({
  // xAxis, TODO: Handle vs distance
  spec,
  data,
  showDomainSlider = false,
  domainState: [domain, setDomain] = useState()
}: {
  spec: LineChartSpec;
  data: QmsData;
  showDomainSlider?: boolean;
  domainState?: StateHook<Range>;
}) => {
  const [range, setRange] = useState<Range>();
  const channelGroup = useChannelGroup(data, {
    channelIdxs: useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filters: useMemo(() => ({ byTime: undefined, byChannels: {} }), [])
  });

  return channelGroup ? (
    <Plot
      {...baseChartSettings}
      data={
        Array.isArray(channelGroup)
          ? [] // TODO: discretely color-scaled line plots
          : Object.values(channelGroup.channels).map(
              ({ channel: { name, idx }, data }) => ({
                name,
                x: channelGroup.time,
                y: data,
                yaxis: yAxisName(idx)(spec),
                mode: "lines",
                opacity: 1 - channelGroup.channels.length * 0.1
              })
            )
      }
      layout={{
        title: spec.title,
        autosize: true,
        ...yAxesLayout(
          range,
          (Array.isArray(channelGroup)
            ? channelGroup[0].channels[1]
            : channelGroup.channels[0]
          ).channel
        )(spec),
        xaxis: {
          title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
          range: domain === undefined ? undefined : [...domain],
          ...(showDomainSlider
            ? {
                rangeslider: {
                  range: [
                    0,
                    Array.isArray(channelGroup)
                      ? channelGroup[channelGroup.length - 1]
                      : channelGroup.time[channelGroup.time.length - 1]
                  ]
                }
              }
            : null)
        }
      }}
      onUpdate={getUpdateHandler([domain, setDomain], [range, setRange])}
    />
  ) : (
    <Spin />
  );
};
