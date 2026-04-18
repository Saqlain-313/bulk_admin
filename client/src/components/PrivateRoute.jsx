import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ Not admin
  if (user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateRoute;