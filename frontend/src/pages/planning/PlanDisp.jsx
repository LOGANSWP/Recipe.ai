import { useEffect, useMemo, useState } from 'react';
import { FaBars, FaTrash } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import PlanPageHeader from '../../components/PlanPageHeader';
import EditPlanForm from '../../components/EditPlanForm';
import SlideAction from '../../components/SlideAction';
import VerticalSortableList from '../../components/VerticalSortableList';

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
    } = useSortable({ id: item.id });

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
            if (setId && openDishId !== item.id) {
                setOpenDishId(item.id);
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
        if (lastX < 0 && openDishId !== item.id) {
            console.log('Closing dish', item.id);
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
                        <h3 className="font-bold">{item?.name}</h3>
                        <p className="text-sm text-gray-600">{item?.tags?.join(', ')}</p>
                    </div>
                    <p className="text-sm font-semibold">{item?.calories} kcal</p>
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
    const initialDishes = location.state?.plan || [
        { id: 1, name: 'Spaghetti Carbonara', tags: ['dairy', 'high-protein'], calories: 600 },
        { id: 2, name: 'Tofu Stir-fry', tags: ['vegetarian', 'vegan'], calories: 400 },
        { id: 3, name: 'Chicken Salad', tags: ['gluten-free', 'low-carb'], calories: 350 },
    ];

    const [dishes, setDishes] = useState(initialDishes.map((d, i) => ({ ...d, id: d.id || i + 1 })));
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [editionPrompt, setEditionPrompt] = useState('');
    const [openDishId, setOpenDishId] = useState(null);
    const isSelecting = useMemo(() => selectedDishes.length > 0, [selectedDishes]);

    const handleSendEdition = () => {
        console.log('Edition prompt:', editionPrompt);
        // Here you would typically send the prompt to an AI service
        // and get back a new plan, then update the `dishes` state.
        setEditionPrompt('');
    };

    const handleConfirmPlan = () => {
        navigate('/cook', { state: { plan: dishes } });
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
        setDishes((prev) => prev.filter((item) => item.id !== itemId));
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
                    setDishes((prev) => prev.filter((dish) => !selectedDishes.includes(dish.id)));
                    setSelectedDishes([]);
                }}
                onConfirm={handleConfirmPlan}
            />

            <div className="relative z-0 max-w-5xl mx-auto w-full p-4 max-h-[calc(100vh-230px)] grow space-y-2 overflow-y-scroll">
                <VerticalSortableList items={dishes} setItems={setDishes}>
                    {dishes.map((item) => (
                        <Dish
                            key={item.id}
                            item={item}
                            selected={selectedDishes.includes(item.id)}
                            onClick={() => handleSelect(item.id)}
                            onDelete={() => handleDelete(item.id)}
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

