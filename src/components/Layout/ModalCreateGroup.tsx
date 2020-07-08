import React from "react";
import { Button, Modal, Input } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

// Modal for user input to create group
// Returns input to AnalysisMenu workbooks.name_book state array
const ModalCreateGroup = ({
  onCreate,
}: {
  onCreate: (selection: string) => void;
}) => {
  const [selection, setSelection] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  // returns input (group name) to Analysis Menu
  const onSubmit = (selection: string) => {
    setVisible(false);
    onCreate(selection);
  };

  return (
    <>
      <span key="modal" onClick={() => setVisible(true)}>
        <PlusOutlined />
        <span>Create New Group</span>
      </span>
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
          </Button>,
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
              onChange={(e) => setSelection(e.target.value)}
              // return key press will trigger a state change on 'selection' value (effectively adding the input to the workbooks array)
              onPressEnter={() => onSubmit(selection)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreateGroup;
