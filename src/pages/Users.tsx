import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  message,
  Popconfirm,
  Modal,
  Typography,
  Form,
} from "antd";
import axiosInstance from "../utils/axiosInstance";
import dayjs from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseSquareOutlined,
  HistoryOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useAppContext } from "../context/App.Context";
import EditableCell from "../components/editableCells";

import { RecordDataInterface } from "../types/record.data.interface";
import { TableColumn } from "../types/table.column.interface";

interface User {
  _id: string;
  name: string;
  email: string;
  preferedHours: number;
  role: string;
}

const UsersPage: React.FC = () => {
  const [form] = Form.useForm();
  const { userInfo } = useAppContext();

  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [editingKey, setEditingKey] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [userRecords, setUserRecords] = useState<RecordDataInterface[]>([]);

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

  const isEditing = (record: RecordDataInterface) => record.key === editingKey;

  const handleDelete = async (userId: string) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };
  const userRecordDelete = async (recordId: string) => {
    try {
      await axiosInstance.delete(`/records/userRecord/${recordId}`);
      setUserRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== recordId)
      );
      message.success("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const handleShow = async (userId: string) => {
    const userRecords = await axiosInstance(`/records/user/${userId}`);
    setUserRecords(userRecords.data);
    setIsOpen(true);
  };
  const handleRecordUpdate = (updatedRecord: RecordDataInterface) => {
    setUserRecords((prevRecords) =>
      prevRecords.map((record) =>
        record._id === updatedRecord._id ? updatedRecord : record
      )
    );
  };
  const edit = (record: Partial<RecordDataInterface> & { key: React.Key }) => {
    form.setFieldsValue({
      date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
      description: "",
      duration: "",
      ...record,
    });
    setEditingKey(record.key as string);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordDataInterface;
      const newData = [...userRecords];
      const index = newData.findIndex((item, idx) => Number(key) === idx);
      if (index > -1) {
        const updatedRecord = { ...newData[index], ...row };
        const response = await axiosInstance.put(
          `/records/${updatedRecord._id}`,
          updatedRecord
        );
        handleRecordUpdate(response.data);
        setEditingKey("");
        message.success("Record updated successfully");
      }
    } catch (errInfo: unknown) {
      const errorMessage =
        errInfo instanceof Error
          ? errInfo.message
          : "An unknown error occurred";
      message.error("Failed to update record: " + errorMessage);
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
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(user._id)}
            >
              <Button
                type="primary"
                className="mr-7"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
            {userInfo && userInfo.role === "admin" && (
              <Button
                type="primary"
                className="mr-7"
                icon={<HistoryOutlined />}
                onClick={() => handleShow(String(user._id))}
              />
            )}
          </>
        ),
    },
  ];
  const originData = useMemo(
    () =>
      userRecords.map((record, index) => ({
        key: index.toString(),
        _id: record._id,
        date: record.date.substring(0, 10),
        duration: record.duration || 8,
        description: record.description || "",
      })),
    [userRecords]
  );

  const userRecordsColumns: TableColumn[] = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // editable: true,
      inputType: "date",
      // render: (_: unknown, record: RecordDataInterface) =>
      //   isEditing(record) ? (
      //     <Form.Item
      //       name="date"
      //       rules={[{ required: true, message: "Please select a date!" }]}
      //     >
      //       <DatePicker
      //         format="YYYY-MM-DD"
      //         value={record.date ? dayjs(record.date, "YYYY-MM-DD") : null}
      //       />
      //     </Form.Item>
      //   ) : (
      //     record.date
      //   ),
    },
    {
      title: "Description",
      dataIndex: "description",
      editable: true,
      inputType: "text",
    },
    {
      title: "Hour(s)",
      dataIndex: "duration",
      editable: true,
      inputType: "number",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: unknown, record: RecordDataInterface) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              icon={<SaveOutlined />}
            />
            <Button
              type="link"
              icon={<CloseOutlined />}
              onClick={() => setEditingKey("")}
            />
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button type="link" icon={<EditOutlined />} />
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ""}>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => userRecordDelete(record._id)}
              />
            </Typography.Link>
          </>
        );
      },
    },
  ];
  const mergedColumns = useMemo(
    () =>
      userRecordsColumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: RecordDataInterface) => ({
            record,
            inputType: col.inputType,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      }),
    [columns, editingKey]
  );

  return (
    <div>
      <h2>User Management</h2>
      <Table
        columns={columns}
        dataSource={users.map((user) => ({ ...user, key: user._id }))}
        pagination={false}
        bordered
      />
      <Modal
        title={"Records"}
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        closeIcon={null}
      >
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={originData}
            columns={mergedColumns}
            rowClassName={"editable-row"}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
