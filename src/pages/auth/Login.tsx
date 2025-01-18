import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import type { FormProps } from "antd";

import axiosInstance from "../../api/axiosInstance";
import { useAppContext } from "../../context/App.Context";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAppContext();

  const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      const { token } = response.data;
      setAuthToken(token);
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
      message.success("Login successful!");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong!";
      message.error(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="form-title">Time Management System</h2>
      <Form
        name="login-form"
        validateMessages={validateMessages}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item name="email" rules={[{ type: "email", required: true }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <span className="flex-right">
          Don't have an account? <Link to="/register">&nbsp;Register</Link>
        </span>
        <Form.Item label={null}>
          <Button className="mt-10" type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
