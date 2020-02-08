import React from "react";
import { Button, Modal, Icon, Input } from "antd";
import { useState } from "react";
import { QmsData } from "../../ts/qmsData";
import { StateHook } from "../../ts/hooks";

// Modal for user input to create group
// Returns input to AnalysisMenu workbooks.name_book state array
export default ({
  data,
  onCreate,
  _selectionState: [selection, setSelection] = useState<string>(""),
  _visibleState: [visible, setVisible] = useState<boolean>(false)
}: {
  data: QmsData;
  onCreate: (selection: string) => void;
  _selectionState?: StateHook<string>;
  _visibleState?: StateHook<boolean>;
}) => {
  // returns input (group name) to Analysis Menu
  const onSubmit = (selection: string) => {
    setVisible(false);
    onCreate(selection);
  };

  return (
    <>
      <a key="modal" onClick={() => setVisible(true)}>
        <Icon type="plus" />
        <span>Create New Group</span>
      </a>
      <Modal
        title="Create Group"
        visible={visible}
        onOk={() => onSubmit(selection)}
        onCancel={() => setVisible(false)}
        style={{ marginTop: "200px" }}
        footer={[
          <Button
            key="submit"
            type="primary"
            // submit will trigger a state change on 'selection' value (effectively adding the input to the workbooks array)
            onClick={() => onSubmit(selection)}
          >
            Submit
          </Button>
        ]}
      >
        <div>
          <div className="modal-cat" style={{ float: "left" }}>
            Enter Group Name:
          </div>
          <div>
            <Input
              placeholder="Name of new group"
              style={{ width: 210, marginLeft: "15px" }}
              value={selection}
              // set selection value to user input
              onChange={e => setSelection(e.target.value)}
              // return key press will trigger a state change on 'selection' value (effectively adding the input to the workbooks array)
              onPressEnter={() => onSubmit(selection)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
