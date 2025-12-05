import React from 'react';
import { motion } from 'framer-motion';

const SlideAction = ({ dragX, side, children, color, maxWidth }) => {
    const isRightSide = side === 'right';
    const width = Math.max(0, isRightSide ? -dragX : dragX);
    const opacity = Math.min(1, width / maxWidth);

    if (width === 0) {
        return null;
    }

    return (
        <motion.div
            className={`absolute top-0 bottom-0 ${color} text-white flex items-center justify-center ${isRightSide ? 'left-full' : 'right-full'}`}
            style={{ width, opacity }}
            aria-hidden="true"
        >
            {children}
        </motion.div>
    );
};

export default SlideAction;
