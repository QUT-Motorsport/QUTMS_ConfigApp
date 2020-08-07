import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Spin,
  Button,
  Dropdown,
  Menu,
  Progress,
  Statistic,
  Row,
  Col,
  Table,
} from "antd";
import Plot from "react-plotly.js";

import { QmsData } from "../../ts/qmsData/types";
import { Crossfilter } from "../../ts/qmsData/crossfilter/types";

import {
  GROUND_SPEED_CH_IDX,
  THROTTLE_POS_CH_IDX,
  LAP_NUMBER_CH_IDX,
  BRAKE_POSR_CH_IDX,
  STEERING_ANGLE_CH_IDX,
  BRAKE_TEMPR_CH_IDX,
  RUNNING_LAP_TIME_CH_IDX,
  // BATTERY_VOLTS_CH_IDX,
  GEAR_CH_IDX,
  ENGINE_RPM_CH_IDX,
  G_FORCE_LAT_CH_IDX,
  G_FORCE_LONG_CH_IDX,
} from "../../ts/qmsData/constants";
import { StateHook } from "../../ts/hooks";
import { anyChangeInRange, baseChartSettings } from "./_helpers";
import styles from "./Timeline.module.scss";
import useHydratedChannels from "../../ts/qmsData/useHydratedChannels";

import Draggable from "react-draggable";
import useComponentSize from "@rehooks/component-size";

//telemetry imports
import DividerBar from "../Telemetry/DividerBar";
import Label from "../Telemetry/Label";
import { ReactComponent as SteeringWheel } from "../../public/images/steering-wheel.svg";

export default function Timeline({
  data,
  filterState: [filter, setFilter],
}: {
  data: QmsData;
  filterState: StateHook<Crossfilter>;
}) {
  const throttlehydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[THROTTLE_POS_CH_IDX]], [data])
  );
  //retrieves data from channel specified in useMemo (Ground speed)
  const hydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[GROUND_SPEED_CH_IDX]], [data])
  );
  const LapNumhydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[LAP_NUMBER_CH_IDX]], [data])
  );
  const brakehydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[BRAKE_POSR_CH_IDX]], [data])
  );

  const steeringhydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[STEERING_ANGLE_CH_IDX]], [data])
  );

  const runningLapTimehydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[RUNNING_LAP_TIME_CH_IDX]], [data])
  );

  //RAW TELEMETRY CHANNELS
  const brakeTemphydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[BRAKE_TEMPR_CH_IDX]], [data])
  );

  // const batteryVoltshydrated = useHydratedChannels(
  //   data,
  //   useMemo(() => [data.channels[BATTERY_VOLTS_CH_IDX]], [data])
  // );

  const gearhydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[GEAR_CH_IDX]], [data])
  );
  const engineRPMhydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[ENGINE_RPM_CH_IDX]], [data])
  );
  const gforceLathydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[G_FORCE_LAT_CH_IDX]], [data])
  );
  const gforceLonghydrated = useHydratedChannels(
    data,
    useMemo(() => [data.channels[G_FORCE_LONG_CH_IDX]], [data])
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

  //Action Handling for Pause Button
  function handlePauseClick(e: any) {
    if (!pausePlayback) {
      setPlaybackPause(true);
    } else {
      setPlaybackPause(false);
    }
    console.log(pausePlayback);
  }

  //Action Handling for Loop Button
  function handleLoopClick(e: any) {
    if (!loop) {
      setLoop(true);
    } else {
      setLoop(false);
    }
    console.log(loop);
  }

  //Action Handling for Dropdown
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
  }, [playbackTime, loop, MAX_TIME]);

  //
  if (
    !hydrated ||
    !throttlehydrated ||
    !brakehydrated ||
    !steeringhydrated ||
    !LapNumhydrated ||
    !brakeTemphydrated ||
    !runningLapTimehydrated ||
    // !batteryVoltshydrated ||
    !gearhydrated ||
    !engineRPMhydrated ||
    !gforceLathydrated ||
    !gforceLonghydrated
  ) {
    return <Spin />;
  }

  //throttle
  const [throttleSpeedChannel] = throttlehydrated;
  const throttleData = throttleSpeedChannel.data;
  const throttlePosition =
    throttleData[Math.round(playbackTime * throttleSpeedChannel.freq)];

  //Ground Speed
  const [groundSpeedChannel] = hydrated;
  const groundSpeedData1 = groundSpeedChannel.data;
  const groundSpeedComponent =
    groundSpeedData1[Math.round(playbackTime * groundSpeedChannel.freq)];

  //LapNumber
  const [lapNumberChannel] = LapNumhydrated;
  const lapData = lapNumberChannel.data;
  const finalLap = lapData[Math.round(MAX_TIME * lapNumberChannel.freq)]; //hardcoded for now as using MAX_TIME causes undefined value
  const finalLaph = 4;
  const currentLap = lapData[Math.round(playbackTime * lapNumberChannel.freq)]; //calculates current lap
  console.log(finalLap);

  //Brake Pos
  const [brakeChannel] = brakehydrated;
  const brakeData = brakeChannel.data;
  const brakePosition = brakeData[Math.round(playbackTime * brakeChannel.freq)];

  //Steering Angle
  const [steeringChannel] = steeringhydrated;
  const steeringData = steeringChannel.data;
  const steeringAngle = steeringData[playbackTime * steeringChannel.freq];

  //Brake temp
  const [brakeTempChannel] = brakeTemphydrated;
  const brakeTempData = brakeTempChannel.data;
  const brakeTemp =
    brakeTempData[Math.round(playbackTime * brakeTempChannel.freq)];

  //Running lap time
  const [runningLapChannel] = runningLapTimehydrated;
  const runningLapData = runningLapChannel.data;
  const runningLap =
    runningLapData[Math.round(playbackTime * runningLapChannel.freq)];

  //Battery volts
  // const [batteryVoltsChannel] = batteryVoltshydrated;
  // const batteryVoltsData = batteryVoltsChannel.data;
  // console.log(batteryVoltsData);

  //Gear
  const [gearChannel] = gearhydrated;
  const gearData = gearChannel.data;
  const currentGear = gearData[Math.round(playbackTime * gearChannel.freq)];

  //ENGINE RPM
  const [engineRPMChannel] = engineRPMhydrated;
  const engineRPMData = engineRPMChannel.data;
  const engineRPM =
    engineRPMData[Math.round(playbackTime * engineRPMChannel.freq)];

  //GFORCE LAT & LONG
  const [gforceLongChannel] = gforceLonghydrated;
  const gforceLongData = gforceLongChannel.data;
  const gforceLong =
    gforceLongData[Math.round(playbackTime * gforceLongChannel.freq)];

  const [gforceLatChannel] = gforceLathydrated;
  const gforceLatData = gforceLatChannel.data;
  const gforceLat =
    gforceLatData[Math.round(playbackTime * gforceLatChannel.freq)];

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

  const rawTelemColumns = [
    {
      title: "Channel",
      dataIndex: "channel",
      key: "channel",
    },
    {
      title: "Reading",
      dataIndex: "reading",
      key: "reading",
    },
    {
      title: "Unit",
      key: "unit",
      dataIndex: "unit",
    },
  ];

  const rawTelemData = [
    {
      key: "1",
      channel: "Engine RPM",
      reading: engineRPM,
      unit: "RPM",
    },
    {
      key: "2",
      channel: "Brake Temp",
      reading: brakeTemp,
      unit: "C",
    },
    {
      key: "3",
      channel: "G-Force Long",
      reading: gforceLong,
      unit: "G",
    },
    {
      key: "4",
      channel: "G-Force Lat",
      reading: gforceLat,
      unit: "G",
    },
  ];

  return (
    <div>
      {/* DRAGGABLE COMPONENT */}
      <div className={styles.draggablecomp}>
        <Draggable
          bounds={{ top: 0, left: -9, right: width - 9, bottom: 0 }}
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
            setPlaybackTime(Math.round((ui.x - 9) * xToSeconds));
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
            alt="Drag Bar"
          />
        </Draggable>
      </div>

      {/* TIMELINE */}
      <div className={styles.timeline} ref={ref}>
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

      {/* PLAYBACK CONTROLS */}
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
        <Row>
          <Col
            lg={{ span: 5 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
            style={{ padding: "10px 20px" }}
          >
            <div style={{ marginTop: "5px" }}>
              <h3 style={{ color: "#0F406A" }}>Lap Info</h3>
              <DividerBar />

              {/* Current Lap */}
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div style={{ float: "left", width: "50%" }}>
                  <Statistic
                    valueStyle={{ color: "#0F406A" }}
                    title="Current Lap"
                    value={runningLap}
                    precision={2}
                    style={{ fontWeight: 600 }}
                  />
                </div>

                {/* Best Lap */}
                <div style={{ float: "left", width: "50%" }}>
                  <Statistic
                    valueStyle={{ color: "#0F406A" }}
                    title="Best Lap"
                    value={"1:03:00"}
                    precision={2}
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Top Lap Speed */}
                <div style={{ float: "left", width: "50%" }}>
                  <Statistic
                    valueStyle={{ color: "#0F406A" }}
                    title="Top Lap Speed"
                    value={"100"}
                    suffix={"km/h"}
                    precision={0}
                    style={{ fontWeight: 600 }}
                  />
                </div>

                {/* Top Race Speed */}
                <div style={{ float: "left", width: "50%" }}>
                  <Statistic
                    valueStyle={{ color: "#0F406A" }}
                    title="Top Race Speed"
                    value={"200"}
                    suffix={"km/h"}
                    precision={0}
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                {/* Total Laps */}
                <Label title="Total Laps" style={{ fontWeight: 600 }} />
                <Progress
                  type="circle"
                  percent={(currentLap / finalLaph) * 100}
                  format={(percent) => `${currentLap}/${finalLaph}`}
                  strokeColor="#0F406A"
                  strokeWidth={12}
                  style={{ fontWeight: 600 }}
                />
              </div>
            </div>
          </Col>
          <Col
            lg={{ span: 5 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
            style={{ padding: "10px 20px" }}
          >
            {/* STEERING WHEEL */}
            <div className={styles.steeringWheel}>
              <h3 style={{ color: "#0F406A" }}>Steering Angle</h3>
              <DividerBar />

              <div className={styles.wheelSVG}>
                {/* The Wheel SVG */}
                <div className={styles.wheelRotate}>
                  <SteeringWheel
                    style={{
                      width: "100px",
                      height: "100%",
                      margin: "0",
                      padding: "0",
                    }}
                  />
                </div>

                {/* Angle Reading of Steering Wheel */}
                <div>
                  <Statistic
                    valueStyle={{ color: "#0F406A" }}
                    title="Current"
                    value={steeringAngle}
                    precision={0}
                    style={{ marginLeft: "20px", fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>
            {/****/}
          </Col>
          <Col
            lg={{ span: 7 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
            style={{ padding: "10px 20px" }}
          >
            <div style={{ marginTop: "5px" }}>
              <h3 style={{ color: "#0F406A" }}>Engine and Power</h3>
              <DividerBar />

              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                  }}
                >
                  {/* Speed indicator */}
                  <div style={{ width: "50%" }}>
                    <Label title="Current Speed" />
                    <Progress
                      style={{ height: "90px" }}
                      type="dashboard"
                      percent={Math.round(groundSpeedComponent)}
                      showInfo={true}
                      strokeColor="#0F406A"
                      strokeWidth={12}
                      gapDegree={140}
                      format={(percent) => `${percent}`}
                    />
                  </div>

                  {/* Charge indicator */}
                  <div style={{ width: "50%" }}>
                    <Statistic
                      title={"Charge"}
                      valueStyle={{ color: "#0F406A" }}
                      value={100}
                      suffix="%"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <Label title="Pedal Positions" />

                {/* Acceleration Bar */}
                <Progress
                  percent={Math.round(throttlePosition)}
                  showInfo={true}
                  strokeColor="#7BE0AD"
                  strokeWidth={15}
                  strokeLinecap="square"
                />

                {/* Brakes Bar */}
                <Progress
                  percent={Math.round(brakePosition)}
                  showInfo={true}
                  strokeColor="#FF5964"
                  strokeWidth={15}
                  strokeLinecap="square"
                />
              </div>
            </div>
          </Col>
          <Col
            lg={{ span: 7 }}
            md={{ span: 12 }}
            xs={{ span: 24 }}
            style={{ padding: "10px 20px" }}
          >
            <div className="telemetry">
              <h3 style={{ marginTop: "10px", padding: "0", color: "#0F406A" }}>
                Raw Telemetry
              </h3>
              <DividerBar />

              <Table
                columns={rawTelemColumns}
                dataSource={rawTelemData}
                size="small"
                pagination={false}
                style={{ marginTop: "10px" }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
