import React from "react";
import { Progress, Divider } from "antd";
import PedalPositions from "./PedalPosition";
import DividerBar from "./DividerBar";

const EngineAndPower = () => {
  return (
    <div style={{ marginTop: "5px" }}>
      <h3 style={{ padding: "0", color: "#0F406A" }}>Engine and Power</h3>
      <DividerBar />
      <div style={{ marginTop: "10px" }}>
        <p
          style={{
            padding: "0",
            color: "#908d8c"
          }}
        >
          Speed
        </p>
        <div>
          <Progress
            style={{ height: "90px" }}
            type="dashboard"
            percent={80}
            showInfo={true}
            strokeColor="#0F406A"
            strokeWidth={12}
            gapDegree={140}
            format={percent => `${percent}`}
          />
        </div>
      </div>
      <PedalPositions />
    </div>
  );
};

export default EngineAndPower;
