import { Card, Icon, Form, Input, Checkbox, Button, Divider } from "antd";
import { Component } from "react";
import "../styles/login.css";

export default class App extends Component {
  render() {
    return (
      // <div>
      <div
        className="login-background"
        style={{ backgroundImage: "url(./images/Sam.jpg)" }}
      >
        <Card
          style={{
            width: 300,
            marginLeft: "12%",
            position: "absolute",
            height: "100vh",
            opacity: "0.88"
          }}
        >
          <img
            src="/images/config_hub.png"
            style={{
              width: "80%",
              marginLeft: "10%",
              marginBottom: "25px",
              marginTop: "100%"
            }}
          />
          <Form>
            <Form.Item>
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email Address"
              />
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="First and Last Name"
              />
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="primary-colour login-form-button"
                block
              >
                Register
              </Button>
              <Divider />
              Or
              <a href="/" style={{ marginLeft: "5px" }}>
                login
              </a>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}
