import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, InputNumber, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

import { RegisterValuesInterface } from "../../types/auth.types/register.values.interface";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const validatePassword = (_rule: unknown, value: string) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!value) {
    return Promise.reject(new Error("Password is required!"));
  }
  if (!passwordRegex.test(value)) {
    return Promise.reject(
      new Error(
        "Password must be at least 8 characters long and include at least one number and one special character (!@#$%^&*)."
      )
    );
  }
  return Promise.resolve();
};

const confirmPasswordValidator = (
  getFieldValue: (field: string) => Promise<string>
) => ({
  validator: async (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please confirm your password!"));
    }
    const password = await getFieldValue("password");
    if (value !== password) {
      return Promise.reject(new Error("Passwords do not match!"));
    }
    return Promise.resolve();
  },
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: RegisterValuesInterface) => {
    try {
      // Send a POST request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email: values.email,
          name: values.name,
          password: values.password,
          preferredWorkingHours: values.workingHours,
        }
      );
  
      // Handle success
      message.success(response.data.message || "Registered successfully!");
      navigate('/')
    } catch (error: unknown) {
      // Handle error
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
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        name="register-form"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
        initialValues={{
          workingHours: 8,
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email" }, { required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ validator: validatePassword }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            ({ getFieldValue }) => confirmPasswordValidator(getFieldValue),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="workingHours"
          label="Working Hours"
          rules={[{ type: "number", min: 0, max: 8 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<UserAddOutlined />}
            block
          >
            Register
          </Button>
        </Form.Item>
        <Form.Item label="(">
          <span>
            Already have an account? <Link to="/">Login</Link>
          </span>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;
