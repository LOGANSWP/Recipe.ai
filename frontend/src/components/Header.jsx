import { Link, useNavigate } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaUser, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { message } from "antd";
import { useState, useEffect, useRef } from "react";

import { useAuth } from "../auth/AuthContent";
import { logout } from "../api/authApi";
import { getDefaultAvatar } from "../assets/avatars";

export default function Header() {
  const navigate = useNavigate();
  const { firebaseUser, userData } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutOnClick = async () => {
    try {
      await logout();
      message.success("Logout success");
      setShowDropdown(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    };
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  // Helper function for consistent link styles
  const linkStyles =
    "text-gray-700 font-medium hover:text-green-600 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2";

  return (
    // Use bg-white for a clean look, with a subtle border
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <IoFastFoodOutline className="h-6 w-6 text-orange-400 group-hover:animate-pulse" />
          <h1 className="font-bold text-xl sm:text-2xl flex">
            <span className="text-gray-800">Recipe</span>
            <span className="text-green-600">.ai</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-4 sm:gap-6 items-center">
          <Link to="/">
            <li className={`hidden sm:inline ${linkStyles}`}>Home</li>
          </Link>
          <Link to="/inventory">
            <li className={`hidden sm:inline ${linkStyles}`}>Inventory</li>
          </Link>
          <Link to="/planning">
            <li className={`hidden sm:inline ${linkStyles}`}>Planning</li>
          </Link>

          {/* User Avatar Dropdown (when logged in) */}
          {firebaseUser !== null && userData && (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-full"
              >
                <img
                  src={userData.avatar || getDefaultAvatar(userData.name)}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-green-500 hover:border-green-600 transition-all"
                />
                <FaChevronDown
                  className={`text-gray-600 text-sm transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <FaUser className="text-green-600" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={handleLogoutOnClick}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </li>
          )}

          {/* Login/Register buttons (when not logged in) */}
          {firebaseUser === null && (
            <Link to="/login">
              <li
                className="font-medium px-4 py-2 rounded-full border-2 border-orange-300
                         hover:bg-orange-300 transition-colors duration-200"
              >
                Login
              </li>
            </Link>
          )}
          {firebaseUser === null && (
            <Link to="/register">
              <li
                className="font-medium px-4 py-2 rounded-full border-2 border-green-300
                         hover:bg-green-300 transition-colors duration-200"
              >
                Register
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
