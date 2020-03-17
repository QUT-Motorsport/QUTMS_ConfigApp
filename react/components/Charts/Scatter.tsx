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
import { QmsData, Channel, useChannels } from "../../ts/qmsData";

export default ({
  spec,
  data,
  _xRangeState: [xRange, setXRange] = useState(),
  _yRangeState: [yRange, setYRange] = useState()
}: {
  spec: ScatterChartSpec;
  data: QmsData;
  _xRangeState?: StateHook<Range>;
  _yRangeState?: StateHook<Range>;
  _channels?: Channel[] | null;
}) => {
  const channels = useChannels(
    data,
    useMemo(() => [spec.xAxis, ...spec2ChannelIdxs(spec)], [spec])
  );

  if (channels === null) {
    return <Spin />;
  } else {
    const [xChannel, ...yzChannels] = channels;

    let data;
    const defaults = (yChannel: Channel) => ({
      type: "scattergl" as any,
      mode: "markers" as any,
      name,
      yaxis: yAxisName(yChannel.idx)(spec),
      x: xChannel.data!,
      y: yChannel.data!
    });
    if (spec.rangeType === "Colour-Scaled") {
      const [yChannel, colorChannel] = yzChannels;
      if (spec.nColorBins === null) {
        // continuous color-scale
        data = [
          {
            ...defaults(yChannel),

            marker: {
              color: colorChannel.data!,
              colorscale: "Jet",
              colorbar: {
                title: {
                  text: axisTitle(colorChannel),
                  side: "right"
                } as any
              }
            }
          }
        ];
      } else {
        // split up the jet color-scale according to nBins
        const min = Math.min(...colorChannel.data!);
        const max = Math.max(...colorChannel.data!);
        const span = max - min;
        const step = span / spec.nColorBins;

        const midpoints = [...Array(spec.nColorBins).keys()].map(
          idx => min + step * (idx + 0.5)
        );

        // plotly jet color-scale
        // ripped from https://github.com/plotly/plotly.js/blob/be93eb6e48d130b6419202e8b3aae28156dfdfbe/src/components/colorscale/scales.js#L90
        const jetColorScale = {
          x: [0, 0.125, 0.375, 0.625, 0.875, 1].map(x => min + span * x),
          red: [0, 0, 5, 255, 250, 128],
          green: [0, 60, 255, 255, 0, 0],
          blue: [131, 170, 255, 0, 0, 0]
        };

        const midpointColors = {
          red: interpolate.linear(
            midpoints,
            jetColorScale.x,
            jetColorScale.red
          ),
          green: interpolate.linear(
            midpoints,
            jetColorScale.x,
            jetColorScale.green
          ),
          blue: interpolate.linear(
            midpoints,
            jetColorScale.x,
            jetColorScale.blue
          )
        };

        data = midpoints
          .map((_x, idx) => ({
            // doesn't make sense right now - needs crossfilter. But demonstrates the colorbar
            ...defaults(yChannel),
            name: `${(min + step * idx).toPrecision(3)} - ${(
              min +
              step * (idx + 1)
            ).toPrecision(3)}`,
            marker: {
              color: `rgb(${midpointColors.red[idx]}, ${midpointColors.green[idx]}, ${midpointColors.blue[idx]})`
            }
          }))
          .reverse();
      }
    } else {
      data = yzChannels.map(yChannel => ({
        ...defaults(yChannel),

        opacity: 1 - yzChannels.length * 0.1
      }));
    }

    return (
      <Plot
        {...baseChartSettings}
        data={data}
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
    );
  }
};
