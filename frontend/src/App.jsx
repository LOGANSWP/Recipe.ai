import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cook from "./pages/Cook";
import Inventory from "./pages/Inventory";
import Planning from "./pages/planning";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cook" element={<Cook />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/planning" element={<Planning />} />
      </Routes>
    </BrowserRouter>
  );
}
