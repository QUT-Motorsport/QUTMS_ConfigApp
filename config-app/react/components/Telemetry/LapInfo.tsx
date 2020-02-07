import React from "react";
import { Progress } from "antd";
import { Divider, Statistic } from "antd";
import DividerBar from "../DividerBar";
import Label from "../Label";

const lapInfo = () => {
  return (
    <div style={{ marginTop: "5px" }}>
      <h3 style={{ color: "#0F406A" }}>Lap Info</h3>
      <DividerBar />

      {/* Current Lap */}
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "row" }}>
        <div style={{ float: "left", width: "50%" }}>
          <Statistic
            valueStyle={{ color: "#0F406A" }}
            title="Current Lap"
            value={"1:00:00"}
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

      <div style={{ marginTop: "10px", display: "flex", flexDirection: "row" }}>
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
          percent={70}
          format={percent => `7/10`}
          strokeColor="#0F406A"
          strokeWidth={12}
          style={{ fontWeight: 600 }}
        />
      </div>
    </div>
  );
};

export default lapInfo;
