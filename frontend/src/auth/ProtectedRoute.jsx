import { Navigate } from "react-router-dom";
import { Spin } from "antd";

import { useAuth } from "./AuthContent";

const ProtectedRoute = ({ children }) => {
  const { firebaseUser, isLoadingUser } = useAuth();
  
  // Show loading spinner while checking authentication status
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
