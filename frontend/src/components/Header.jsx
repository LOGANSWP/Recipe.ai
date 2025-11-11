import { Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";

export default function Header() {
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
          <Link to="/about">
            <li className={`hidden sm:inline ${linkStyles}`}>About</li>
          </Link>
          <Link to="/inventory">
            <li className={`hidden sm:inline ${linkStyles}`}>Inventory</li>
          </Link>
          <Link to="/planning">
            <li className={`hidden sm:inline ${linkStyles}`}>Planning</li>
          </Link>

          {/* Profile link styled as a button */}
          <Link to="/profile">
            <li
              className="text-white font-medium bg-green-600 px-4 py-2 rounded-full 
                         hover:bg-green-700 transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              Profile
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
