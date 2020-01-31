import React from "react";
import { Progress } from "antd";

const pedalPositions = () => {
  return (
    <div>
      <b style={{ color: "#0F406A" }}>Pedal Positions</b>
      <Progress
        percent={50}
        showInfo={true}
        strokeColor="#28A745"
        strokeWidth={20}
        strokeLinecap="square"
      />
      <Progress
        percent={50}
        showInfo={true}
        strokeColor="#DC3545"
        strokeWidth={20}
        strokeLinecap="square"
      />
    </div>
  );
};

export default pedalPositions;
