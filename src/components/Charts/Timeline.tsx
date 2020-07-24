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
import Label from "../Telemetry/Label";
import SteeringWheel from "../../public/images/steering-wheel.svg";

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
  const [pausePlayback, setPlaybackPause] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const [dragPause, setDragPause] = useState<boolean>(false);

  function handlePauseClick(e: any) {
    if (!pausePlayback) {
      setPlaybackPause(true);
    } else {
      setPlaybackPause(false);
    }
    console.log(pausePlayback);
  }

  function handleLoopClick(e: any) {
    if (!loop) {
      setLoop(true);
    } else {
      setLoop(false);
    }
    console.log(loop);
  }

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
  const [playbackTime, setPlaybackTime] = useState<number>(0);

  //increases timer to play through data
  useEffect(() => {
    if (!pausePlayback && !dragPause) {
      const intervalId = setInterval(() => {
        setPlaybackTime((playbackTime) => playbackTime + scalar);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [scalar, pausePlayback, dragPause]);

  //checks boundaries of playback
  useEffect(() => {
    if (playbackTime > MAX_TIME) {
      if (loop) {
        setPlaybackTime(0);
      } else if (!loop) {
        setPlaybackPause(true);
      }
    }
  }, [playbackTime, loop]);

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
          bounds={{ top: 0, left: 9, right: width - 9, bottom: 0 }}
          axis="x"
          position={{ y: 0, x: playbackTime / xToSeconds }}
          scale={1}
          onStart={() => {
            setDragPause(true);
            console.log("StartDragging");
          }}
          //where the code needs to be for the timeline
          onDrag={(e, ui) => {
            console.log(ui);
            //setPlaybackTime(Math.round((ui.x - 9) * xToSeconds));
          }}
          onStop={() => {
            setDragPause(false);
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
        <Button
          type="ghost"
          size="small"
          shape="round"
          onClick={handlePauseClick}
        >
          Play
        </Button>
        <Button
          type="ghost"
          size="small"
          shape="round"
          onClick={handleLoopClick}
        >
          Loop
        </Button>
        <Dropdown overlay={menu}>
          <Button type="ghost" size="small" shape="round">
            Speed
          </Button>
        </Dropdown>
      </span>

      {/* Telemetry Components */}
      <div>
        {/* Speed indicator */}
        <div style={{ width: "50%" }}>
          <Label title="Current Speed" />
          <Progress
            style={{ height: "90px" }}
            type="dashboard"
            percent={15}
            showInfo={true}
            strokeColor="#0F406A"
            strokeWidth={12}
            gapDegree={140}
            format={(percent) => `${percent}`}
          />
          {/* Total Laps */}
          <Label title="Total Laps" style={{ fontWeight: 600 }} />
          <Progress
            type="circle"
            percent={(1 / 5) * 100}
            format={(percent) => `${1}/${5}`}
            strokeColor="#0F406A"
            strokeWidth={12}
            style={{ fontWeight: 600 }}
          />
        </div>
      </div>
      {/* Pedals */}
      <div className="pedalposdiv" style={{ marginTop: "10px" }}>
        <Label title="Pedal Positions" />

        {/* Acceleration Bar */}
        <Progress
          percent={50}
          showInfo={true}
          strokeColor="#7BE0AD"
          strokeWidth={15}
          strokeLinecap="square"
        />

        {/* Brakes Bar */}
        <Progress
          percent={50}
          showInfo={true}
          strokeColor="#FF5964"
          strokeWidth={15}
          strokeLinecap="square"
        />
      </div>
    </div>
  );
}