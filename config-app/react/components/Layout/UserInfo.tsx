import React from "react";
import { Avatar, Dropdown, Menu } from "antd";

const UserInfo = () => {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#">Profile Settings</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/">Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <a>
          <Avatar size="large" icon="user" />
        </a>
      </Dropdown>
    </div>
  );
};

export default UserInfo;
