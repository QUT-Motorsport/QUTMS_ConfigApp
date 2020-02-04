import React, { Component } from "react";
import { Table, Divider, Tag } from "antd";
import DividerBar from "../DividerBar";

class RawTelemetry extends Component {
  state = {
    // workbook: [
    //   {
    //     name: "Group1",
    //     worksheets: [{ name: "Driver" }]
    //   }
    // ]
  };

  render() {
    const columns = [
      {
        title: "Channel",
        dataIndex: "channel",
        key: "channel"
      },
      {
        title: "Reading",
        dataIndex: "reading",
        key: "reading"
      },
      {
        title: "Unit",
        key: "unit",
        dataIndex: "unit"
      }
    ];

    const data = [
      {
        key: "1",
        channel: "Longitudal Velocity",
        reading: 1,
        unit: "g"
      },
      {
        key: "2",
        channel: "Air Pressure",
        reading: 40,
        unit: "ppi"
      },
      {
        key: "3",
        channel: "Speed",
        reading: 32,
        unit: "km/h"
      }
    ];
    return (
      <div className="telemetry">
        <h3 style={{ marginTop: "10px", padding: "0", color: "#0F406A" }}>
          Raw Telemetry
        </h3>
        <DividerBar />
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
          style={{ marginTop: "10px" }}
        />
        {/* <style jsx>{`
          .telemetry :global(th) {
            background-color: #000 !important;
          }
        `}</style> */}
      </div>
    );
  }
}

export default RawTelemetry;
