import React from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

const EditPlanForm = ({
    editionPrompt,
    onPromptChange,
    onSend,
    frequentlyUsedTags,
}) => {
    return (
        <div className="mt-6">
            <div className="flex">
                <input
                    type="text"
                    value={editionPrompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="e.g., 'Replace chicken with a vegetarian option'"
                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
                <button
                    onClick={onSend}
                    className="bg-green-600 text-white py-2 px-4 rounded-r-lg hover:bg-green-700"
                >
                    <FaWandMagicSparkles />
                </button>
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2 mt-4">
                {frequentlyUsedTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => onPromptChange(prev => `${prev} ${tag}`)}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EditPlanForm;
