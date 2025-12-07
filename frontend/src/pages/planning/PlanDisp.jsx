import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBars, FaTrash } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import PlanPageHeader from '../../components/PlanPageHeader';
import EditPlanForm from '../../components/EditPlanForm';
import SlideAction from '../../components/SlideAction';
import VerticalSortableList from '../../components/VerticalSortableList';

import { Alert, Flex, Spin, Space, message } from 'antd';
import { getPlan, getPlanDetail, postRerunPlan } from "../../api/planningApi";
import { RETRY_TIME } from "../../config.js";

const frequentlyUsedTags = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'spicy', 'low-carb', 'high-protein'];

function Dish({ item, selected, onDelete, openDishId, setOpenDishId, ...props }) {
  const maxWidth = 75;
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [dragX, setDragX] = useState(0);
  const [lastX, setLastX] = useState(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePan = (event, info) => {
    const newX = Math.max(-maxWidth, Math.min(0, lastX + info.offset.x));
    x.set(newX);
    setDragX(newX);
  };

  const setOpen = (open, { setId = false } = {}) => {
    if (open) {
      controls.start({ x: -maxWidth });
      setDragX(-maxWidth);
      setLastX(-maxWidth);
      if (setId && openDishId !== item._id) {
        setOpenDishId(item._id);
      }
    } else {
      controls.start({ x: 0 });
      setDragX(0);
      setLastX(0);
      if (setId && openDishId !== null) {
        setOpenDishId(null);
      }
    }
  }

  const handlePanEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) <= 50) {
      setOpen(lastX + offset <= -maxWidth / 2, { setId: true });
    } else {
      setOpen(velocity < 0, { setId: true });
    }
  };

  useEffect(() => {
    if (lastX < 0 && openDishId !== item._id) {
      console.log('Closing dish', item._id);
      setOpen(false);
    }
  }, [openDishId]);

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        className={`flex items-center relative mb-2 rounded-lg shadow-md cursor-pointer ${selected ? 'bg-green-200' : 'bg-white'}`}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{ x }}
        animate={controls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        <div className="flex justify-between items-center grow my-4 ml-4">
          <div>
            <h3 className="font-bold">{item?.title}</h3>
            <p className="text-sm text-gray-600">{item?.description}</p>
          </div>
          <p className="text-sm font-semibold">{item?.tags[0]}</p>
        </div>
        <div className="touch-none" ref={setActivatorNodeRef} {...attributes} {...listeners}>
          <div className="text-gray-400 m-4">
            <FaBars />
          </div>
        </div>
        <SlideAction dragX={dragX} side="right" color="bg-red-500" maxWidth={maxWidth} onClick={onDelete}>
          <FaTrash />
        </SlideAction>
      </motion.div>
    </div>
  );
}

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
      setDishes(res.data.recipes);
    } catch (err) {
      console.error(err);
    }
  }, [planId]);

  const rerunPlan = async () => {
    try {
      const res = await postRerunPlan(planId);
      setDishes(res.data.recipes);
      message.success("Rerun plan success");
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

  const handleSendEdition = () => {
    console.log('Edition prompt:', editionPrompt);
    // Here you would typically send the prompt to an AI service
    // and get back a new plan, then update the `dishes` state.
    setEditionPrompt('');
  };

  const handleConfirmPlan = () => {
    // Prefer the first selected dish; fall back to the first dish
    const targetId = (selectedDishes[0]) || dishes?.[0]?._id;
    if (!targetId) {
      return;
    }
    navigate(`/cook?id=${targetId}`);
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
        onLock={() => { }}
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
        {planStatus === "error" && (
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
            <Dish
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
