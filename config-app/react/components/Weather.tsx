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
        <b
          style={{
            color: "#0F406A"
          }}
        >
          Temperature
        </b>
        <p>32</p>
      </div>
      <div style={{ float: "left", width: "33.3%" }}>
        <b
          style={{
            color: "#0F406A"
          }}
        >
          Sky
        </b>
        <p>Cloudy</p>
      </div>
    </div>
  );
};

export default Weather;
