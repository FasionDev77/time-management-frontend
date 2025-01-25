import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  message,
  Modal,
  Form,
  Popconfirm,
} from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useAppContext } from "../context/App.Context";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  MailOutlined,
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { RegisterValuesInterface } from "../types/auth.types/register.values.interface";
import { MESSAGES } from "../constants/messages";

interface User {
  _id: string;
  name: string;
  email: string;
  preferedHours: number;
  role: string;
}

const Users: React.FC = () => {
  const [form] = Form.useForm();
  const { userInfo } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const startEditing = (user: User) => {
    setEditingUserId(user._id);
    setEditedUser(user);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const saveChanges = async (userId: string) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, editedUser);
      message.success(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...editedUser } : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error("Error saving changes:", error);
      message.error("Failed to save changes.");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      message.success(MESSAGES.USER_DELETE_SUCCESS);
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
  };

  const validatePassword = (_rule: unknown, value: string) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!value) {
      return Promise.reject(new Error("Password is required!"));
    }
    if (!passwordRegex.test(value)) {
      return Promise.reject(new Error(MESSAGES.INVALID_PASSWORD));
    }
    return Promise.resolve();
  };

  const confirmPasswordValidator = (
    getFieldValue: (field: string) => Promise<string>
  ) => ({
    validator: async (_: unknown, value: string) => {
      if (!value) {
        return Promise.reject(new Error(MESSAGES.REQUIRED_PASSWORD));
      }
      const password = await getFieldValue("password");
      if (value !== password) {
        return Promise.reject(new Error(MESSAGES.PASSWORD_MISMATCH));
      }
      return Promise.resolve();
    },
  });

  const handleSubmit = async (values: RegisterValuesInterface) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email: values.email,
        name: values.name,
        password: values.password,
      });
      form.resetFields();
      setUsers((prevUsers) => [...prevUsers, response.data.user]);
      message.success(MESSAGES.USER_CREATED);
      setIsModalOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong!";
      message.error(errorMessage);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (text: string, record: User, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, user: User) =>
        editingUserId === user._id ? (
          <Input
            value={editedUser.name ?? user.name}
            onChange={(e) =>
              setEditedUser((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Preferred Hours",
      dataIndex: "preferedHours",
      key: "preferedHours",
      render: (text: number, user: User) =>
        editingUserId === user._id ? (
          <Input
            min={1}
            type="number"
            value={
              editedUser.preferedHours !== undefined
                ? editedUser.preferedHours
                : user.preferedHours
            }
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0 && value < 17) {
                setEditedUser((prev) => ({
                  ...prev,
                  preferedHours: value,
                }));
              } else {
                message.error("Preferred working hours must be less than 17.");
              }
            }}
          />
        ) : (
          text
        ),
    },
    ...(userInfo?.role === "admin" || userInfo?.role === "user_manager"
      ? [
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string, user: User) => {
              const roleMapping: { [key: string]: string } = {
                user: "User",
                user_manager: "User Manager",
                admin: "Admin",
              };

              const roleOptions =
                userInfo?.role === "admin"
                  ? [
                      { value: "user", label: "User" },
                      { value: "user_manager", label: "User Manager" },
                      { value: "admin", label: "Admin" },
                    ]
                  : [
                      { value: "user", label: "User" },
                      { value: "user_manager", label: "User Manager" },
                    ];

              if (editingUserId === user._id) {
                return (
                  <Select
                    value={editedUser.role || user.role}
                    onChange={(value) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        role: value,
                      }))
                    }
                    style={{ width: 150 }}
                  >
                    {roleOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                );
              }

              return roleMapping[role] || role;
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      render: (user: User) =>
        editingUserId === user._id ? (
          <div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => saveChanges(user._id)}
            ></Button>
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              onClick={cancelEditing}
              style={{ marginLeft: 8 }}
            ></Button>
          </div>
        ) : (
          <>
            <Button
              className="mr-7"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => startEditing(user)}
            />
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(user._id)}
            >
              <Button
                type="primary"
                danger
                // onClick={() => handleDelete(user._id)}
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </>
        ),
    },
  ];

  return (
    <div>
      <div className="item-display-center">
        <h2>User Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create User
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users.map((user) => ({ ...user, key: user._id }))}
        pagination={false}
        bordered
      />
      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="register-form"
          onFinish={handleSubmit}
          validateMessages={validateMessages}
          initialValues={{
            email: "",
            name: "",
            password: "",
            confirm: "",
          }}
        >
          <Form.Item
            name="email"
            rules={[{ type: "email" }, { required: true }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ validator: validatePassword }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              ({ getFieldValue }) => confirmPasswordValidator(getFieldValue),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item label={null}>
            <Button
              className="mt-10"
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              block
            >
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
