import React from "react";
import { Icon, Menu } from "antd";

const ExplorerItem: React.FC<any> = ({
  name,
  iconType,
  ...props
}: {
  name: string;
  iconType: string;
  props: any;
}) => {
  return (
    <Menu.Item style={{ margin: "0px" }} key={name} {...props}>
      <Icon type={iconType} />
      <span>{name}</span>
    </Menu.Item>
  );
};

export default ExplorerItem;
