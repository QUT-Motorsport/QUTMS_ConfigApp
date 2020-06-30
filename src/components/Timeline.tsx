import React from "react";
import { ComponentProps } from "react";
import { LineChartSpec } from "ts/chart/types";
import { GROUND_SPEED_CH_IDX } from "ts/chart/defaults";

import LineChart from "components/Charts/LineChart";

import styles from "./Timeline.module.scss";

const TIMELINE_SPEC: LineChartSpec = {
  title: "",
  domainType: "Line",
  xAxis: "Time",
  rangeType: "Multi-Channel",
  yAxes: [[GROUND_SPEED_CH_IDX]],
};

export default function Timeline({
  data,
  domainState,
}: Pick<ComponentProps<typeof LineChart>, "data" | "domainState">) {
  return (
    <div className={styles.timeline}>
      <LineChart
        data={data}
        spec={TIMELINE_SPEC}
        domainState={domainState}
        showDomainSlider={true}
      />
    </div>
  );
}
