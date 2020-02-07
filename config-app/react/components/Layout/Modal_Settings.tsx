import React, { Component } from "react";
import { Select, Button, Modal, Avatar } from "antd";

const { Option } = Select;

// settings modal currently tied to the SubHeader component
class ModalSettings extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    return (
      <div
        style={{
          float: "right",
          paddingTop: "15px",
          paddingRight: "26px"
        }}
      >
        <a onClick={this.showModal}>
          <Avatar size="large" icon="setting"></Avatar>
        </a>
        <Modal
          title="Component Settings"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ marginTop: "120px" }}
        >
          <p>Add settings</p>
        </Modal>
      </div>
    );
  }
}

export default ModalSettings;
