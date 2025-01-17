import React from "react";
import { Layout, Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import HandleRecord from "./handleRecord";

const { Content } = Layout;

const PContent: React.FC = () => {
  return (
    <Content
      className="content-section"
      style={{ margin: "16px", backgroundColor: "#fff", padding: "16px" }}
    >
      <HandleRecord />
      {/* Table */}
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
    </Content>
  );
};

export default PContent;
