import React from "react";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { DatePicker, Button, Form, Input, InputNumber, message } from "antd";

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
      form.resetFields();
      message.success(response.data.message || "Record created successfully");
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

  return (
    <div>
      <div className="item-display-center mb-16">
        <RangePicker presets={rangePresets} onChange={onRangeChange} />
        <Form
        form={form}
          layout="inline"
          variant="filled"
          name="record-form"
          autoComplete="off"
          onFinish={handleCreate}
          initialValues={{
            date: dayjs(),
            description: "",
            duration: 1,
          }}
        >
          <Form.Item label="Date" name="date">
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            style={{width: 700}}
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
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default HandleRecord;
