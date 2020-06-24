import React from "react";
import { Card, Form, Input, Button, Divider } from "antd";
import { Link } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";

import { useTitle } from "./_helpers";
import logoSrc from "./wideLogo.png";
import landingBgSrc from "./landingBg.jpg";

import styles from "./loginRegister.module.scss";

export default function LoginPage() {
  useTitle("QUTMS");
  return (
    <>
      <div
        className={styles.loginBackground}
        style={{ backgroundImage: `url(${landingBgSrc})` }}
      >
        <Card
          style={{
            width: 300,
            marginLeft: "12%",
            position: "absolute",
            height: "100vh",
            opacity: "0.88",
          }}
        >
          <img
            src={logoSrc}
            alt="configapp logo"
            style={{
              width: "80%",
              marginLeft: "10%",
              marginBottom: "25px",
              marginTop: "100%",
            }}
          />
          <Form>
            <Form.Item>
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email Address"
              />
            </Form.Item>
            <Form.Item>
              <Link to="/home">
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`${styles.primaryColour} ${styles.loginFormButton}`}
                  block
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/guest">
                <Button
                  htmlType="submit"
                  className={`${styles.secondaryColour} ${styles.loginFormButton}`}
                  block
                >
                  Sign in as Guest
                </Button>
              </Link>
              <Divider />
              Or
              <Link
                className={styles.primaryColourLink}
                to="/register"
                style={{ marginLeft: "5px" }}
              >
                register now!
              </Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
