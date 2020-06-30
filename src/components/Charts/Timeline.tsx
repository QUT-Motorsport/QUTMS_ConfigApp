import React, { useMemo } from "react";
import { Spin } from "antd";
import Plot from "react-plotly.js";

import { QmsData } from "../../ts/qmsData/types";
import { Crossfilter } from "../../ts/qmsData/crossfilter/types";
import { GROUND_SPEED_CH_IDX } from "../../ts/qmsData/constants";
import { StateHook } from "../../ts/hooks";
import { anyChangeInRange, baseChartSettings } from "./_helpers";
import styles from "./Timeline.module.scss";
import useHydratedChannels from "../../ts/qmsData/useHydratedChannels";

export default function Timeline({
  data,
  filterState: [filter, setFilter],
}: {
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  const hydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[GROUND_SPEED_CH_IDX]], [data])
  );

  if (!hydrated) {
    return <Spin />;
  }

  const [groundSpeedChannel] = hydrated;

  // prepare the data for the linechart
  const time = [];
  const groundSpeedData = [];
  for (let idx = 0; idx < groundSpeedChannel.data.length; idx++) {
    time.push(idx / groundSpeedChannel.freq);
    groundSpeedData.push(groundSpeedChannel.data[idx]);
  }

  return (
    <div className={styles.timeline}>
      <Plot
        {...baseChartSettings}
        data={[{ x: time, y: groundSpeedData }]}
        layout={{
          xaxis: {
            range: filter.byTime,
            rangeslider: {
              range: [0, data.maxTime],
            },
          },
        }}
        onUpdate={(
          {
            layout: {
              xaxis: { range },
            },
          }: any // Figure, with 100% defined xaxis and yaxis atts
        ) => {
          if (anyChangeInRange(filter.byTime, range)) {
            filter.byTime = range;
            setFilter({ ...filter });
          }
        }}
      />
    </div>
  );
}
