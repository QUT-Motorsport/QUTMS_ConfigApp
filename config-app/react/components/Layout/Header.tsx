import React from "react";

import { Layout } from "antd";
const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header
      className="header"
      style={{
        backgroundColor: "#FFFFFF",
        height: "80px",
        boxShadow: "0px 1px 10px #00000066",
        zIndex: 1
      }}
    >
      <a href="/index">
        <div className="logo" style={{ marginLeft: "0px" }}>
          <img src="/images/qms_icon_2.png" />
        </div>
      </a>
    </Header>
  );
};

export default HeaderBar;
