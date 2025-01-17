import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";

import PSiderbar from "../components/layout/pSiderbar";
import PHeader from "../components/layout/pHeader";
import PContent from "../components/layout/pContent";
import PFooter from "../components/layout/pFooter";
import Profile from "./Profile";

const LandingPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PSiderbar />
      <Layout>
        <PHeader />
        <Routes>
            <Route path="/" element={<PContent />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        <PFooter/>
      </Layout>
    </Layout>
  );
};

export default LandingPage;
