import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import Landing from "./pages/Landing";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem("authToken");
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
