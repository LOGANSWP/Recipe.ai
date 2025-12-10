import { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { Space } from "antd";

import { getRecommendationListRandom } from "../../api/planningApi";

const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm 
    transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <img src={recommendation.img} className="w-full h-36 object-cover" />

      <div className="p-2">
        <p className="font-semibold">
          {recommendation.title}
        </p>

        <div className="flex flex-wrap gap-1 mt-1">
          {recommendation.tags.map((tag) => (
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
    fetchRecommendationListRandom();
  }, []);

  const fetchRecommendationListRandom = async () => {
    try {
      const res = await getRecommendationListRandom(2);
      const { data } = res;
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshOnClick = () => {
    fetchRecommendationListRandom();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-full">
      <h2 className="text-2xl font-semibold text-green-700">
        AI Recommendation
      </h2>

      <Space size="middle">
        <p className="text-sm text-gray-500">
          Refresh recommendations
        </p>

        <IoMdRefresh className="text-gray-500 hover:text-green-700" onClick={handleRefreshOnClick} />
      </Space>

      <div className="grid grid-cols-2 gap-4">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation._id}
            recommendation={recommendation}
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
