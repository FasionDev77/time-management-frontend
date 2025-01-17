import React from "react";
import { Layout, Menu, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const PSiderbar: React.FC = () => {
  return (
    <Sider
      style={{
        backgroundColor: "#f9fafb",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography.Title
        level={4}
        style={{
          padding: "16px",
          color: "#3c4048",
          textAlign: "center",
          marginBottom: "0",
        }}
      >
        James Sullivan
      </Typography.Title>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          { key: "1", label: "Dashboard", icon: <UserOutlined /> },
          { key: "2", label: "Settings", icon: <SettingOutlined /> },
          { key: "3", label: "Logout", icon: <LogoutOutlined /> },
        ]}
      />
    </Sider>
  );
};

export default PSiderbar;
