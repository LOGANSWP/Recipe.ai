import {
  useEffect,
  useState,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { Space, notification } from "antd";

import AIRecommendation from "./AIRecommendation";
import CreatePlanForm from "./CreatePlanForm";
import PlanList from "./PlanList";
import { getPlanList, postCreatePlan } from "../../api/planningApi";

const Planning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plans, setPlans] = useState([]);

  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchPlanList();
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const text = `${plan.title} ${plan.tags.join(" ")}`
      return text.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, plans]);

  const fetchPlanList = async () => {
    try {
      const res = await getPlanList();
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openNotification = (type, title, description) => {
    notificationApi[type]({
      title,
      description,
    });
  };

  const createPlan = async (plan) => {
    try {
      const res = await postCreatePlan(plan);
      if (res.data === null) {
        openNotification(
          "error",
          "We can not create a plan now!",
          <Space vertical>
            {res.message}
            <Link to="/inventory">
              Go to Inventory
            </Link>
          </Space>
        );
      } else {
        openNotification(
          "success",
          "We are generating recipes for you!",
          <Link to={`/planning/plan?id=${res.data._id}`}>
            Go to Plan Detail
          </Link>
        );
      }
    } catch (err) {
      console.error(err);
    }
    fetchPlanList();
  };

  const handleGeneratePlan = (payload) => {
    const newPlan = {
      ...payload,
      title: payload.prompt || "AI Generated Plan",
      tags: [payload.mealType, `${payload.peopleNums} people`],
    };

    createPlan(newPlan);
  };

  return (
    <main className="relative bg-gray-50  min-h-[calc(100vh-80px)] p-4 md:p-8 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />

      <div className="sticky max-w-7xl mx-auto flex flex-col gap-10 top-0 z-30">
        {contextHolder}

        <h1 className="text-4xl font-bold text-gray-800">
          Planning
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1 h-full">
            <AIRecommendation />
          </div>

          <div className="lg:col-span-2 h-full">
            <CreatePlanForm onGenerate={handleGeneratePlan} />
          </div>
        </div>

        <PlanList
          plans={filteredPlans}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </main>
  );
};

export default Planning;
