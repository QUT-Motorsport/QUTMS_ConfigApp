import React from "react";
import { Divider, Statistic } from "antd";

const SteeringAngle = () => {
  return (
    <div style={{ height: "20%" }}>
      <h3 style={{ marginTop: "10px", padding: "0", color: "#0F406A" }}>
        Steering Angle
      </h3>
      <Divider style={{ color: "#0F406A", margin: "0px 0" }} />
      <div style={{ width: "100%", marginTop: "10px" }}>
        <img
          src="https://i0.wp.com/boxthislap.org/app/uploads/2019/08/CSL-E-F1-SET-M_07.png?resize=540%2C300&ssl=1"
          alt="Steering Wheel"
          width="150px"
        />
      </div>

      <div style={{ width: "100%" }}>
        <div style={{ float: "left", width: "33.33%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Min"
            value={0.5}
            precision={0}
          />
        </div>
        <div style={{ float: "left", width: "33.33%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Current"
            value={1}
            precision={0}
          />
        </div>
        <div style={{ float: "left", width: "33.33%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Max"
            value={1.5}
            precision={0}
          />
        </div>
      </div>
    </div>
  );
};

export default SteeringAngle;
