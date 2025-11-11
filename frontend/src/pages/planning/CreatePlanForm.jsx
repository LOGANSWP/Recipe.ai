import React, {
  useEffect,
  useState,
} from "react";

const mockPrompts = [
  {
    id: "pp1",
    text: "Quick high-protein dinner",
    freq: 200,
  },
  {
    id: "pp2",
    text: "Vegetarian lunch under 500 cal",
    freq: 120,
  },
  {
    id: "pp3",
    text: "No spicy food",
    freq: 80,
  },
  {
    id: "pp4",
    text: "Steak & Salad",
    freq: 40,
  },
  {
    id: "pp5",
    text: "Healthy food",
    freq: 20,
  },
  {
    id: "pp6",
    text: "Spicy food",
    freq: 10,
  },
];

const PreferredPromptList = ({ onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [prompts, setPrompts] = useState(mockPrompts);

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        Preferred prompts
      </p>

      <div className="flex flex-wrap gap-2">
        {(expanded ? prompts : prompts.slice(0, 3)).map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt.text)}
            className="border px-2 py-1 rounded-lg bg-green-50 hover:bg-green-200 whitespace-nowrap"
          >
            {prompt.text}
          </button>
        ))}

        {prompts.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text text-green-700 mt-2 underline"
          >
            {expanded ? "Collapse" : "Expand all..."}
          </button>
        )}
      </div>
    </div>
  );
};

const CreatePlanForm = ({ onGenerate }) => {
  const [timeLimit, setTimeLimit] = useState(30);
  const [mealType, setMealType] = useState("Dinner");
  const [people, setPeople] = useState(2);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) {
      setMealType("Breakfast");
    }
    else if (hour < 17) {
      setMealType("Lunch");
    }
    else {
      setMealType("Dinner");
    }
  }, []);

  const handleSubmit = () => {
    onGenerate({
      time_limit_minutes: timeLimit,
      meal_type: mealType,
      people_nums: people,
      prompt,
    });
    setPrompt("");
  };

  const handleTimeLimitChange = (e) => {
    const newTimeLimit = e.target.value;
    if (newTimeLimit > 0 && newTimeLimit <= 600) {
      setTimeLimit(newTimeLimit);
    }
  };

  const handlePeopleChange = (e) => {
    const newPeople = e.target.value;
    if (newPeople > 0 && newPeople <= 10) {
      setPeople(newPeople);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6 h-full">
      <h2 className="text-2xl font-semibold text-green-700">
        Create New Plan
      </h2>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col min-w-[150px] flex-1">
          <label className="text-sm text-gray-600">Time limit (minutes)</label>
          <input
            type="number"
            value={timeLimit}
            onChange={handleTimeLimitChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col min-w-[150px] flex-1">
          <label className="text-sm text-gray-600">Meal type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            <option>Breakfast</option>
            <option>Brunch</option>
            <option>Lunch</option>
            <option>High Tea</option>
            <option>Dinner</option>
            <option>Night Snack</option>
          </select>
        </div>

        <div className="flex flex-col min-w-[150px] flex-1">
          <label className="text-sm text-gray-600">People</label>
          <input
            type="number"
            value={people}
            onChange={handlePeopleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <PreferredPromptList
        onSelect={(p) => {
          setPrompt(p);
        }}
      />

      <div>
        <label className="text-sm text-gray-600">Enter prompt</label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-1 w-full border px-3 py-2 rounded-lg"
          placeholder="Describe what you want to eat..."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
      >
        Generate
      </button>
    </div>
  );
};

export default CreatePlanForm;