import React from "react";
import { Menu, Icon } from "antd";

const { SubMenu } = Menu;

const ExplorerGroup: React.FC<any> = ({
  name,
  iconType,
  ...props
}: {
  name: string;
  iconType: string;
  props: any;
}) => {
  return (
    <SubMenu
      style={{ margin: "0px" }}
      key={name}
      title={
        <span>
          <Icon type={iconType} />
          <span>{name}</span>
        </span>
      }
      {...props}
    >
      {props.children}
    </SubMenu>
  );
};

export default ExplorerGroup;
