import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserLayout from "./pages/UserLayout";
import Dashboard from "./pages/Dashboard";
import Complaint from "./pages/Complaint";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes with Sidebar Layout */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaint" element={<Complaint />} />
      </Route>

      {/* Admin Route - Usually admin has a different layout or no sidebar */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roleRequired="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;