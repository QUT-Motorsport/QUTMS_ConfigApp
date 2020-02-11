import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import { merge } from "lodash";

import { Range, ScatterChartSpec } from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  axisTitle,
  baseChartSettings
} from "../../ts/chart/helpers";
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
    useMemo(() => [spec.xAxis, ...spec2ChannelIdxs(spec)], [spec])
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
        {...baseChartSettings}
        data={yChannels.map(({ name, data, idx }) => ({
          type: "scattergl", // its faster than scatter! like, WAY faster! No downsides??
          name,
          x: xChannel.data!,
          y: data!,
          yaxis: yAxisName(idx)(spec),
          mode: "markers"
        }))}
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(yRange, channels)(spec),
          xaxis: {
            title: axisTitle(xChannel),
            range: xRange
          },
          hovermode: "closest"
        }}
        onUpdate={getUpdateHandler([xRange, setXRange], [yRange, setYRange])}
      />
    ))()
  ) : (
    <Spin />
  );
