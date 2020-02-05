import React, { Component } from "react";
import { Select, Button, Modal, Icon, Input, Menu } from "antd";
import { useState, useEffect } from "react";
import { useQmsData, QmsData } from "../../ts/qmsData";
import { StateHook } from "../../ts/hooks";

const { Option } = Select;

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
              onChange={e => setSelection(e.target.value)}
              onPressEnter={() => onSubmit(selection)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
