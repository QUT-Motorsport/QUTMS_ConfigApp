import React from "react";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function UserInfo() {
  const menu = (
    <Menu>
      <Menu.Item>Profile Settings</Menu.Item>
      <Menu.Item>Logout</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ cursor: "pointer" }}>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Avatar size="large" icon={<UserOutlined />} />
      </Dropdown>
    </div>
  );
}