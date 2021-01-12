import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

import UserInfo from "./UserInfo";
import logo_src from "../pages/images/config_hub.png";

const HeaderBar = () => {
  return (
    <Layout.Header
      className="header"
      style={{
        backgroundColor: "#FFFFFF",
        height: "60px",
        boxShadow: "0px 5px 5px 0px rgba(0,0,0,0.25)",
        zIndex: 3,
        padding: "0px 10px",
        whiteSpace: "nowrap",
      }}
    >
      <Link to={"/"}>
        <div
          style={{
            height: "60px",
            position: "relative",
            float: "left",
          }}
        >
          <img
            src={logo_src}
            alt="configapp logo"
            style={{
              top: "0",
              bottom: "0",
              left: "10px",
              margin: "auto",
              position: "absolute",
              width: "180px",
            }}
          />
        </div>
      </Link>
      <div
        style={{
          float: "right",
          marginRight: "47px",
          marginTop: "-2px",
        }}
      >
        <UserInfo />
      </div>
    </Layout.Header>
  );
};

export default HeaderBar;