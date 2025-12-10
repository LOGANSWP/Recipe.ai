import { useState, useEffect } from 'react';
import { FaBars, FaTrash } from 'react-icons/fa6';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import SlideAction from './SlideAction';

function PlannedDish({ item, selected, onDelete, openDishId, setOpenDishId, ...props }) {
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
    if (isDragging) return;
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
    if (isDragging) return;
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
      setOpen(false);
    }
  }, [openDishId]);

  return (
    <div ref={setNodeRef} style={style} className="touch-pan-y">
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

export default PlannedDish;
