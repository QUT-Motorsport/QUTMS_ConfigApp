import React, { Component } from "react";
import { Select, Button, Modal, Icon } from "antd";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { QmsData } from "../../ts/api";
import { Spin } from "antd";
import AnalysisMenu from "../Layout/AnalysisMenu";

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
    this.setState({
      visible: false,
      selection: this.props.data.channels[0].name
    });
  }

  showModal = () => {
    this.setState({
      ...this.state,
      visible: true
    });
  };

  handleOk = () => {
    this.setState({ visible: false });
    //this.setState({ selection: value });
    //console.log({ selection });
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
        <a onClick={this.showModal}>
          <Icon type="plus" />
          <span style={{ textDecorationLine: "underline", color: "#fff" }}>
            Create New Group
          </span>
        </a>
        <Modal
          title="Create Group"
          onOk={this.handleOk} //use this to handle add component
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
              {/* Dropdown data selection */}
              <Select
                defaultValue={this.props.data.channels[0].name}
                style={{ width: 210, marginLeft: "15px" }}
                value={this.state.selection}
                onChange={(value: string) => {
                  this.setState({
                    ...this.state,
                    selection: value
                  });
                }}
              >
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
