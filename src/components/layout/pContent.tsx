import React from "react";
import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import HandleRecord from "./handleRecord";

const PContent: React.FC = () => {
  return (
    <>
      <HandleRecord />
      <Table
        bordered
        dataSource={[
          {
            key: "1",
            description: "Store Name",
            hours: "3",
            date: "2023-05-01",
          },
        ]}
        columns={[
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          { title: "Date", dataIndex: "date", key: "date" },
          {
            title: "Hour(s)",
            dataIndex: "hours",
            key: "hours",
          },
          {
            title: "Actions",
            key: "actions",
            render: () => (
              <div>
                <Button type="link" icon={<EditOutlined />}>
                  Edit
                </Button>
                <Button type="link" icon={<DeleteOutlined />} danger>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default PContent;
