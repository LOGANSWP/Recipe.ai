import React from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaTrash } from 'react-icons/fa';

function BackButton({ onBack }) {
    return (
        <button
            onClick={onBack}
            className="px-1 py-1 hover:bg-gray-50 flex items-center gap-2"
        >
            <FaArrowLeft />
        </button>
    );
}

function ConfirmButton({ onConfirm }) {
    return (
        <button
            onClick={onConfirm}
            className="p-2 my-1 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center"
        >
            <FaArrowRight />
        </button>
    );
}

function LockButton( { onLock } ) {
    return (
        <button
            onClick={onLock}
            className="p-2 my-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 flex items-center"
        >
            <FaLock />
        </button>
    );
}

function DeleteButton( { onDelete } ) {
    return (
        <button
            onClick={onDelete}
            className="p-2 my-1 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center"
        >
            <FaTrash />
        </button>
    );
}

const PlanPageHeader = ({ title, onBack, isSelecting, onLock, onDelete, onConfirm }) => {
    var rightbar = [];
    if (isSelecting) {
        rightbar.push(<LockButton key="lock" onLock={onLock} />);
        rightbar.push(<DeleteButton key="delete" onDelete={onDelete} />);
    }
    rightbar.push(<ConfirmButton key="confirm" onConfirm={onConfirm} />);
    return (
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b">
            <div className="max-w-5xl mx-auto px-4 flex items-center gap-3">
                <BackButton onBack={onBack} />
                <h1 className="text-xl font-bold text-center flex-1">{title}</h1>
                <div className="flex items-center gap-3">
                    {rightbar}
                </div>
            </div>
        </div>
    );
};

export default PlanPageHeader;
