import { Menu, Icon } from "antd";
import { useState } from "react";
import { StateHook } from "../../ts/hooks";
import { QmsData } from "../../ts/qmsData";
import ModalCreateGroup from "./ModalCreateGroup";
import worksheet from "../../pages/worksheet";

const { SubMenu } = Menu;

type Workbook = { name_book: string; worksheets: { name_sheet: string }[] };

export default ({
  data,
  _collapsedState: [collapsed, setCollapsed] = useState<boolean>(false),
  _workbooksState: [workbooks, setWorkbooks] = useState<Workbook[]>([])
}: {
  data: QmsData;
  _collapsedState?: StateHook<boolean>;
  _workbooksState: StateHook<Workbook[]>;
}) => {
  const onCreate = (selection: string) => {
    setWorkbooks([...workbooks, { name_book: selection, worksheets: [] }]);
  };

  return (
    <div className="something" style={{ height: "1000px" }}>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["driver", "suspension"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        <Menu.Item key="1" onClick={() => setCollapsed(!collapsed)}>
          <Icon type="right" />
          <span className="workbook">Default Workbook</span>
        </Menu.Item>
        <Menu.Item>
          <span
            style={{
              float: "right",
              marginTop: "-10px",
              paddingBottom: "10px",
              color: "#EEE02C"
            }}
          >
            <Icon type="plus" />
            Import Dataset
          </span>
        </Menu.Item>

        {workbooks.map(group => (
          <SubMenu
            key={group.name_book}
            title={
              <span>
                <Icon type="mail" />
                <span>{group.name_book}</span>
                <span>
                  <Icon
                    type="more"
                    style={{ float: "right", marginTop: "14px" }}
                  ></Icon>
                </span>
              </span>
            }
          >
            {group.worksheets.map(worksheets => (
              <Menu.Item>
                <Icon type="user" />
                <span>{worksheets}</span>
              </Menu.Item>
            ))}
          </SubMenu>
        ))}

        <SubMenu
          key="driver"
          title={
            <span>
              <Icon type="mail" />
              <span>Driver</span>
              <span>
                <Icon
                  type="more"
                  style={{ float: "right", marginTop: "14px" }}
                ></Icon>
              </span>
            </span>
          }
        >
          <Menu.Item key="2">
            <Icon type="user" />
            <span>Steering</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="slider" />
            <span>Braking</span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="inbox" />
            <span>Other</span>
          </Menu.Item>
        </SubMenu>
        <Menu.Item style={{ textAlign: "center" }}>
          <ModalCreateGroup data={data} onCreate={onCreate} />
        </Menu.Item>
      </Menu>
    </div>
  );
};
