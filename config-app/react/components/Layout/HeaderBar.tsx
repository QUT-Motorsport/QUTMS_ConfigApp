import React from "react";
import Link from "next/link";
import { Layout } from "antd";
const { Header } = Layout;
import UserInfo from "./UserInfo";

const HeaderBar = () => {
  return (
    <Header
      className="header"
      style={{
        backgroundColor: "#FFFFFF",
        height: "60px",
        boxShadow: "0px 5px 5px 0px rgba(0,0,0,0.25)",
        zIndex: 3,
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
              // src="/images/config_hub.png"
              src="/images/logo_1.png"
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
