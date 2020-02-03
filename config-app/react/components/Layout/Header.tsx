import React from "react";
import Link from "next/link";
import { Layout, Avatar } from "antd";
const { Header } = Layout;
import UserInfo from "../Layout/UserInfo";

const HeaderBar = () => {
  return (
    <Header
      className="header"
      style={{
        backgroundColor: "#FFFFFF",
        height: "60px",
        boxShadow: "0px 1px 10px #00000066",
        zIndex: 1,
        padding: "0px 10px",
        whiteSpace: "nowrap"
      }}
    >
      <Link href={"/"}>
        <a>
          <div
            style={{
              height: "60px",
              position: "relative",
              float: "left"
            }}
          >
            <img
              src="/images/config_hub.png"
              style={{
                top: "0",
                bottom: "0",
                left: "10px",
                margin: "auto",
                position: "absolute",
                width: "180px"
              }}
            />
          </div>
        </a>
      </Link>
      <div
        style={{
          float: "right",
          marginRight: "47px",
          marginTop: "-10px"
        }}
      >
        <UserInfo />
      </div>
    </Header>
  );
};

export default HeaderBar;
