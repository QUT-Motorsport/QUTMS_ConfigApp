import React from "react";
import { Statistic } from "antd";
import { ReactComponent as SteeringWheel } from "../../public/images/steering-wheel.svg";
import DividerBar from "./DividerBar";

const SteeringAngle = () => {
  return (
    <div
      style={{
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ color: "#0F406A" }}>Steering Angle</h3>
      <DividerBar />

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* The Wheel SVG */}
        <div style={{ marginTop: "5px", width: "40%" }}>
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
            value={0.5}
            precision={0}
            style={{ marginLeft: "20px", fontWeight: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default SteeringAngle;
