import React from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { Menu, Popconfirm, message, Layout } from "antd";
import { useState } from "react";
import { QmsData } from "../../ts/qmsData/types";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalAddSheet from "./ModalAddSheet";
import {
  DiffOutlined,
  DeleteOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { StateHook } from "../../ts/hooks";

// object to hold all side menu data
type Workbook = { name_book: string; worksheets: { name_sheet: string }[] };

// renders the analysis side menu
const AnalysisMenu = ({
  data,
  collapsedState: [collapsed, setCollapsed],
}: {
  data: QmsData;
  collapsedState: StateHook<boolean>;
}) => {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);

  // append new input to workbooks array while preserving existing state
  // this is passed to the ModalCreateGroup modal to retrieve user input
  const onCreate = (selection: string) => {
    setWorkbooks([...workbooks, { name_book: selection, worksheets: [] }]);
  };

  // append to worksheet array
  const onCreateSheet = (selection: string, groupName: string) => {
    for (let i = 0; i < workbooks.length; i++) {
      if (workbooks[i].name_book === groupName) {
        workbooks[i].worksheets.push({ name_sheet: selection });
      }
    }
    //trigger a refresh
    setWorkbooks([...workbooks]);
  };

  // remove from workbook array
  const deleteGroup = (groupName: string) => {
    for (var i = 0; i < workbooks.length; i++) {
      if (workbooks[i].name_book === groupName) {
        workbooks.splice(i, 1);
        message.success("Group Deleted");
      }
    }
    //trigger a refresh
    setWorkbooks([...workbooks]);
  };

  // remove from worksheet array
  const deleteSheet = (sheetName: string) => {
    for (var i = 0; i < workbooks.length; i++) {
      for (var x = 0; x < workbooks[i].worksheets.length; x++) {
        if (workbooks[i].worksheets[x].name_sheet === sheetName) {
          workbooks[i].worksheets.splice(x, 1);
          message.success("Sheet Deleted");
        }
      }
    }
    //trigger a refresh
    setWorkbooks([...workbooks]);
  };

  // generate list of current group names (for openKeys)
  const returnGroups = () => {
    var bookNames: string[] = [];
    workbooks.map((names) => bookNames.push(names.name_book));
    return bookNames;
  };

  return (
    <Layout.Sider
      style={{
        backgroundColor: "#0F406A",
        position: "relative",
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      {collapsed ? null : (
        <h3
          style={{
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            margin: 16,
          }}
        >
          {/* This should probably be made editable */}
          {data.filename}
        </h3>
      )}
      {/* </div> */}

      {/* Dynamic Group/Sheet Menu */}
      <Menu
        theme="dark"
        mode="inline"
        openKeys={returnGroups()}
        style={{ backgroundColor: "#0F406A" }}
      >
        {/* for each group in the current workbooks array, render the group as its own submenu */}
        {workbooks.map((group) => (
          <SubMenu
            key={group.name_book}
            title={
              <>
                <DiffOutlined />
                <span>{group.name_book}</span>
                {/* delete sheet button */}
                <Popconfirm
                  title="Are you sure you want to delete this group?"
                  onConfirm={() => deleteGroup(group.name_book)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined
                    style={{ float: "right", marginTop: "14px" }}
                  />
                </Popconfirm>
                {/* add worksheets button */}
                <ModalAddSheet
                  data={data}
                  groupName={group.name_book}
                  onCreateSheet={onCreateSheet}
                />
              </>
            }
          >
            {/* for each worksheet in the current group, render the sheet name as its own Menu.Item */}
            {group.worksheets.map((worksheet) => (
              <Menu.Item
                key={worksheet.name_sheet}
                style={{
                  backgroundColor: "#0F406A",
                  margin: "0px",
                  display: collapsed ? "none" : "",
                }}
              >
                <DiffOutlined />
                {worksheet.name_sheet}
                {/* delete sheet button */}
                <Popconfirm
                  title="Are you sure you want to delete this sheet?"
                  onConfirm={() => deleteSheet(worksheet.name_sheet)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined
                    style={{ float: "right", marginTop: "14px" }}
                  />
                </Popconfirm>
              </Menu.Item>
            ))}
          </SubMenu>
        ))}
      </Menu>
      <Menu
        theme="dark"
        mode="inline"
        style={{
          backgroundColor: "#0F406A",
          position: "absolute",
          bottom: 60,
        }}
        selectable={false}
      >
        {/* Import button */}
        <Menu.Item>
          <ImportOutlined />
          <span>Import</span>
        </Menu.Item>
        {/* Houses the group add button/modal */}
        <Menu.Item>
          <ModalCreateGroup onCreate={onCreate} />
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};

export default AnalysisMenu;
