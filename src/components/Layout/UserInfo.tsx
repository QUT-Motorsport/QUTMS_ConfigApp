import React from "react";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

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
          <Avatar size="large" icon={<UserOutlined />} />
        </a>
      </Dropdown>
    </div>
  );
};

export default UserInfo;
