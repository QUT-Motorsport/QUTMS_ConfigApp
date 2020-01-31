import React from "react";
import { Progress, Divider } from "antd";
import PedalPositions from "./PedalPosition";

const EngineAndPower = () => {
  return (
    <div>
      <h3 style={{ margin: "10px 0", padding: "0", color: "#0F406A" }}>
        Engine and Power
      </h3>
      <Divider style={{ color: "#0F406A", margin: "5px 0" }} />
      <div>
        <b
          style={{
            padding: "0",
            color: "#0F406A",
            width: "100%",
            margin: "10px 0"
          }}
        >
          Speed
        </b>
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
