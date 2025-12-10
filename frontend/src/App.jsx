import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";

import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Cook from "./pages/Cook";
import Inventory from "./pages/Inventory";
import Planning from "./pages/planning";
import PlanDisp from "./pages/planning/PlanDisp";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Page401 from "./pages/error/Page401";
import Page403 from "./pages/error/Page403";
import Page404 from "./pages/error/Page404";

import { AuthProvider } from "./auth/AuthContent";
import ProtectedRoute from "./auth/ProtectedRoute";


export default function App() {
  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#4CA154" } }}
    >
      <AuthProvider>
        <BrowserRouter>
          <div className="pb-16">
          <Routes>
            <Route path="/" element={<Navigate to="/planning" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/cook" element={
              <ProtectedRoute>
                <Cook />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/planning" element={
              <ProtectedRoute>
                <Planning />
              </ProtectedRoute>
            } />
            <Route path="/planning/plan" element={
              <ProtectedRoute>
                <PlanDisp />
              </ProtectedRoute>
            } />

            <Route path="/unauthorized" element={<Page401 />} />
            <Route path="/forbidden" element={<Page403 />} />
            <Route path="*" element={<Page404 />} />
          </Routes></div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
};
