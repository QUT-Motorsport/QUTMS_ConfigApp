import React, { Component } from "react";
import ExplorerGroup from "../Layout/Explorer/ExplorerGroup";
import ExplorerItem from "../Layout/Explorer/ExplorerItem";
import SubMenu from "antd/lib/menu/SubMenu";
import DividerBar from "../DividerBar";
import { Menu, Icon, Popconfirm, message, Layout } from "antd";
import { useState } from "react";
import { StateHook } from "../../ts/hooks";
import { QmsData } from "../../ts/qmsData";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalAddSheet from "./ModalAddSheet";

const { Header, Content, Footer, Sider } = Layout;

type Workbook = { name_book: string; worksheets: { name_sheet: string }[] };

export default ({
  data,
  _collapsedState: [collapsed, setCollapsed] = useState<boolean>(false),
  _workbooksState: [workbooks, setWorkbooks] = useState<Workbook[]>([])
}: {
  data: QmsData;
  _collapsedState?: StateHook<boolean>;
  _workbooksState?: StateHook<Workbook[]>;
}) => {
  const onCreate = (selection: string) => {
    setWorkbooks([...workbooks, { name_book: selection, worksheets: [] }]);
  };

  const onCreateSheet = (selection: string, groupName: string) => {
    for (let i = 0; i < workbooks.length; i++) {
      if (workbooks[i].name_book == groupName) {
        workbooks[i].worksheets.push({ name_sheet: selection });
      }
    }
    //trigger a refresh
    setWorkbooks([...workbooks]);
  };

  const deleteGroup = (groupName: string) => {
    for (var i = 0; i < workbooks.length; i++) {
      if (workbooks[i].name_book == groupName) {
        workbooks.splice(i, 1);
        message.success("Group Deleted");
      }
    }
    //trigger a refresh
    setWorkbooks([...workbooks]);
  };

  const deleteSheet = (sheetName: string) => {
    for (var i = 0; i < workbooks.length; i++) {
      for (var x = 0; x < workbooks[i].worksheets.length; x++) {
        if (workbooks[i].worksheets[x].name_sheet == sheetName) {
          workbooks[i].worksheets.splice(x, 1);
          message.success("Sheet Deleted");
        }
      }
    }
    //trigger a refresh
    setWorkbooks([...workbooks]);
  };

  const returnGroups = () => {
    var bookNames: string[] = [];
    workbooks.map(names => bookNames.push(names.name_book));
    return bookNames;
  };

  return (
    <div style={{ width: "200px" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#0F406A"
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      >
        <div
          style={{
            width: "100%",
            height: "70px",
            padding: "10px 24px",
            display: collapsed ? "none" : "flex",
            flexDirection: "column"
          }}
        >
          <h3
            style={{
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Electical Workbook
            {/* {data.filename} */}
          </h3>
          <span
            style={{
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Import...
          </span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          openKeys={returnGroups()}
          style={{ backgroundColor: "#0F406A" }}
        >
          {workbooks.map(group => (
            <SubMenu
              key={group.name_book}
              title={
                <>
                  <Icon type="diff" />
                  <span>{group.name_book}</span>
                  <Popconfirm
                    title="Are you sure you want to delete this group?"
                    onConfirm={() => deleteGroup(group.name_book)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Icon
                      type="delete"
                      style={{ float: "right", marginTop: "14px" }}
                    ></Icon>
                  </Popconfirm>
                  <ModalAddSheet
                    data={data}
                    groupName={group.name_book}
                    onCreateSheet={onCreateSheet}
                  />
                </>
              }
            >
              {group.worksheets.map(worksheet => (
                <Menu.Item
                  key={worksheet.name_sheet}
                  style={{
                    backgroundColor: "#0F406A",
                    margin: "0px",
                    display: collapsed ? "none" : ""
                  }}
                  title={<Icon type="diff" />}
                >
                  <span>{worksheet.name_sheet}</span>
                  <Popconfirm
                    title="Are you sure you want to delete this sheet?"
                    onConfirm={() => deleteSheet(worksheet.name_sheet)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Icon
                      type="delete"
                      style={{ float: "right", marginTop: "14px" }}
                    ></Icon>
                  </Popconfirm>
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
          <ExplorerItem
            name="Import"
            iconType="import"
            style={{
              position: "fixed",
              bottom: "88px",
              width: collapsed ? "80px" : "200px",
              margin: "0",
              marginLeft: "80px"
            }}
          />

          <Menu.Item
            style={{
              position: "fixed",
              bottom: "48px",
              width: collapsed ? "80px" : "200px",
              margin: "0",
              marginLeft: "80px"
            }}
          >
            <ModalCreateGroup data={data} onCreate={onCreate} />>
          </Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};
