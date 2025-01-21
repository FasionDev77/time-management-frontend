import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, message } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { useAppContext } from "../context/App.Context";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";

interface User {
  _id: string;
  name: string;
  email: string;
  preferedHours: number;
  role: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { userInfo } = useAppContext();

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
    setEditedUser(user); // Populate the editedUser state with the user's data
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const saveChanges = async (userId: string) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, editedUser);
      message.success(response.data.message);

      // Update the local state with the new data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...editedUser } : user
        )
      );
      setEditingUserId(null); // Exit editing mode
    } catch (error) {
      console.error("Error saving changes:", error);
      message.error("Failed to save changes.");
    }
  };

  const handleDelete = async (userId: string) => {
    console.log("Deleting user with ID:", userId);
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const columns = [
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
      render: (text: string, user: User) =>
        editingUserId === user._id ? (
          <Input
            value={editedUser.email || ""}
            onChange={(e) =>
              setEditedUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Preferred Hours",
      dataIndex: "preferedHours",
      key: "preferedHours",
      render: (text: number, user: User) =>
        editingUserId === user._id ? (
          <Input
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
    ...(userInfo?.role === "admin"
      ? [
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string, user: User) => {
              const roleMapping: { [key: string]: string } = {
                user: "User",
                user_manager: "User Manager",
              };
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
                    style={{ width: 120 }}
                  >
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="user_manager">
                      User Manager
                    </Select.Option>
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
              icon={<CloseSquareOutlined />}
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
            <Button
              type="primary"
              danger
              onClick={() => handleDelete(user._id)}
              icon={<DeleteOutlined />}
            />
          </>
        ),
    },
  ];

  return (
    <div>
      <h2>User Management</h2>
      <Table
        columns={columns}
        dataSource={users.map((user) => ({ ...user, key: user._id }))}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default UsersPage;
