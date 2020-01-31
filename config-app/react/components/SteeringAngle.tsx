import React from "react";
import { Divider } from "antd";

const SteeringAngle = () => {
  return (
    <div>
      <h3 style={{ marginTop: "40px", padding: "0", color: "#0F406A" }}>
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
        <div style={{ float: "left", width: "33.3%" }}>
          <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>Min</b>
          <p>0.5</p>
        </div>
        <div style={{ float: "right", width: "33.3%" }}>
          <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>Current</b>
          <p>1</p>
        </div>
        <div style={{ float: "right", width: "33.3%" }}>
          <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>Max</b>
          <p>1.5</p>
        </div>
      </div>
    </div>
  );
};

export default SteeringAngle;
