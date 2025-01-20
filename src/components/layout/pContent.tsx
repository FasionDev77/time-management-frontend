import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  message,
  DatePicker,
} from "antd";

// import { useAppContext } from "../../context/App.Context";
import axiosInstance from "../../api/axiosInstance";
import HandleRecord from "./handleRecord";

interface DataType {
  key: string;
  _id: string;
  date: string;
  description: string;
  duration: number;
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

const RecordTable: React.FC = () => {
  const [form] = Form.useForm();
  // const { userInfo } = useAppContext();
  const [records, setRecords] = useState<DataType[]>([]);
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const result = await axiosInstance.get(
          `/records/?from=${today}&to=${today}`
        );
        setRecords(result.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

  const originData = records.map((record, index) => ({
    key: index.toString(),
    _id: record._id,
    date: dayjs(record.date).format("YYYY-MM-DD"),
    duration: record.duration || 8,
    description: record.description || "",
  }));

  const [data, setData] = useState<DataType[]>(originData);
  const [editingKey, setEditingKey] = useState<string>("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({
      date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
      description: "",
      duration: "",
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
      const newData = [...records];
      const index = newData.findIndex((item, idx) => Number(key) === idx);
      if (index > -1) {
        const updatedRecord = { ...newData[index], ...row };
        // Update in the backend
        const response = await axiosInstance.put(
          `/records/${updatedRecord._id}`,
          updatedRecord
        );
        if (response.status === 200) {
          newData[index] = updatedRecord;
          setData(newData);
          setEditingKey("");
          message.success("Record updated successfully");
        } else {
          console.error("Failed to update record:", response.data);
        }
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleRemove = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const newData = [...records];
      const index = newData.findIndex((item, idx) => Number(key) === idx);
      const updatedRecord = { ...newData[index], ...row };
      console.log(updatedRecord, "updatedRecord");
      const response = await axiosInstance.delete(
        `/records/${updatedRecord._id}`
      );
      if (response.status === 200) {
        newData.splice(index, 1);
        setData(newData);
        setEditingKey("");
        message.success("Record deleted successfully");
      } else {
        console.error("Failed to update record:", response.data);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
      inputType: "date",
      render: (_: unknown, record: DataType) =>
        isEditing(record) ? (
          <Form.Item
            name="date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              value={record.date ? dayjs(record.date, "YYYY-MM-DD") : null} // Ensure value is a dayjs object
            />
          </Form.Item>
        ) : (
          record.date
        ),
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
      inputType: "number", // Restrict input to numbers
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: unknown, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              icon={<SaveOutlined />}
            />
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link" icon={<CloseOutlined />} />
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button type="link" icon={<EditOutlined />}></Button>
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ""}>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(record.key)}
              ></Button>
            </Typography.Link>
          </>
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
    <>
      <HandleRecord />
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
          rowClassName="editable-row"
          pagination={false} // Single row does not need pagination
        />
      </Form>
    </>
  );
};
export default RecordTable;
