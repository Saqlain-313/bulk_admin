import { Link, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../redux/slices/authSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/admin/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>

          <Link to="/admin/users" className="hover:text-blue-400">
            Users
          </Link>

          <Link to="/admin/import-users" className="hover:text-blue-400">
            Import Users
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        
        {/* Topbar */}
        <div className="bg-white p-4 flex justify-between shadow">
          <h1 className="font-semibold">Admin</h1>

          <button
            onClick={() => dispatch(logoutAdmin())}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;