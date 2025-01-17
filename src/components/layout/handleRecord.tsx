import React, { useState } from "react";
import { DatePicker, Button, Modal, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import type { TimeRangePickerProps } from "antd";

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

const HandleRecord: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    if (dates) {
      console.log("From: ", dates[0], ", to: ", dates[1]);
      console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    } else {
      console.log("Clear");
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <RangePicker presets={rangePresets} onChange={onRangeChange} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create
        </Button>
        <Modal
          title="Add Record"
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form
            name="record-form"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            autoComplete="off"
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Hour(s)"
              name="hours"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
export default HandleRecord;
