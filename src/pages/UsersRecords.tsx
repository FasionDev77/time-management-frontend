import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  message,
  DatePicker,
  Input,
  Modal,
  InputNumber,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import axiosInstance from "../utils/axiosInstance";
import { UsersRecordsInterface } from "../types/users.records.interface";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditableCell from "../components/editableCells";

const validateMessages = {
  required: "${name} is required!",
  types: {
    email: "${name} is not a valid email!",
    number: "${name} is not a valid number!",
  },
};

const UsersRecords: React.FC = () => {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<UsersRecordsInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const isEditing = (record: UsersRecordsInterface) =>
    record.key === editingKey;

  const deleteRecord = async (id: string) => {
    try {
      await axiosInstance.delete(`/records/${id}`);
      setRecords((prevRecords) =>
        prevRecords.filter((record: UsersRecordsInterface) => record._id !== id)
      );
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const originData = useMemo(
    () =>
      records.map((record: UsersRecordsInterface, index) => ({
        key: index.toString(),
        _id: record._id,
        date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
        duration: record.duration || 8,
        description: record.description || "",
        userName: record.userId?.name || "",
      })),
    [records]
  );

  const edit = (
    record: Partial<UsersRecordsInterface> & { key: React.Key }
  ) => {
    form.setFieldsValue({
      date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
      userName: record.userId?.name ?? "",
      description: "",
      duration: "",
      ...record,
    });
    console.log(record);
    setEditingKey(record.key as string);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as UsersRecordsInterface;
      const newData = [...records];
      const index = newData.findIndex(
        (item: UsersRecordsInterface) => key === item._id
      );
      if (index > -1) {
        const updatedRecord = {
          ...newData[index],
          ...row,
        } as UsersRecordsInterface;
        const response = await axiosInstance.put(
          `/records/${updatedRecord._id}`,
          updatedRecord
        );
        handleRecordUpdate(response.data.updatedRecord);
        setEditingKey("");
        message.success(response.data.message);
      }
    } catch (errInfo: unknown) {
      const errorMessage =
        errInfo instanceof Error
          ? errInfo.message
          : "An unknown error occurred";
      message.error("Failed to update record: " + errorMessage);
    }
  };

  const handleRecordUpdate = (updatedRecord: UsersRecordsInterface) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record._id === updatedRecord._id ? updatedRecord : record
      )
    );
  };

  const createRecord = async (values: {
    email: string;
    date: string | { format: (format: string) => string };
    duration: number;
    description: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        `/records/admin-record-create/${values.email}`,
        {
          email: values.email,
          date:
            typeof values.date === "string"
              ? values.date
              : values.date.format("YYYY-MM-DD"),
          description: values.description,
          duration: values.duration,
        }
      );
      console.log(response, "response");
      setRecords((prevRecords) => [response.data.record, ...prevRecords]);
      form.resetFields();
      setIsModalOpen(false);
      message.success(response.data.message);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong!";
      message.error(errorMessage);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get("/records/all-records");
        setRecords(result.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchData();
  }, []);

  const paginationConfig = {
    current: currentPage,
    pageSize: 8,
    total: UsersRecords.length,
    onChange: (page: number) => setCurrentPage(page),
  };

  const calculateIndex = (current: number, pageSize: number, index: number) =>
    (current - 1) * pageSize + index + 1;

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (text: string, record: UsersRecordsInterface, index: number) =>
        calculateIndex(currentPage, paginationConfig.pageSize, index),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
      inputType: "date",
      render: (date: string) => new Date(date).toISOString().substring(0, 10),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      // editable: true,
      inputType: "text",
      render: (userName: string) => userName || "No user assigned",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      inputType: "text",
    },
    {
      title: "Hour(s)",
      dataIndex: "duration",
      key: "duration",
      editable: true,
      inputType: "number",
    },
    {
      title: "Operation",
      key: "operation",
      render: (_: unknown, record: UsersRecordsInterface) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              className="mr-7"
              type="primary"
              onClick={() => save(record._id)}
              icon={<SaveOutlined />}
            />
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              onClick={() => setEditingKey("")}
            />
          </span>
        ) : (
          <>
            <Button
              type="primary"
              className="mr-7"
              icon={<EditOutlined />}
              disabled={editingKey !== ""}
              onClick={() => {
                edit(record);
              }}
            ></Button>
            <Popconfirm
              title="Are you sure to delete this record?"
              onConfirm={() => {
                deleteRecord(record._id);
              }}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = useMemo(
    () =>
      columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: UsersRecordsInterface) => ({
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
      <div className="item-display-center">
        <h2>User Records</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Record
        </Button>
      </div>{" "}
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
          rowKey={(record: UsersRecordsInterface) => record._id}
          pagination={paginationConfig}
        />
      </Form>
      <Modal
        title="Create Record"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          name="register-form"
          onFinish={createRecord}
          validateMessages={validateMessages}
          initialValues={{
            email: "",
            desscription: "",
            date: dayjs(),
            duration: 1,
          }}
        >
          <Form.Item
            name="email"
            rules={[{ type: "email" }, { required: true }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true }]}>
            <Input placeholder="Desccription" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" rules={[{ required: true }]}>
                <InputNumber
                  placeholder="Working Hours"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={null}>
            <Button
              className="mt-10"
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              block
            >
              Create record
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UsersRecords;
