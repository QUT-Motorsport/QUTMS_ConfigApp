import React, { Component } from "react";
import { Select, Button, Modal, Icon } from "antd";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { QmsData } from "../../ts/api";
import { Spin } from "antd";
import AnalysisMenu from "./AnalysisMenu";

const { Option } = Select;

const useQmsData = (filename: string): QmsData | null => {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    QmsData.download(filename).then(setQmsData);
  }, []);

  return qmsData;
};

class ModalAdd extends Component<
  { data: QmsData },
  { visible: boolean; selection: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      selection: this.props.data.channels[0].name
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ visible: false });

    console.log(this.state.selection);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    /* Dropdown channel list creation */
    const dropdowns = [];
    for (var channel of this.props.data.channels) {
      dropdowns.push(channel.name);
    }

    return (
      <div>
        <a key="modal" onClick={this.showModal}>
          <Icon type="plus" />
          <span style={{ textDecorationLine: "underline", color: "#fff" }}>
            Create New Group
          </span>
        </a>
        <Modal
          title="Create Group"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ marginTop: "200px" }}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Submit
            </Button>
          ]}
        >
          <div>
            <div className="modal-cat" style={{ float: "left" }}>
              Select Channel:
            </div>
            <div>
              {/* Select Search Channel Init */}
              <Select
                showSearch
                placeholder="Select a new channel"
                style={{ width: 210, marginLeft: "15px" }}
                value={this.state.selection}
                onChange={(value: string) => {
                  this.setState({
                    ...this.state,
                    selection: value
                  });
                }}
              >
                {/* Options List */}
                {dropdowns.map(channel => (
                  <Option value={channel}>{channel}</Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ({ _qmsData: data = useQmsData("Sample") }) =>
  data ? <ModalAdd data={data} /> : <Spin />;
