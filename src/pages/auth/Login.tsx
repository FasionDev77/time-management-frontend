import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import axios from "axios";
import { Button, Checkbox, Form, Input, message } from "antd";

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
    const handleSubmit: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/login", {
            email: values.email,
            password: values.password,
          });
          localStorage.setItem("authToken", response.data.token);
          navigate("/dashboard");
          console.log("Login Response:", response);
          message.success("Login successful!");
        } catch (error) {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response?.data
              ?.message || "Something went wrong!";
          message.error(errorMessage);
        }
      };
  return (
    <div className="auth-container">
      <h2 className="form-title">Time Management System</h2>
      <Form
        name="login-form"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 17 }}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ type: "email",  required: true}]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox>Remember me</Checkbox>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
