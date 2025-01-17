import { Layout, Typography } from "antd";
import PSiderbar from "../../components/layout/pSiderbar";
import PHeader from "../../components/layout/pHeader";
import PContent from "../../components/layout/pContent";

const {  Footer } = Layout;

const LandingPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PSiderbar />

      {/* Main Layout */}
      <Layout>
        <PHeader />
        <PContent/>

        {/* Footer */}
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
      </Layout>
    </Layout>
  );
};

export default LandingPage;
