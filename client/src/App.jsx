import { Routes, Route } from "react-router-dom";

import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import Users from "./Pages/Users";
import ImportUsers from "./Pages/ImportUsers";

import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Routes>
      
      {/* 🔓 Public */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 🔐 Protected Layout */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="import-users" element={<ImportUsers />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;