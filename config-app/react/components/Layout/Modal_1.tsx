import React, { Component } from "react";
import { Select, Button, Modal } from "antd";

const { Option } = Select;

class ModalTest extends Component {
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
      <div className="add-component">
        <Button type="primary" onClick={this.showModal}>
          + Add Component
        </Button>
        <Modal
          title="Add Component"
          visible={this.state.visible}
          onOk={this.handleOk} //use this to handle add component
          style={{ top: 300 }}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Create Component
            </Button>
          ]}
        >
          <div>
            <div className="modal-cat" style={{ float: "left" }}>
              Display Type:
            </div>
            <div>
              <Select
                defaultValue="Line"
                style={{ width: 120, marginLeft: "15px" }}
              >
                <Option value="Line">Line</Option>
                <Option value="Scatter">Scatter</Option>
                <Option value="Box Plot">Box Plot</Option>
                <Option value="Histogram">Histogram</Option>
              </Select>
            </div>
          </div>
          <div>
            <div>group selection bar goes here</div>
          </div>
          <div>
            <div>table goes here</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ModalTest;
