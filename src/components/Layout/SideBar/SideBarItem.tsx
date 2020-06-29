import React from "react";
import { Menu } from "antd";

import { Link } from "react-router-dom";

import styles from "./SideBarItem.module.scss";

const SideBar = ({
  link,
  Icon,
  name,
  ...sideBarProps
}: {
  link: string;
  Icon: React.ComponentType<any>;
  name: string;
}) => {
  return (
    <Link to={link} className={styles.sideBarItem}>
      <Menu.Item
        key={link}
        style={{
          margin: "0px",
          padding: "5px 0px",
          height: "auto",
          lineHeight: "normal",
        }}
        {...sideBarProps}
      >
        <Icon
          style={{
            width: "100%",
            padding: "0px",
            fontSize: "24px",
            margin: "10px 0px",
          }}
        />
        <p
          style={{
            width: "100%",
            textAlign: "center",
            padding: "0px 0px",
            margin: "0px",
            fontSize: "14px",
          }}
        >
          {name}
        </p>
      </Menu.Item>
    </Link>
  );
};

export default SideBar;
