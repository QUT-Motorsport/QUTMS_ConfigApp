import React, { useState } from "react";
import { Spin } from "antd";
import Plot from "react-plotly.js";

import { GROUND_SPEED_CH_IDX } from "../ts/chart/defaults";
import { QmsData, hydrateChannels, CrossFilter } from "../ts/qmsData";
import { StateHook } from "../ts/hooks";
import { anyChangeInRange, baseChartSettings } from "../ts/chart/helpers";
import styles from "./Timeline.module.scss";

export default function Timeline({
  data,
  filterState: [filter, setFilter],
}: {
  data: QmsData;
  filterState: StateHook<CrossFilter>;
}) {
  const [groundSpeedChannel, setGroundSpeedChannel] = useState(
    data.channels[GROUND_SPEED_CH_IDX]
  );

  if (!("data" in groundSpeedChannel)) {
    hydrateChannels(data, [GROUND_SPEED_CH_IDX]).then(
      ([groundSpeedChannel]) => {
        setGroundSpeedChannel({ ...groundSpeedChannel });
      }
    );
    return <Spin />;
  }

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
