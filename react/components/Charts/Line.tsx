import Plot from "react-plotly.js";
import { PlotData } from "plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import {
  Range,
  LineChartSpec,
  ColorScaledWithYAxis,
  MultiChannel
} from "../../ts/chart/types";
import { StateHook } from "../../ts/hooks";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  baseChartSettings
} from "../../ts/chart/helpers";
import {
  QmsData,
  useCrossfilteredData,
  ChannelGroup,
  Channel
} from "../../ts/qmsData";
import { getChannels, useMaybeGroupByColorBins } from "./_helpers";
import Unimplemented from "./Unimplemented";

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
  const { discreteJetColors, groupBy } = useMaybeGroupByColorBins(data, spec);
  const [range, setRange] = useState<Range>();
  const crossfilterData = useCrossfilteredData(data, {
    channelIdxs: useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filters: useMemo(() => ({ byTime: undefined, byChannels: new Map() }), []),
    groupBy
  });

  if (!crossfilterData) {
    return <Spin />;
  } else {
    // TODO: handle this with the type-system after refactoring away from RunTypes
    if (spec.rangeType === "Colour-Scaled" && !("groups" in crossfilterData)) {
      return Unimplemented("Contiuously-Colour-Scaled LineChart")({});
    } else {
      return (
        <Plot
          {...baseChartSettings}
          data={
            "groups" in crossfilterData
              ? (iterate(crossfilterData.groups)
                  .map(([groupIdx, channelGroup]) => {
                    if (
                      spec.rangeType === "Colour-Scaled" &&
                      spec.nColorBins !== null
                    ) {
                      const [yChannel] = getChannels(data, [spec.yAxis]);

                      const [min, max] = crossfilterData.groupedRange;

                      // repeat calls to this are cached
                      const { stop, color } = discreteJetColors(
                        min,
                        max,
                        spec.nColorBins!
                      )[groupIdx];

                      // we need to let plotly know we don't want it to connect the gaps by inserting gaps into the data
                      // in order to do this we need to reconstruct the signal, while inserting NULLS in where gaps should be
                      const maxPeriodBeforGap =
                        (function round( // account for floating point errors
                          num = channelGroup.time[1] - channelGroup.time[0],
                          decimals = 2
                        ) {
                          const coeff = Math.pow(10, decimals);
                          return Math.round(coeff * num) / coeff;
                        })() * 2; // mult by 2 because it takes 2 points to represent a line

                      const yChannelData = channelGroup.channels.get(yChannel)!;
                      let prevTime = channelGroup.time[0];
                      const x = [];
                      const y = [];
                      for (let idx = 0; idx < yChannelData.length; idx++) {
                        const time = channelGroup.time[idx];
                        if (time - prevTime > maxPeriodBeforGap) {
                          x.push(time + maxPeriodBeforGap);
                          y.push(null); // this tells plotly to put a gap in
                        }
                        x.push(time);
                        y.push(yChannelData[idx]);
                        prevTime = time;
                      }

                      return {
                        x,
                        y,
                        name: `<= ${stop.toPrecision(3)}`,
                        marker: { color, symbol: "circle-open" }
                      };
                    } else {
                      // TODO: merge spec with channelGroup output so that this becomes a typeerror instead of a runtime error
                      return null;
                    }
                  })
                  .filter(trace => trace !== null)
                  .toArray()
                  .reverse() as Partial<PlotData>[])
              : [
                  ...iterate(crossfilterData.channels).map(
                    ([{ name, idx }, data]) => ({
                      name,
                      x: crossfilterData.time,
                      y: data,
                      yaxis: yAxisName(idx)(spec),
                      mode: "lines" as "lines" // smh sometimes typescript
                    })
                  )
                ]
          }
          layout={{
            title: spec.title,
            autosize: true,
            ...yAxesLayout(
              range,
              data.channels[
                spec.rangeType === "Colour-Scaled"
                  ? spec.yAxis
                  : spec.yAxes[0][0]
              ] as Channel
            )(spec),
            xaxis: {
              title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
              range: domain === undefined ? undefined : [...domain],
              ...(showDomainSlider
                ? {
                    rangeslider: {
                      range:
                        "groups" in crossfilterData
                          ? crossfilterData.timeRange
                          : [
                              crossfilterData.time[0],
                              crossfilterData.time[
                                crossfilterData.time.length - 1
                              ]
                            ]
                    }
                  }
                : null)
            }
          }}
          onUpdate={getUpdateHandler([domain, setDomain], [range, setRange])}
        />
      );
    }
  }
};
