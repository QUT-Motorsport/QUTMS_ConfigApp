import React from "react";
import { Card, Form, Input, Button, Divider } from "antd";
import { Link } from "react-router-dom";

import { MailOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
// import { useTitle } from "./_helpers";

import logoSrc from "./images/wideLogo.png";
import landingBgSrc from "./images/landingBg.jpg";
import styles from "./styles/loginRegister.module.scss";

export default function RegisterPage() {
//   useTitle("QUTMS Register");

// Layout for form
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// Makes sure necessary info being entered
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
};

// Code for when the form is submitted
const onFinish = (values: any) => {
  values.preventDefault();
  const data = { values };
  console.log('submit');
  console.log(values);
  fetch('http://0.0.0.0:5873/registration/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => console.log(res));
};

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
          <Form {...layout} name="registration" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email Address"
              />

            </Form.Item>
            <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>              
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="First and Last Name"
              />
            </Form.Item>
            <Form.Item name={['user', 'password']} label="Password">              
              <Input
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.primaryColour} ${styles.loginFormButton}`}
                block
              >
                Register
              </Button>
              <Divider />
              Or
              <Link to="/login" style={{ marginLeft: "5px" }}>
                login
              </Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}  