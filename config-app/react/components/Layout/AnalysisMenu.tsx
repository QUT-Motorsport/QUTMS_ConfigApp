import { Menu, Icon, Popconfirm, message } from "antd";
import { useState } from "react";
import { StateHook } from "../../ts/hooks";
import { QmsData } from "../../ts/qmsData";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalAddSheet from "./ModalAddSheet";
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
    <div className="something" style={{ height: "1000px" }}>
      <Menu
        openKeys={returnGroups()}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      >
        <Menu.Item key="workbookTitle" onClick={() => setCollapsed(!collapsed)}>
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

                <span>
                  <ModalAddSheet
                    data={data}
                    groupName={group.name_book}
                    onCreateSheet={onCreateSheet}
                  />
                </span>
              </span>
            }
          >
            {group.worksheets.map(worksheet => (
              <Menu.Item key={worksheet.name_sheet}>
                <Icon type="file" />
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

        <Menu.Item style={{ textAlign: "center" }}>
          <ModalCreateGroup data={data} onCreate={onCreate} />
        </Menu.Item>
      </Menu>
    </div>
  );
};
