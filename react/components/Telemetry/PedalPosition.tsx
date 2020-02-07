import React from "react";
import { Progress } from "antd";
import Label from "../Label";

const pedalPositions = () => {
  return (
    <div style={{ marginTop: "10px" }}>
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
  );
};

export default pedalPositions;
