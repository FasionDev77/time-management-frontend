import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Form, Table, Typography, message, DatePicker } from "antd";

// import { useAppContext } from "../../context/App.Context";
import axiosInstance from "../../utils/axiosInstance";
import HandleRecord from "./handleRecord";
import EditableCell from "../editableCells";
import { RecordDataInterface } from "../../types/record.data.interface";

const RecordTable: React.FC = () => {
  const [form] = Form.useForm();
  // const [rangeRecords, setRangeRecords] = useState<RecordDataInterface[]>([]);
  // const { userInfo } = useAppContext();
  const [records, setRecords] = useState<RecordDataInterface[]>([]);
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
  }, [today]);

  const originData = records.map((record, index) => ({
    key: index.toString(),
    _id: record._id,
    date: dayjs(record.date).format("YYYY-MM-DD"),
    duration: record.duration || 8,
    description: record.description || "",
  }));

  const [data, setData] = useState<RecordDataInterface[]>(originData);
  const [editingKey, setEditingKey] = useState<string>("");

  const isEditing = (record: RecordDataInterface) => record.key === editingKey;

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
      const newData = [...records];
      const index = newData.findIndex((item, idx) => Number(key) === idx);
      if (index > -1) {
        const updatedRecord = { ...newData[index], ...row };
        const response = await axiosInstance.put(
          `/records/${updatedRecord._id}`,
          updatedRecord
        );
        newData[index] = updatedRecord;
        setData(newData);
        setEditingKey("");
        message.success("Record updated successfully");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/records/${id}`);
      const updatedData = data.filter((item) => item._id !== id);
      setData(updatedData);
      message.success("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
      inputType: "date",
      render: (_: unknown, record: RecordDataInterface) =>
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
      render: (_: unknown, record: RecordDataInterface) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              icon={<SaveOutlined />}
            />
            <Button type="link" icon={<CloseOutlined />} />
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
                onClick={() => handleDelete(record._id)}
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
      onCell: (record: RecordDataInterface) => ({
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
