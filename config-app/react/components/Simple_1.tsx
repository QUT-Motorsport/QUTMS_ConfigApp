//for testing - should delete

import { QmsData } from "../ts/api";
import Plot from "react-plotly.js";
import { useEffect, useState, useRef } from "react";
import { PlotData } from "plotly.js";

type ChartData = { data: QmsData };

const GROUND_SPEED_CH_IDX = 44;
const TIMELINE_IDXS = [GROUND_SPEED_CH_IDX];

export default ({ data }: { data: QmsData }) => (
  <>
    {console.log(data.filename)}
    {console.log(data.channels[0].name)}
    {console.log(data.channels.length)}
  </>
);
