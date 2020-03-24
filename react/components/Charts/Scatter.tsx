import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import interpolate from "everpolate";

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
import { QmsData, useChannelGroup } from "../../ts/qmsData";
import range from "../../ts/range";

export default ({
  spec,
  data,
  domainState: [domain] = useState(),
  _xRangeState: [xRange, setXRange] = useState(),
  _yRangeState: [yRange, setYRange] = useState()
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  domainState?: StateHook<Range>;
  _xRangeState?: StateHook<Range>;
  _yRangeState?: StateHook<Range>;
}) => {
  const channelGroup = useChannelGroup(
    data,
    useMemo(() => [spec.xAxis, ...spec2ChannelIdxs(spec)], [spec]),
    useMemo(() => ({ byTime: domain, byChannels: {} }), [domain])
  );

  if (channelGroup === null) {
    return <Spin />;
  } else {
    const defaults = (channelIdx: number) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name,
      yaxis: yAxisName(channelIdx)(spec)
    });

    const chartData = Array.isArray(channelGroup)
      ? (() => {
          return [];
          //     // split up the jet color-scale according to nBins
          // const min = Math.min(...colorChannel.data!);
          // const max = Math.max(...colorChannel.data!);
          // const span = max - min;
          // const step = span / spec.nColorBins;

          // const midpoints = range(min + step / 2, max, step);

          // // plotly jet color-scale
          // // ripped from https://github.com/plotly/plotly.js/blob/be93eb6e48d130b6419202e8b3aae28156dfdfbe/src/components/colorscale/scales.js#L90
          // const jetColorScale = {
          //   x: [0, 0.125, 0.375, 0.625, 0.875, 1].map(x => min + span * x),
          //   red: [0, 0, 5, 255, 250, 128],
          //   green: [0, 60, 255, 255, 0, 0],
          //   blue: [131, 170, 255, 0, 0, 0]
          // };

          // const midpointColors = {
          //   red: interpolate.linear(
          //     midpoints,
          //     jetColorScale.x,
          //     jetColorScale.red
          //   ),
          //   green: interpolate.linear(
          //     midpoints,
          //     jetColorScale.x,
          //     jetColorScale.green
          //   ),
          //   blue: interpolate.linear(
          //     midpoints,
          //     jetColorScale.x,
          //     jetColorScale.blue
          //   )
          // };

          // return midpoints
          //   .map((midpoint, idx) => {
          //     return {
          //       ...defaults(yChannel.channel.idx, yChannel.channel.data!),
          //       name: `${(min + step * idx).toPrecision(3)} - ${(
          //         min +
          //         step * (idx + 1)
          //       ).toPrecision(3)}`,
          //       marker: {
          //         color: `rgb(${midpointColors.red[idx]}, ${midpointColors.green[idx]}, ${midpointColors.blue[idx]})`
          //       }
          //     };
          //   })
          //   .reverse();
        })()
      : spec.rangeType === "Colour-Scaled"
      ? (() => {
          const [xChannel, yChannel, colorChannel] = channelGroup.channels;
          return [
            {
              ...defaults(yChannel.channel.idx),
              x: xChannel.data,
              y: yChannel.data,

              marker: {
                color: colorChannel.data!,
                colorscale: "Jet",
                colorbar: {
                  title: {
                    text: axisTitle(colorChannel.channel),
                    side: "right"
                  } as any
                }
              }
            }
          ];
        })()
      : (() => {
          const [xChannel, ...yChannels] = channelGroup.channels;

          return yChannels.map(yChannel => ({
            ...defaults(yChannel.channel.idx),
            x: xChannel.data,
            y: yChannel.data,

            opacity: 1 - yChannels.length * 0.1
          }));
        })();

    return (
      <Plot
        {...baseChartSettings}
        data={chartData}
        layout={{
          title: spec.title,
          autosize: true,
          ...yAxesLayout(
            yRange,
            (Array.isArray(channelGroup)
              ? channelGroup[0].channels[1]
              : channelGroup.channels[1]
            ).channel
          )(spec),
          xaxis: {
            title: axisTitle(
              (Array.isArray(channelGroup)
                ? channelGroup[0].channels[0]
                : channelGroup.channels[0]
              ).channel
            ),
            range: xRange
          },
          hovermode: "closest"
        }}
        onUpdate={getUpdateHandler([xRange, setXRange], [yRange, setYRange])}
      />
    );
  }
};
