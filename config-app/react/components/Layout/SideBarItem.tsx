import React from "react";
import Link from "next/link";
import { Layout, Icon, Menu } from "antd";

const SideBar: React.FC<any> = props => {
  return (
    <Link href={props.link}>
      <a className="SideBarItem">
        <Menu.Item key={props.link}>
          <Icon
            type={props.iconType}
            style={{
              width: "100%",
              padding: "10px 0px",
              fontSize: "24px"
            }}
          />
          <p
            style={{
              width: "100%",
              textAlign: "center",
              padding: "5px 0px"
            }}
          >
            {props.name}
          </p>
        </Menu.Item>
        <style jsx>{`
          .SideBarItem {
            color: #0f406a;
          }
          .SideBarItem:hover {
            color: blue;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default SideBar;
