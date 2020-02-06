import { Card, Icon, Form, Input, Checkbox, Button, Divider } from "antd";
import Link from "next/link";
import Head from "next/head";
import { Component } from "react";
import "../styles/login.css";

export default class App extends Component {
  render() {
    return (
      <>
        <Head>
          <title>QUT ConfigHub - Login</title>
        </Head>
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
              </Form.Item>
              <Form.Item>
                <Link href="/home">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="primary-colour login-form-button"
                    block
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/guest">
                  <Button
                    htmlType="submit"
                    className="secondary-colour login-form-button"
                    block
                  >
                    Sign in as Guest
                  </Button>
                </Link>
                <Divider />
                Or
                <a
                  className="primary-colour-link"
                  href="/register"
                  style={{ marginLeft: "5px" }}
                >
                  register now!
                </a>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </>
    );
  }
}
