import React from "react";
import { Layout, Button, Table } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;

const PContent: React.FC = () => {
  return (
    <Content
      className="content-section"
      style={{ margin: "16px", backgroundColor: "#fff", padding: "16px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Button type="primary" icon={<PlusOutlined />}>
          Create
        </Button>
      </div>

      {/* Table */}
      <Table
        bordered
        dataSource={[
          {
            key: "1",
            description: "Store Name",
            duration: "3",
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
            title: "Duration / hr",
            dataIndex: "duration",
            key: "duration",
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
