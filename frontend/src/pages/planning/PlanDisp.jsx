import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Flex, Spin, Space, message } from 'antd';

import PlanPageHeader from '../../components/PlanPageHeader';
import EditPlanForm from '../../components/EditPlanForm';
import VerticalSortableList from '../../components/VerticalSortableList';
import PlannedDish from '../../components/PlannedDish';

import { getPlan, getPlanDetail, postRerunPlan, postEditPlan, postUpdatePlan } from "../../api/planningApi";
import { RETRY_TIME } from "../../config.js";

const frequentlyUsedTags = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'spicy', 'low-carb', 'high-protein'];

const PlanDisp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("id");

  const [planStatus, setPlanStatus] = useState(null);
  const [dishes, setDishes] = useState([]);

  const [selectedDishes, setSelectedDishes] = useState([]);
  const [editionPrompt, setEditionPrompt] = useState('');
  const [openDishId, setOpenDishId] = useState(null);
  const isSelecting = useMemo(() => selectedDishes.length > 0, [selectedDishes]);

  const fetchPlanDetail = useCallback(async () => {
    if (!planId) {
      return;
    }
    try {
      const res = await getPlanDetail(planId);
      message.success("Plan generated!");
      setDishes(res.data.recipes);
    } catch (err) {
      console.error(err);
    }
  }, [planId]);

  const rerunPlan = async () => {
    try {
      const res = await postRerunPlan({id: planId});
      setPlanStatus(res.data.status);
      message.info(res.message);
      repeatQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const repeatQuery = () => {
    if (!planId) {
      return;
    }

    let timerId = null;
    let cancelled = false;

    const poll = async () => {
      try {
        console.log("get plan");
        const res = await getPlan(planId);
        if (cancelled) {
          return;
        }

        const status = res.data.status;
        setPlanStatus(status);

        if (status === 'waiting') {
          timerId = setTimeout(poll, RETRY_TIME);
        } else if (status === 'success') {
          await fetchPlanDetail();
          setEditionPrompt('');
        }
      } catch (err) {
        console.error(err);
        timerId = setTimeout(poll, RETRY_TIME);
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  };

  useEffect(repeatQuery, [planId, fetchPlanDetail]);

  const handleRerunPlanOnClick = () => {
    rerunPlan();
  };

  const handleSendEdition = async () => {
    console.log('Edition prompt:', editionPrompt);
    if (!editionPrompt) return;

    try {
      const res = await postEditPlan({
        id: planId,
        dishes: dishes,
        prompt: editionPrompt
      });
      setPlanStatus(res.data.status);
      repeatQuery();
    } catch (err) {
      console.error(err);
      message.error("Failed to send edit request");
    }
  };
  const handleConfirmPlan = async () => {
    // update the database with dishes
    try {
      await postUpdatePlan({
        id: planId,
        dishes: dishes,
      });

      let targetId = dishes?.[0]?._id;

      if (!targetId) {
        return;
      }
      navigate(`/cook?id=${targetId}`);
    } catch (err) {
      console.error(err);
      message.error("Failed to confirm plan");
    }
  };

  const handleSelect = (itemId) => {
    setOpenDishId(null);
    setSelectedDishes((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDelete = (itemId) => {
    setDishes((prev) => prev.filter((item) => item._id !== itemId));
  };

  return (
    <main className="relative bg-gray-50 min-h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />
      <PlanPageHeader
        title="Your Meal Plan"
        onBack={() => navigate(-1)}
        isSelecting={isSelecting}
        onDelete={() => {
          setDishes((prev) => prev.filter((dish) => !selectedDishes.includes(dish._id)));
          setSelectedDishes([]);
        }}
        onConfirm={handleConfirmPlan}
      />

      <div className="relative z-0 max-w-5xl mx-auto w-full p-4 max-h-[calc(100vh-230px)] grow space-y-2 overflow-y-scroll">
        {planStatus === "waiting" && (
          <Flex gap="middle" vertical>
            <Spin spinning>
              <Alert
                type="info"
                title="Waiting..."
                description="We are working on your plan (It may take up to one minute)."
              />
            </Spin>
          </Flex>
        )}
        {planStatus === "fail" && (
          <Flex gap="middle" vertical>
            <Alert
              type="error"
              title="Something wrong..."
              description={(
                <Space wrap>
                  Sorry, We failed to generate your recipes. Please click the rerun button to try again.
                  <a onClick={handleRerunPlanOnClick}>Rerun Plan</a>
                </Space>
              )}
            />
          </Flex>
        )}

        <VerticalSortableList items={dishes} setItems={setDishes}>
          {dishes.map((item) => (
            <PlannedDish
              key={item._id}
              item={item}
              selected={selectedDishes.includes(item._id)}
              onClick={() => handleSelect(item._id)}
              onDelete={() => handleDelete(item._id)}
              openDishId={openDishId}
              setOpenDishId={setOpenDishId}
            />
          ))}
        </VerticalSortableList>
      </div>
      <div className="sticky bottom-0 z-0 max-w-5xl mx-auto w-full p-4">
        <EditPlanForm
          editionPrompt={editionPrompt}
          onPromptChange={setEditionPrompt}
          onSend={handleSendEdition}
          frequentlyUsedTags={frequentlyUsedTags}
        />
      </div>
    </main>
  );
};

export default PlanDisp;
