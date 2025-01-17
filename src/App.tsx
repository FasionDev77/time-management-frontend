import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Landing from "./pages/landing/Landing";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" Component={Landing}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;