import Plot from "react-plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";

import { Range, ScatterChartSpec } from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  axisTitle,
  baseChartSettings,
  discreteJetColorsCalculator
} from "../../ts/chart/helpers";
import { QmsData, useChannelGroup } from "../../ts/qmsData";
import { PlotData } from "plotly.js";

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
  const discreteJetColors = useMemo(discreteJetColorsCalculator, []);

  const channelGroup = useChannelGroup(data, {
    channelIdxs: useMemo(() => [spec.xAxis, ...spec2ChannelIdxs(spec)], [spec]),
    filters: useMemo(() => ({ byTime: domain, byChannels: {} }), [domain]),
    groupBy: useMemo(
      () =>
        spec.rangeType === "Colour-Scaled" && spec.nColorBins !== null
          ? {
              channelIdx: spec.colorAxis,
              grouper: ({ min, max }) => val =>
                discreteJetColors(min, max, spec.nColorBins!).findIndex(
                  ({ start, stop }) => val >= start && val <= stop
                )
            }
          : undefined,
      [(spec as any).nColorBins, (spec as any).colorAxis, spec.rangeType]
    )
  });

  if (channelGroup === null) {
    return <Spin />;
  } else {
    const defaults = (channelIdx: number) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name,
      yaxis: yAxisName(channelIdx)(spec)
    });

    return (
      <Plot
        {...baseChartSettings}
        data={
          Array.isArray(channelGroup) // if we're using discrete color-scale
            ? channelGroup
                .map((thisChannelGroup, idx) => {
                  if (
                    spec.rangeType === "Colour-Scaled" &&
                    spec.nColorBins !== null
                  ) {
                    const [
                      xChannel,
                      yChannel,
                      colorChannel
                    ] = thisChannelGroup.channels;

                    // repeat calls to this are cached
                    const { stop, color } = discreteJetColors(
                      colorChannel.min,
                      colorChannel.max,
                      spec.nColorBins!
                    )[idx];

                    return {
                      ...defaults(yChannel.channel.idx),
                      x: xChannel.data,
                      y: yChannel.data,
                      name: `<= ${stop.toPrecision(3)}`,
                      marker: { color, symbol: "circle-open" }
                    };
                  } else {
                    throw new Error("This should never be true");
                  }
                })
                .reverse()
            : spec.rangeType === "Colour-Scaled"
            ? // continuous color-scale
              (([xChannel, yChannel, colorChannel] = channelGroup.channels) => [
                {
                  ...defaults(yChannel.channel.idx),
                  x: xChannel.data,
                  y: yChannel.data,

                  marker: {
                    symbol: "circle-open",
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
              ])()
            : ((
                [xChannel, ...yChannels] = channelGroup.channels // must be multichannel
              ) =>
                yChannels.map(yChannel => ({
                  ...defaults(yChannel.channel.idx),
                  x: xChannel.data,
                  y: yChannel.data,
                  marker: {
                    symbol: "circle-open"
                  }
                })))()
        }
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
