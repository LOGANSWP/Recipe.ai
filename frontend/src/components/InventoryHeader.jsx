import { IoSearchOutline } from "react-icons/io5";
import Logo from "./Logo";

export default function InventoryHeader({ searchTerm, setSearchTerm }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto p-4 gap-4 md:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Inventory</h1>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="search"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
