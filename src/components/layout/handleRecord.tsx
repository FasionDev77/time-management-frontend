import React, { useEffect } from "react";
import dayjs from "dayjs";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import { DatePicker, Button, Form, Input, InputNumber, message } from "antd";

import axiosInstance from "../../utils/axiosInstance";

import type { Dayjs } from "dayjs";

import type { TimeRangePickerProps } from "antd";
import type { DatePickerProps } from "antd";
import { RecordValuesInterface } from "../../types/record.values.interface";
import { RecordDataInterface } from "../../types/record.data.interface";
import { useAppContext } from "../../context/App.Context";

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

const HandleRecord: React.FC = () => {
  const [form] = Form.useForm();
  const defaultRange: [Dayjs, Dayjs] = [dayjs(), dayjs()];
  const { userInfo } = useAppContext();
  const today = dayjs().format("YYYY-MM-DD");
  const { setUserRecords } = useAppContext();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const result = await axiosInstance.get(
          `/records/filter/?from=${today}&to=${today}`
        );
        console.log(result.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, [today]);

  const onRangeChange = async (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    if (dates) {
      try {
        const records = await axiosInstance.get(
          `/records/filter/?from=${dateStrings[0]}&to=${dateStrings[1]}`
        );
        if (records.data.length > 0) {
          setUserRecords(records.data);
        } else {
          setUserRecords([]);
        }
      } catch {
        message.error("Error fetching records");
      }
    } else {
      console.log("Clear");
    }
  };

  const handleCreate = async (values: RecordValuesInterface) => {
    try {
      const payload = {
        description: values.description,
        date: values.date.format("YYYY-MM-DD"),
        duration: values.duration,
      };

      const response = await axiosInstance.post("/records", payload);
      setUserRecords((prevRecords: RecordDataInterface[]) => [
        response.data.record,
        ...prevRecords,
      ]);
      form.resetFields();
      message.success(response.data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(
          (error as Error & { response?: { data?: { message?: string } } })
            .response?.data?.message
        );
      } else {
        message.error("An unknown error occurred");
      }
    }
  };

  const searchDate: DatePickerProps["onChange"] = async (date, dateString) => {
    if (date) {
      try {
        const records = await axiosInstance.get(
          `/records/filter/?from=${dateString}&to=${dateString}`,
          {}
        );
        setUserRecords(records.data);
      } catch {
        message.error("Error fetching records");
      }
    } else {
      setUserRecords([]);
    }
  };

  const handleExport = async (userId: string) => {
    console.log("Exporting records for user:", userId);
    try {
      const response = await axiosInstance.get(`/records/export/${userId}`, {
        responseType: "blob", // To handle file download
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `user_${userId}_records.csv`); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting records:", error);
      message.error("Failed to export records.");
    }
  };
  return (
    <div>
      <div className="item-display-center mb-16">
        <div>
          <span>Filter by range : </span>
          <RangePicker
            presets={rangePresets}
            defaultValue={defaultRange}
            onChange={onRangeChange}
          />
        </div>
        <div>
          <span>Filter by date : </span>
          <DatePicker defaultValue={dayjs()} onChange={searchDate} />
        </div>
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
            style={{ width: 500 }}
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
            <Button
              variant="solid"
              color="cyan"
              icon={<PlusOutlined />}
              htmlType="submit"
            >
              Add Record
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              variant="solid"
              color="danger"
              icon={<DownloadOutlined />}
              onClick={() => handleExport(String(userInfo?.id))}
            >
              Export history
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default HandleRecord;
