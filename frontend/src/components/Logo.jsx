import { Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <IoFastFoodOutline className="h-6 w-6 text-orange-400 group-hover:animate-pulse" />
      <h1 className="font-bold text-xl sm:text-2xl flex">
        <span className="text-gray-800">Recipe</span>
        <span className="text-green-600">.ai</span>
      </h1>
    </Link>
  );
}
