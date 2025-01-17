import React from 'react';
import { Layout, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const {Header} = Layout

const PHeader: React.FC = () => {
    return (
        <Header
          style={{
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography.Title level={4} className="form-title">
            Time Management System
          </Typography.Title>
          <div>
            <Avatar icon={<UserOutlined />} style={{ marginRight: "8px" }} />
            <Typography.Text>James Sullivan</Typography.Text>
          </div>
        </Header>
    );
};

export default PHeader;