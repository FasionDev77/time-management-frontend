import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;

const PFooter: React.FC = () => {
    return (
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#f9fafb",
            padding: "20px 16px",
            color: "#3c4048",
            fontSize: "14px",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} Time Management System. Created with
            Fasiondev77.
          </Typography.Text>
        </Footer>
    );
};

export default PFooter;