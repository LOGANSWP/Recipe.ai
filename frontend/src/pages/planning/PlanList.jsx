import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PlanCard = ({ item }) => {
  const navigate = useNavigate();

  const handleViewOnClick = (planId) => {
    navigate(`/planning/plan?id=${planId}`);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col h-full
    transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <p className="font-semibold">{item.title}</p>

      <div className="flex flex-wrap mt-2 gap-1">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Created at: {item.createdAt}
      </p>

      <button
        className="mt-auto self-end bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
        onClick={() => handleViewOnClick(item._id)}
      >
        View / Edit
      </button>
    </div>
  );
};

const PlanList = ({ plans, searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-green-700">
          History Plans
        </h2>

        <div className="relative w-64">
          <input
            type="search"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <PlanCard key={plan._id} item={plan} />
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-gray-500 py-10">
          No plan found.
        </p>
      )}
    </div>
  );
};

export default PlanList;
