import React from 'react';
import { Layout, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { useAppContext } from '../../context/App.Context';

const {Header} = Layout

const PHeader: React.FC = () => {
  const { userInfo } = useAppContext();

    return (
        <Header
          className='header bg-fff item-display-center'
        >
          <Typography.Title level={4} className="form-title">
            Time Management System
          </Typography.Title>
          <div>
            <Avatar icon={<UserOutlined />} className='mr-7' />
            <Typography.Text>{userInfo?.email}</Typography.Text>
          </div>
        </Header>
    );
};
export default PHeader;