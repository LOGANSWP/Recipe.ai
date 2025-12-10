import { Link, useLocation } from "react-router-dom";
import { FaBoxOpen, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function Footer() {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
        <Link 
          to="/inventory" 
          className={`flex flex-col items-center w-full h-full justify-center transition-colors duration-200 ${
            isActive('/inventory') ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
          }`}
        >
          <FaBoxOpen className="text-2xl mb-1" />
          <span className="text-xs font-medium">Inventory</span>
        </Link>
        
        <Link 
          to="/planning" 
          className={`flex flex-col items-center w-full h-full justify-center transition-colors duration-200 ${
            isActive('/planning') ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
          }`}
        >
          <FaCalendarAlt className="text-2xl mb-1" />
          <span className="text-xs font-medium">Recipes</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center w-full h-full justify-center transition-colors duration-200 ${
            isActive('/profile') ? 'text-green-600' : 'text-gray-500 hover:text-green-500'
          }`}
        >
          <FaUser className="text-2xl mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </footer>
  );
}
