import React from "react";
import Link from "next/link";
import { Layout, Icon, Menu } from "antd";

const SideBar = ({
  link,
  iconType,
  name,
  ...sideBarProps
}: {
  link: string;
  iconType: string;
  name: string;
}) => {
  return (
    <Link href={link}>
      <a className="SideBarItem">
        <Menu.Item
          key={link}
          style={{
            margin: "0px",
            padding: "5px 0px",
            height: "auto",
            lineHeight: "normal"
          }}
          {...sideBarProps}
        >
          <Icon
            type={iconType}
            style={{
              width: "100%",
              padding: "0px",
              fontSize: "24px",
              margin: "10px 0px"
            }}
          />
          <p
            style={{
              width: "100%",
              textAlign: "center",
              padding: "0px 0px",
              margin: "0px"
            }}
          >
            {name}
          </p>
        </Menu.Item>
        <style jsx>{`
          .SideBarItem {
            color: #0f406a;
            height: 24px;
            width: 100%;
            margin: 15px 0px;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default SideBar;
