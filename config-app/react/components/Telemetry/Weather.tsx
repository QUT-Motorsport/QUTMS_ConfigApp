import React from "react";
import { Statistic } from "antd";

const Weather = () => {
  return (
    <div
      style={{
        marginTop: "10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <div>
        <Statistic
          valueStyle={{ color: "#0F406A" }}
          title="Temperature"
          value={32}
          suffix={"C"}
          precision={0}
          style={{ fontWeight: 600 }}
        />
      </div>
      <div>
        <Statistic
          valueStyle={{ color: "#0F406A" }}
          title="Humidity"
          value={"20%"}
          precision={0}
          style={{ fontWeight: 600 }}
        />
      </div>
      <div>
        <Statistic
          valueStyle={{ color: "#0F406A" }}
          title="Sky"
          value={"Cloudy"}
          precision={0}
          style={{ fontWeight: 600 }}
        />
      </div>
    </div>
  );
};

export default Weather;
