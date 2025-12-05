import {
  useEffect,
  useState,
} from "react";

import { getRecommendationList } from "../../api/planningApi";

const RecommendationCard = ({ item }) => {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm 
    transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <img src={item.img} className="w-full h-36 object-cover" />

      <div className="p-2">
        <p className="font-semibold">
          {item.title}
        </p>

        <div className="flex flex-wrap gap-1 mt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const AIRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchRecommendationList();
  }, []);

  const fetchRecommendationList = async () => {
    try {
      const res = await getRecommendationList();
      const { data } = res;
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-full">
      <h2 className="text-2xl font-semibold text-green-700">
        AI Recommendation
      </h2>

      <p className="text-sm text-gray-500">
        Updated twice a day
      </p>

      <div className="grid grid-cols-2 gap-4">
        {recommendations.map((item) => (
          <RecommendationCard
            key={item.id}
            item={item}
          />
        ))}
      </div>

      {recommendations.length === 0 && (
        <p className="text-center text-gray-500">
          No recommendations found.
        </p>
      )}
    </div>
  );
};

export default AIRecommendation;
