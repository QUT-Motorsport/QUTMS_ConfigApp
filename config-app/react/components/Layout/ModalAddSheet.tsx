import React from "react";
import { Button, Modal, Icon, Input } from "antd";
import { useState } from "react";
import { QmsData } from "../../ts/qmsData";
import { StateHook } from "../../ts/hooks";

const { Option } = Select;

// Modal for user input to create sheet
// Returns input to AnalysisMenu workbooks.worksheets.name_sheet state array
export default ({
  data,
  groupName,
  onCreateSheet,
  _selectionState: [selection, setSelection] = useState<string>(""),
  _visibleState: [visible, setVisible] = useState<boolean>(false)
}: {
  data: QmsData;
  groupName: string;
  onCreateSheet: (selection: string, groupName: string) => void;
  _selectionState?: StateHook<string>;
  _visibleState?: StateHook<boolean>;
}) => {
  // returns input (sheet name) to Analysis Menu and the group it belongs to
  const onSubmit = (selection: string) => {
    setVisible(false);
    onCreateSheet(selection, groupName);
  };

  return (
    <>
      <Icon
        type="plus"
        onClick={() => setVisible(true)}
        style={{ float: "right", marginTop: "14px" }}
      ></Icon>
      <Modal
        title="Create New Sheet"
        visible={visible}
        onOk={() => onSubmit(selection)}
        onCancel={() => setVisible(false)}
        style={{ marginTop: "200px" }}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => onSubmit(selection)}
          >
            Submit
          </Button>
        ]}
      >
        <div>
          <div className="modal-cat" style={{ float: "left" }}>
            Enter Sheet Name:
          </div>
          <div>
            <Input
              placeholder="Name of new work sheet"
              style={{ width: 210, marginLeft: "15px" }}
              value={selection}
              onChange={e => setSelection(e.target.value)}
              onPressEnter={() => onSubmit(selection)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
