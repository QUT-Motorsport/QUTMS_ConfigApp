import Plot from "react-plotly.js";
import { PlotData, Icons, ModeBarButton } from "plotly.js";
import { useState, useMemo } from "react";
import { Spin } from "antd";
import iterate from "iterare";

import { MaybeRange, LineChartSpec } from "../../ts/chart/types";
import { log } from "../../ts/debug";
import {
  spec2ChannelIdxs,
  getUpdateHandler,
  yAxesLayout,
  yAxisName,
  baseChartSettings,
} from "../../ts/chart/helpers";
import {
  QmsData,
  useCrossfilterState,
  useCrossfilteredData,
  getChannels,
} from "../../ts/qmsData";
import { useMaybeGroupByColorBins } from "./_helpers";
import Unimplemented from "./Unimplemented";

export default function LineChart({
  // xAxis, TODO: Handle vs distance
  spec,
  data,
  filtersState: [filters, setFilters],
}: {
  spec: LineChartSpec;
  data: QmsData;
  filtersState: ReturnType<typeof useCrossfilterState>;
}) {
  const { discreteJetColors, groupBy } = useMaybeGroupByColorBins(data, spec);
  const crossfilterData = useCrossfilteredData(data, {
    channelIdxs: useMemo(() => spec2ChannelIdxs(spec), [spec]),
    filters,
    groupBy,
  });

  const yRangeChannel = getChannels(data, [
    spec.rangeType == "Colour-Scaled" ? spec.yAxis : spec.yAxes[0][0],
  ])[0];
  const yRange = filters.show.byChannels.get(yRangeChannel);

  if (!crossfilterData) {
    return <Spin />;
  } else {
    console.log(crossfilterData, filters);
    // TODO: handle this with the type-system after refactoring away from RunTypes
    if (spec.rangeType === "Colour-Scaled" && !("groups" in crossfilterData)) {
      return Unimplemented("Contiuously-Colour-Scaled LineChart")({});
    } else {
      return (
        <Plot
          {...baseChartSettings}
          onSelected={(selected) => {
            // filters.show.byChannels!.set();
            console.log(selected);
            // setSelected(selected?.range!.x as Range);
            // setSelected(selected?.range!.y as Range);
          }}
          data={
            "groups" in crossfilterData
              ? (iterate(crossfilterData.groups)
                  .map(([groupIdx, channelGroup]) => {
                    if (
                      spec.rangeType === "Colour-Scaled" &&
                      spec.nColorBins !== null
                    ) {
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
                        (function round( // round to account for floating point errors
                          num = channelGroup.time[1] - channelGroup.time[0],
                          decimals = 2
                        ) {
                          const coeff = Math.pow(10, decimals);
                          return Math.round(coeff * num) / coeff;
                        })() * 2; // mult by 2 because it takes 2 points to represent a line

                      const yChannelData = channelGroup.channels.get(
                        yRangeChannel
                      )!;
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
                        marker: { color, symbol: "circle-open" },
                      };
                    } else {
                      // TODO: merge spec with channelGroup output so that this becomes a typeerror instead of needing to filter afterwards
                      return null;
                    }
                  })
                  .filter((trace) => trace !== null)
                  .toArray()
                  .reverse() as Partial<PlotData>[])
              : [
                  ...iterate(crossfilterData.channels).map(
                    ([{ name, idx }, data]) => ({
                      name,
                      x: crossfilterData.time,
                      y: data,
                      yaxis: yAxisName(idx)(spec),
                      mode: "lines" as "lines", // smh sometimes typescript
                    })
                  ),
                ]
          }
          layout={{
            title: spec.title,
            autosize: true,

            ...(spec.rangeType === "Colour-Scaled"
              ? (([yAxis] = getChannels(data, [spec.yAxis])) =>
                  yAxesLayout(
                    filters.show.byChannels.get(yAxis),
                    yAxis
                  )(spec))()
              : (([yAxis] = getChannels(data, [spec.yAxes[0][0]])) =>
                  yAxesLayout(
                    filters.show.byChannels.get(yAxis),
                    yAxis
                  )(spec))()),

            xaxis: {
              title: spec.xAxis === "Time" ? "Time (s)" : "Distance (m)",
              range:
                filters.show.byTime === undefined
                  ? undefined
                  : [...filters.show.byTime],
            },
          }}
          config={{
            modeBarButtons: [
              ["select2d"],
              ["zoom2d", "pan2d", "autoScale2d"],
              [
                {
                  name: "edit",
                  title: "Edit Chart",
                  icon: Icons["pencil"],
                  click: () => {
                    // TODO
                    throw Error("Chart editing not implemented yet!");
                  },
                },
              ],
            ] as ModeBarButton[][],
          }}
          onUpdate={getUpdateHandler(
            filters.show.byTime,
            yRange,
            (newTimeRange, newYRange) => {
              filters.show.byTime = newTimeRange;
              if (newYRange) {
                filters.show.byChannels.set(yRangeChannel, newYRange);
              } else {
                filters.show.byChannels.delete(yRangeChannel);
              }
              setFilters({ ...filters });
            }
          )}
        />
      );
    }
  }
}
