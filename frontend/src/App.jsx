import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cook from "./pages/Cook";
import Inventory from "./pages/Inventory";
import Planning from "./pages/planning";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Page401 from "./pages/error/Page401";
import Page403 from "./pages/error/Page403";
import Page404 from "./pages/error/Page404";

import { AuthProvider } from "./auth/AuthContent";
import ProtectedRoute from "./auth/ProtectedRoute";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
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

          <Route path="/unauthorized" element={<Page401 />} />
          <Route path="/forbidden" element={<Page403 />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
