import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Avatar,
  message,
} from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useAppContext } from "../context/App.Context";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const [form] = Form.useForm();
  const { userInfo } = useAppContext();
  const [isDisabled, setIsDisabled] = useState(true);

  const handleEdit = () => setIsDisabled(false);
  const handleCancel = () => setIsDisabled(true);

  const handleSave = async (values: {
    name: string;
    email: string;
    preferedHours: number;
  }) => {
    console.log(values);
    try {
      await axiosInstance.put(`/users/${userInfo?.id}`, values);
      message.success("Profile updated successfully!");
      setIsDisabled(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(`Failed to update profile: ${error.message}`);
      } else {
        message.error("Failed to update profile.");
      }
    }
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
              <Avatar size={100} icon={<UserOutlined />} />
              <Typography.Title
                level={3}
                style={{
                  margin: "15px 0",
                  fontWeight: "bold",
                  background: "linear-gradient(to bottom, #42a5f5, #7986cb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Vidal Connelly
              </Typography.Title>
            </div>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: "Vidal Connelly",
                email: "vidalconnelly37@gmail.com",
                preferedHours: 8,
              }}
              onFinish={handleSave}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  disabled={isDisabled}
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
                  disabled={isDisabled}
                  prefix={<MailOutlined />}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #bbdefb",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Preferred Working hours"
                name="preferedHours"
                rules={[
                  { required: true, message: "Please enter working hours" },
                ]}
              >
                <Input
                  disabled={isDisabled}
                  type="number"
                  style={{
                    borderRadius: 10,
                    border: "1px solid #bbdefb",
                  }}
                />
              </Form.Item>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                {isDisabled ? (
                  <Button
                    onClick={handleEdit}
                    style={{
                      borderRadius: 20,
                      color: "#42a5f5",
                      border: "1px solid #bbdefb",
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        marginRight: 10,
                        borderRadius: 20,
                        border: "none",
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      style={{
                        borderRadius: 20,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
