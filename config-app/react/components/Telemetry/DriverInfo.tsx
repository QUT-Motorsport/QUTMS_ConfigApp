import React from "react";

const DriverInfo = () => {
  return (
    <div style={{ margin: "10px 0", padding: "0", color: "#0F406A" }}>
      {/* Driver number */}
      <div
        style={{
          height: "50px",
          width: "50px",
          color: "white",
          backgroundColor: "#0F406A",
          textAlign: "center",
          fontWeight: 600,
          lineHeight: "50px",
          fontSize: "24px",
          float: "left"
        }}
      >
        46
      </div>

      {/* Driver name */}
      <div
        style={{
          margin: "0",
          padding: "0",
          color: "#0F406A",
          float: "left",
          fontWeight: 600,
          fontSize: "24px",
          height: "50px",
          lineHeight: "50px",
          marginLeft: "10px"
        }}
      >
        Thomas Gantt
      </div>
    </div>
  );
};

export default DriverInfo;
