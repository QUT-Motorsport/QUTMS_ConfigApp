import React from "react";
import { Statistic } from "antd";

const Weather = () => {
  return (
    <div>
      <div style={{ float: "left", width: "33.3%" }}>
        <Statistic
          style={{ color: "#0F406A !important", fontWeight: 600, opacity: 100 }}
          valueStyle={{ color: "#0F406A" }}
          title="Temperature"
          value={32}
          precision={2}
        />
      </div>
      <div style={{ float: "left", width: "33.3%" }}>
        <Statistic
          style={{ color: "#0F406A !important", fontWeight: 600, opacity: 100 }}
          valueStyle={{ color: "#0F406A" }}
          title="Humidity"
          value={"20%"}
          precision={2}
        />
      </div>
      <div style={{ float: "left", width: "33.3%" }}>
        <Statistic
          style={{ color: "#0F406A !important", fontWeight: 600, opacity: 100 }}
          valueStyle={{ color: "#0F406A" }}
          title="Sky"
          value={"Cloudy"}
          precision={2}
        />
      </div>
    </div>
  );
};

export default Weather;
