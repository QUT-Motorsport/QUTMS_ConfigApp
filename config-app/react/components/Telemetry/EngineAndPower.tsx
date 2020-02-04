import React from "react";
import { Progress, Divider, Statistic } from "antd";
import PedalPositions from "./PedalPosition";
import DividerBar from "../DividerBar";
import Label from "../Label";

const EngineAndPower = () => {
  return (
    <div style={{ marginTop: "5px" }}>
      <h3 style={{ padding: "0", color: "#0F406A" }}>Engine and Power</h3>
      <DividerBar />
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "",
            height: "100%"
          }}
        >
          <div style={{ width: "50%" }}>
            <Label title="Current Speed" />
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
          <div style={{ width: "50%" }}>
            <Statistic title={"Charge"} value={100} suffix="%" />
          </div>
        </div>
      </div>
      <PedalPositions />
    </div>
  );
};

export default EngineAndPower;
