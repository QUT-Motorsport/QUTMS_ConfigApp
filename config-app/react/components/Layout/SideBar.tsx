import React from "react";
import { Layout, Menu } from "antd";
import SideBarItem from "./SideBarItem";

const { Sider } = Layout;

const SideBar = () => {
  return (
    <Sider width={100} style={{ background: "#E6E6E6", color: "#0F406A" }}>
      <Menu
        mode="vertical"
        style={{
          background: "#E6E6E6",
          textAlign: "left",
          zIndex: 100
        }}
      >
        <SideBarItem link="/" name="Home" iconType="home" />
        <SideBarItem link="/telemetry" name="Telemetry" iconType="dashboard" />
        <SideBarItem link="/analysis" name="Analysis" iconType="heat-map" />
        <SideBarItem
          link="/simulation"
          name="Simulation"
          iconType="line-chart"
        />
        <SideBarItem link="/config" name="Config" iconType="code" />
      </Menu>
    </Sider>
  );
};

export default SideBar;
