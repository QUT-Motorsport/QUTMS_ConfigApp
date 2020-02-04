import React from "react";
import { Layout, Menu } from "antd";
import SideBarItem from "./SideBarItem";

const { Sider } = Layout;

const SideBar = () => {
  return (
    <Sider
      width={100}
      style={{
        background: "#F2EFEA",
        boxShadow: "5px 2px 5px 0px rgba(0,0,0,0.25)",
        zIndex: 2
      }}
    >
      <Menu
        mode="vertical"
        style={{
          background: "#F2EFEA",
          textAlign: "left",
          zIndex: 1,
          paddingTop: "10px"
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
        <SideBarItem link="/config" name="Config" iconType="sliders" />
      </Menu>
    </Sider>
  );
};

export default SideBar;
