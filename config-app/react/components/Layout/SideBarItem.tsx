import React from "react";
import Link from "next/link";
import { Layout, Icon, Menu } from "antd";

type ISidebarProps = {};

const SideBar = ({
  link,
  iconType,
  ...menuItemProps
}: {
  link: string;
  iconType: string;
  menuItemProps: any;
}) => {
  console.log(menuItemProps);
  return (
    <Link href={link}>
      <a className="SideBarItem">
        <Menu.Item key={link} {...menuItemProps}>
          <Icon
            type={iconType}
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
            {menuItemProps.name}
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
