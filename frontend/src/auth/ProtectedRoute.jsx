import { Navigate } from "react-router-dom";
import { Spin } from "antd";

import { useAuth } from "./AuthContent";

const ProtectedRoute = ({ children }) => {
  const { firebaseUser } = useAuth();
  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
