import React, { useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, message } from "antd";

import { useAppContext } from "../context/App.Context";
import axiosInstance from "../api/axiosInstance";

interface DataType {
  key: string;
  name: string;
  email: string;
  preferedHours: number;
}

const EditableCell: React.FC<{
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  record: DataType;
  children: React.ReactNode;
}> = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
            ...(dataIndex === "email"
              ? [
                  {
                    type: "email" as const,
                    message: "Please enter a valid email!",
                  },
                ]
              : []),
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const { userInfo } = useAppContext();

  const originData: DataType[] = [
    {
      key: "1",
      name: `${userInfo?.name}`,
      email: `${userInfo?.email}`,
      preferedHours: Number(userInfo?.preferedHours) || 8,
    },
  ];

  const [data, setData] = useState<DataType[]>(originData);
  const [editingKey, setEditingKey] = useState<string>("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({
      name: "",
      email: "",
      preferedHours: "",
      description: "",
      ...record,
    });
    setEditingKey(record.key as string);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const updatedUser = {
          email: row.email,
          name: row.name,
          preferedHours: row.preferedHours,
        };
        console.log("updatedUser", updatedUser, userInfo?.id);
        const response = await axiosInstance.put(
          `/users/${userInfo?.id}`,
          updatedUser
        );
        message.success("Profile updated successfully");
        const item = { ...newData[index], ...updatedUser };
        newData.splice(index, 1, item);
        setData(newData);
        console.log("response", response);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      inputType: "text",
    },
    {
      title: "Email",
      dataIndex: "email",
      editable: true,
      inputType: "text",
    },
    {
      title: "Prefered working hours",
      dataIndex: "preferedHours",
      editable: true,
      inputType: "number", // Restrict input to numbers
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: unknown, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false} // Single row does not need pagination
      />
    </Form>
  );
};
export default Profile;
