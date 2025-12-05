import {
  useEffect,
  useState,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { Space, notification, message } from "antd";

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
        message.error("Create plan fail");
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
        message.success("Create plan success");
        openNotification(
          "success",
          "We are generating recipes for you!",
          <Link to="/">
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
    <main className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
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
