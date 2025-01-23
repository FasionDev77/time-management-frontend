import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Form, Table, Typography, message } from "antd";

// import { useAppContext } from "../../context/App.Context";
import axiosInstance from "../../utils/axiosInstance";
import HandleRecord from "./handleRecord";
import EditableCell from "../editableCells";
import { RecordDataInterface } from "../../types/record.data.interface";
import { useAppContext } from "../../context/App.Context";
import { TableColumn } from "../../types/table.column.interface";

const RecordTable: React.FC = () => {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<RecordDataInterface[]>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const { userInfo } = useAppContext();
  // const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const result = await axiosInstance.get<RecordDataInterface[]>(
          `/records/filter`
        );
        const groupedData = result.data.reduce<
          Record<string, { totalHours: number; records: RecordDataInterface[] }>
        >(
          (
            acc: Record<
              string,
              { totalHours: number; records: RecordDataInterface[] }
            >,
            record: RecordDataInterface
          ) => {
            const date = record.date;
            if (!acc[date]) {
              acc[date] = { totalHours: 0, records: [] };
            }
            acc[date].totalHours += record.duration;
            acc[date].records.push(record);
            return acc;
          },
          {}
        );

        // Map total hours back to each record
        const updatedRecords = result.data.map((record) => ({
          ...record,
          totalHours: groupedData[record.date]?.totalHours || 0,
        }));

        setRecords(updatedRecords);

        if (result.status === 404) {
          message.info("No records found");
        }
      } catch (error: unknown) {
        console.error(error);
        message.error("Failed to fetch records");
        setRecords([]);
      }
    };
    fetchRecords();
  }, []);

  const handleRecordUpdate = (updatedRecord: RecordDataInterface) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record._id === updatedRecord._id ? updatedRecord : record
      )
    );
  };

  const originData = useMemo(
    () =>
      records.map((record, index) => ({
        key: index.toString(),
        _id: record._id,
        date: record.date.substr(0, 10),
        duration: record.duration || 8,
        description: record.description || "",
      })),
    [records]
  );

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

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/records/${id}`);
      setRecords((prevRecords) =>
        prevRecords.filter((item) => item._id !== id)
      );
      message.success("Record deleted successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      message.error(`Failed to delete record: ${errorMessage}`);
    }
  };
  const columns: TableColumn[] = [
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
                onClick={() => handleDelete(record._id)}
              />
            </Typography.Link>
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
          rowClassName={(record) => {
            const sameDateRecords = records.filter(
              (item) => item.date.substring(0, 10) === record.date
            );
            const totalHours = sameDateRecords.reduce(
              (acc, item) => acc + item.duration,
              0
            );
            return totalHours < Number(userInfo?.preferedHours)
              ? "row-red editable-row"
              : "row-green editable-row";
          }}
        />
      </Form>
    </>
  );
};

export default RecordTable;
