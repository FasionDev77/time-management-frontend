import React from "react";
import { Layout, Avatar, Dropdown, Typography } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";

import { useAppContext } from "../../context/App.Context";
import { Link, useNavigate } from "react-router-dom";

const { Header } = Layout;

const PHeader: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const items: MenuProps["items"] = [
    ...(userInfo?.role === "admin" || userInfo?.role === "user_manager"
      ? [
          {
            key: "1",
            label: (
              <Link
                to={
                  userInfo.role === "admin"
                    ? "/dashboard/admin"
                    : "/dashboard/user-management"
                }
              >
                <span>Users</span>
              </Link>
            ),
            icon: <UserOutlined />,
          },
        ]
      : []),
    {
      key: "2",
      label: (
        <Link to="/dashboard">
          <span>Dashboard</span>
        </Link>
      ),
      icon: <DashboardOutlined />,
    },
    {
      key: "3",
      label: (
        <Link to="/dashboard/profile">
          <span>My Profile</span>
        </Link>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "4",
      label: (
        <span className="color-red" onClick={handleLogout}>
          Log out
        </span>
      ),
      icon: <LogoutOutlined className="color-red" />,
    },
  ];

  return (
    <Header className="header bg-fff item-display-center">
      <Typography.Title level={4} className="form-title cursor-pointer">
        Time Management System
      </Typography.Title>
      <div>
        <Dropdown placement="bottomLeft" menu={{ items }} arrow>
          <Avatar icon={<UserOutlined />} className="mr-7" />
        </Dropdown>
        <Typography.Text>{userInfo?.name}</Typography.Text>
      </div>
    </Header>
  );
};
export default PHeader;
