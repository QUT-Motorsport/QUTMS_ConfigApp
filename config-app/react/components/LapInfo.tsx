import React from "react";
import { Progress } from "antd";
import { Divider } from "antd";

const lapInfo = () => {
  return (
    <div>
      <h3 style={{ margin: "10px 0", padding: "0", color: "#0F406A" }}>
        Lap Info
      </h3>
      <Divider style={{ color: "#0F406A", margin: "5px 0" }} />
      <div style={{ width: "100%" }}>
        <div style={{ float: "left", width: "50%" }}>
          <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>
            Current Lap
          </b>
          <p>1:00:02</p>
        </div>
        <div style={{ float: "right", width: "50%" }}>
          <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>
            Best Lap
          </b>
          <p>1:00:09</p>
        </div>
      </div>

      <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>
        Top Lap Speed
      </b>
      <p>100km/h</p>

      <b style={{ margin: "0", padding: "0", color: "#0F406A" }}>Total Laps</b>
      <br />
      <Progress
        type="circle"
        percent={75}
        format={percent => `4/10`}
        strokeColor="#0F406A"
        strokeWidth={12}
        style={{ marginTop: "5px" }}
      />
    </div>
  );
};

export default lapInfo;
