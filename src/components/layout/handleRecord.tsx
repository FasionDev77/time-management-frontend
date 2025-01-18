import React, { useState } from "react";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";

import axiosInstance from "../../api/axiosInstance";

import type { Dayjs } from "dayjs";

import type { TimeRangePickerProps } from "antd";
import { RecordValuesInterface } from "../../types/record.values.interface";

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

const HandleRecord: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onRangeChange = async (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    if (dates) {
      try {
        const records = await axiosInstance.get("/records", {
          params: {
            startDate: dateStrings[0],
            endDate: dateStrings[1],
          },
        });
        console.log(records);
      } catch {
        message.error("Error fetching records");
      }
    } else {
      console.log("Clear");
    }
  };

  const handleCreate = async (values: RecordValuesInterface) => {
    try {
      console.log(values);
      const payload = {
        description: values.description,
        date: values.date.format("YYYY-MM-DD"),
        duration: values.duration,
      };

      const response = await axiosInstance.post("/records", payload);
      message.success(response.data.message || "Record created successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(
          (error as Error & { response?: { data?: { message?: string } } })
            .response?.data?.message || "Error creating record"
        );
      } else {
        message.error("An unknown error occurred");
      }
    }
  };

  const handleModalOk = () => {
    form.submit();
  };

  return (
    <div>
      <div className="item-display-center mb-16">
        <RangePicker presets={rangePresets} onChange={onRangeChange} />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create
        </Button>
        <Modal
          title="Add Record"
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            form={form}
            name="record-form"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            autoComplete="off"
            onFinish={handleCreate}
            initialValues={{
              date: dayjs(), // Default date as current date
              duration: 1, // Default duration
            }}
          >
            <Form.Item label="Date" name="date">
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Hour(s)"
              name="duration"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} max={12} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};export default HandleRecord;
