import React from "react";
import { Progress, Statistic } from "antd";
import Label from "../Label";

const pedalPositions = () => {
  return (
    <div style={{ marginTop: "10px" }}>
      <Label title="Pedal Positions" />
      <Progress
        percent={50}
        showInfo={true}
        strokeColor="#0F406A"
        strokeWidth={15}
        strokeLinecap="square"
      />
      <Progress
        percent={50}
        showInfo={true}
        strokeColor="#0F406A"
        strokeWidth={15}
        strokeLinecap="square"
      />
    </div>
  );
};

export default pedalPositions;
