import React from "react";
import Link from "next/link";
import { Layout } from "antd";
const { Header } = Layout;

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
              position: "relative"
            }}
          >
            <img
              src="/images/qms_icon_2.png"
              style={{
                top: "0",
                bottom: "0",
                margin: "auto",
                position: "absolute"
              }}
            />
          </div>
        </a>
      </Link>
    </Header>
  );
};

export default HeaderBar;