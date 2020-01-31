import React from "react";
import { Progress } from "antd";
import { Divider, Statistic } from "antd";

const lapInfo = () => {
  return (
    <div style={{ height: "80%" }}>
      <h3 style={{ margin: "10px 0", padding: "0", color: "#0F406A" }}>
        Lap Info
      </h3>
      <Divider style={{ color: "#0F406A", margin: "5px 0" }} />
      <div style={{ width: "100%" }}>
        <div style={{ float: "left", width: "50%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Current Lap"
            value={"1:00:00"}
            precision={2}
          />
        </div>
        <div style={{ float: "left", width: "50%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Best Lap"
            value={"1:03:00"}
            precision={2}
          />
        </div>
      </div>

      <div>
        <div style={{ float: "left", width: "50%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Top Lap Speed"
            value={"100"}
            suffix={"km/h"}
            precision={0}
          />
        </div>

        <div style={{ float: "left", width: "50%" }}>
          <Statistic
            style={{
              color: "#0F406A !important",
              fontWeight: 600,
              opacity: 100
            }}
            valueStyle={{ color: "#0F406A" }}
            title="Top Race Speed"
            value={"200"}
            suffix={"km/h"}
            precision={0}
          />
        </div>
      </div>

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
