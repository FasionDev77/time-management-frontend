import { Form, Input, Button, Row, Col, Card, Typography, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useAppContext } from "../context/App.Context";
import axiosInstance from "../utils/axiosInstance";
import { MESSAGES } from "../constants/messages";
import { useEffect } from "react";

const Profile = () => {
  const [form] = Form.useForm();
  const { userInfo, setUserInfo } = useAppContext();

  const handleSave = async (values: {
    name: string;
    email: string;
    preferedHours: number;
  }) => {
    try {
      const response = await axiosInstance.put(
        `/users/${userInfo?.id}`,
        values
      );
      setUserInfo(response.data.updatedUser);
      message.success(response.data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(`Failed to update profile: ${error.message}`);
      } else {
        message.error("Failed to update profile.");
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      name: userInfo?.name,
      email: userInfo?.email,
      preferedHours: userInfo?.preferedHours,
    });
  }, [userInfo]);
  const validatePassword = (_rule: unknown, value: string) => {
    console.log("value", value);
    if (value === undefined) {
      return Promise.resolve();
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(value)) {
      return Promise.reject(new Error(MESSAGES.INVALID_PASSWORD));
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        padding: "50px",
      }}
    >
      <Row justify="center" align="middle">
        <Col xs={24} sm={20} md={12} lg={8}>
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              padding: "30px",
              textAlign: "center",
              border: "1px solid #e3f2fd",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Typography.Title level={3}>My Profile</Typography.Title>
            </div>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: `${userInfo?.name}`,
                email: `${userInfo?.email}`,
                preferedHours: userInfo?.preferedHours,
              }}
              onFinish={handleSave}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #bbdefb",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #bbdefb",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ validator: validatePassword }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #bbdefb",
                  }}
                />
              </Form.Item>
              <Row gutter={60} justify={"space-between"}>
                <Col>
                  <Form.Item
                    label="Prefered Working hours"
                    className="width-100"
                    name="preferedHours"
                    rules={[
                      { required: true, message: "Please enter working hours" },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{
                        borderRadius: 10,
                        border: "1px solid #bbdefb",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Form.Item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      marginRight: 30,
                      width: 150,
                      border: "none",
                    }}
                    icon={<SaveOutlined />}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
