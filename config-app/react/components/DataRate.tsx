import React from "react";
import { Result } from "antd";

const DataRate = () => {
  return (
    <div>
      <Result
        style={{ backgroundColor: "grey", height: "50px" }}
        status="warning"
        title="Lost connection with car"
      />
    </div>
  );
};

export default DataRate;
