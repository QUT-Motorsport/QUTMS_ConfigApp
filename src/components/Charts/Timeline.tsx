import React, { useMemo, useState, useEffect, useRef } from "react";
import { Spin, Button, Dropdown, Menu, Progress, Statistic } from "antd";
import Plot from "react-plotly.js";

import { QmsData } from "../../ts/qmsData/types";
import { Crossfilter } from "../../ts/qmsData/crossfilter/types";
import { GROUND_SPEED_CH_IDX } from "../../ts/qmsData/constants";
import { StateHook } from "../../ts/hooks";
import { anyChangeInRange, baseChartSettings } from "./_helpers";
import styles from "./Timeline.module.scss";
import useHydratedChannels from "../../ts/qmsData/useHydratedChannels";

import Draggable from "react-draggable";
import useComponentSize from "@rehooks/component-size";

export default function Timeline({
  data,
  filterState: [filter, setFilter],
}: {
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  //retrieves data from channel specified in useMemo (Ground speed)
  const hydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[GROUND_SPEED_CH_IDX]], [data])
  );

  //Data initialisations
  const MAX_TIME = data.maxTime!;
  let ref = useRef(null);
  let { width } = useComponentSize(ref);
  const xToSeconds = MAX_TIME / width;

  //scalar setstate
  const [scalar, setScalar] = useState<number>(1);
  const [pause, setPause] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const [dragPause, setDragPause] = useState<boolean>(false);

  function handleMenuClick(e: any) {
    let source = e.key;
    setScalar(source / 2);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">0.5x</Menu.Item>
      <Menu.Item key="2">1x</Menu.Item>
      <Menu.Item key="3">1.5x</Menu.Item>
      <Menu.Item key="4">2x</Menu.Item>
    </Menu>
  );

  //Initialising timer for playback
  const [playbackTime, setplaybackTime] = useState<number>(0);

  //increases timer to play through data
  useEffect(() => {
    const intervalId = setInterval(() => {
      setplaybackTime((playbackTime) => playbackTime + scalar);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [scalar]);

  //checks boundaries of playback
  useEffect(() => {
    if (playbackTime > MAX_TIME) {
      setplaybackTime(0);
    }
  }, [playbackTime]);

  //
  if (!hydrated) {
    return <Spin />;
  }

  //
  const [groundSpeedChannel] = hydrated;
  const { filters } = filter;

  // prepare the data for the linechart
  const time = [];
  const groundSpeedData = [];
  for (let idx = 0; idx < groundSpeedChannel.data.length; idx++) {
    time.push(idx / groundSpeedChannel.freq);
    groundSpeedData.push(groundSpeedChannel.data[idx]);
  }

  //mins and sec calcs
  let min = Math.floor((playbackTime / 60) % 60);
  let sec = Math.floor(playbackTime % 60);

  return (
    <div>
      <div className={styles.draggablecomp}>
        <Draggable
          bounds={{ top: 0, left: 0, right: width, bottom: 0 }}
          axis="x"
          position={{ y: 0, x: playbackTime / xToSeconds }}
          scale={1}
          onStart={() => {
            //setDragPause(true);
            console.log("StartDragging");
          }}
          //where the code needs to be for the timeline
          onDrag={(e, ui) => {
            console.log(ui);
            //setplaybackTime(Math.round((ui.x - 9) * xToSeconds));
          }}
          onStop={() => {
            //setDragPause(false);
            console.log("StopDragging");
          }}
        >
          <img
            src="https://i.imgur.com/UaNQMyr.png"
            draggable="false"
            style={{ zIndex: 10 }}
          />
        </Draggable>
      </div>
      <div className={styles.timeline}>
        <Plot
          {...baseChartSettings}
          data={[{ x: time, y: groundSpeedData }]}
          layout={{
            xaxis: {
              range: filters.byTime,
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
            if (anyChangeInRange(filters.byTime, range)) {
              filters.byTime = range;
              setFilter({ ...filter });
            }
          }}
        />
      </div>
      <span className="playbackControls">
        <div>
          Time: {min}:{sec}
        </div>
        <Button type="ghost" size="small">
          Play
        </Button>
        <Button type="ghost" size="small">
          Loop
        </Button>
        <Dropdown overlay={menu}>
          <Button type="ghost" size="small">
            Speed
          </Button>
        </Dropdown>
      </span>
    </div>
  );
}
