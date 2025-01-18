import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useAppContext } from "../../context/App.Context";

const { Sider } = Layout;

const PSiderbar: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAppContext();

  const handleMenuClick = (key: string) => {
    if (key === "1") {
      navigate("/dashboard");
    } else if (key === "2") {
      navigate("/dashboard/profile");
    } else if (key === "3") {
      navigate("/"); // Implement logout logic here
      logout();
    }
  };

  return (
    <Sider
      style={{
        backgroundColor: "#f9fafb",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography.Title level={4} className="text-center mb-3">
        {userInfo?.name}
      </Typography.Title>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        onClick={(e) => handleMenuClick(e.key)}
        items={[
          { key: "1", label: "Dashboard", icon: <DashboardOutlined /> },
          { key: "2", label: "Profile", icon: <UserOutlined /> },
          {
            key: "3",
            label: "Logout",
            icon: <LogoutOutlined onClick={logout} />,
          },
        ]}
      />
    </Sider>
  );
};

export default PSiderbar;
