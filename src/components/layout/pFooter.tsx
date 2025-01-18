import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;

const PFooter: React.FC = () => {
    return (
        <Footer
          className='text-center'
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} Time Management System. Created with
            FasionDev77.
          </Typography.Text>
        </Footer>
    );
};

export default PFooter;