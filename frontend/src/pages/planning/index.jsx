import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Space, notification, message } from "antd";
import dayjs from "dayjs";

import AIRecommendation from "./AIRecommendation";
import CreateNewPlan from "./CreateNewPlan";
import HistoryPlans from "./HistoryPlans";
import { getPlanList, getPromptList, postCreatePlan, postDeletePlan } from "../../api/planningApi";

const Planning = () => {
  const [plans, setPlans] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const [notificationApi, contextHolder] = notification.useNotification();
  const openNotification = (type, title, description) => {
    notificationApi[type]({
      title,
      description,
    });
  };

  useEffect(() => {
    fetchPlanList();
    fetchPromptList();
  }, []);

  const fetchPlanList = async () => {
    try {
      const res = await getPlanList();
      res.data.forEach(plan => {
        plan.searchText = `${plan.title} ${plan.tags.join(" ")}`;
        plan.truncatedTitle = plan.title.length > 50 ? `${plan.title.slice(0, 47)}...` : plan.title;
        plan.createdAt = dayjs(plan.createdAt).format("YYYY-MM-DD hh:mm:ss");
      });
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPromptList = async () => {
    try {
      const res = await getPromptList();
      res.data.forEach(prompt => {
        prompt.truncatedText = prompt.text.length > 30 ? `${prompt.text.slice(0, 27)}...` : prompt.text;
      });
      setPrompts(res.data);
    } catch (err) {
      console.error(err);
    }
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
            <Link to="/inventory" className="underline">
              Go to Inventory
            </Link>
          </Space>
        );
      } else {
        openNotification(
          "success",
          "We are generating recipes for you!",
          <Link to={`/planning/plan?id=${res.data._id}`} className="underline">
            Go to Plan Detail
          </Link>
        );
      }
    } catch (err) {
      console.error(err);
    }
    fetchPlanList();
  };

  const deletePlan = async (planId) => {
    try {
      await postDeletePlan({ id: planId });
      message.success("Delete plan success")
    } catch (err) {
      console.error(err);
    }
    fetchPlanList();
  };

  const handleCreatePlan = (payload) => {
    const newPlan = {
      ...payload,
      title: payload.prompt || "AI Generated Plan",
      tags: [
        `${payload.timeLimit} minutes`,
        payload.mealType,
        `${payload.peopleNums} people`,
      ],
    };
    createPlan(newPlan);
  };

  const handleDeletePlan = (planId) => {
    deletePlan(planId);
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
            <CreateNewPlan prompts={prompts} createPlan={handleCreatePlan} />
          </div>
        </div>

        <HistoryPlans plans={plans} deletePlan={handleDeletePlan} />
      </div>
    </main>
  );
};

export default Planning;
