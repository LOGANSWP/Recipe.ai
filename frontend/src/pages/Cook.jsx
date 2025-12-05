import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaListUl, FaTimes } from "react-icons/fa";
import { Select, Spin, Empty, message } from "antd";

import { getRecipeById, listRecipes } from "../api/recipeApi";

export default function Cook() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRecipeId = searchParams.get("id");

  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState(initialRecipeId);
  const [recipe, setRecipe] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [idx, setIdx] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const stepRefs = useRef([]);
  const containerRef = useRef(null);
  const pagingLockRef = useRef(false);
  const wheelThresholdRef = useRef(18);
  const rafRef = useRef(0);
  const targetTopRef = useRef(0);

  // Progress based on steps count
  const progress = useMemo(() => {
    const total = recipe?.steps?.length || 0;
    return total ? Math.round(((idx + 1) / total) * 100) : 0;
  }, [idx, recipe?.steps?.length]);

  // Fetch list of recipes for dropdown
  useEffect(() => {
    const fetchList = async () => {
      try {
        setIsLoadingList(true);
        const res = await listRecipes();
        setRecipes(res || []);
        if (!initialRecipeId && res?.length) {
          setSelectedId(res[0]._id);
          setSearchParams({ id: res[0]._id });
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load recipes");
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchList();
  }, [initialRecipeId, setSearchParams]);

  // Fetch selected recipe detail
  useEffect(() => {
    const loadRecipe = async () => {
      if (!selectedId) {
        setRecipe(null);
        return;
      }
      try {
        setIsLoadingRecipe(true);
        const res = await getRecipeById(selectedId);
        setRecipe(res);
        setIdx(0);
      } catch (err) {
        console.error(err);
        message.error("Failed to load recipe");
      } finally {
        setIsLoadingRecipe(false);
      }
    };
    loadRecipe();
  }, [selectedId]);

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setIdx(Number(visible.target.dataset.index));
      },
      { root: containerRef.current, threshold: [0.35, 0.6], rootMargin: "0px 0px -30% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToIndex = (i) => {
    const total = recipe?.steps?.length || 0;
    const n = Math.max(0, Math.min(total - 1, i));
    const el = stepRefs.current[n];
    const root = containerRef.current;
    if (!el || !root) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    pagingLockRef.current = true;
    const top = el.offsetTop - 16;
    targetTopRef.current = top;
    root.scrollTo({ top, behavior: "smooth" });
    const tick = () => {
      const diff = Math.abs(root.scrollTop - targetTopRef.current);
      if (diff <= 2) {
        pagingLockRef.current = false;
        rafRef.current = 0;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const go = scrollToIndex;

  useEffect(() => {
    if (showOverview) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showOverview]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const onWheel = (e) => {
      if (showOverview) return;
      e.preventDefault();
      if (pagingLockRef.current) return;
      const delta = e.deltaY;
      const threshold = wheelThresholdRef.current;
      if (Math.abs(delta) < threshold) return;
      if (delta > 0) scrollToIndex(idx + 1);
      else scrollToIndex(idx - 1);
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [idx, showOverview]);

  const steps = recipe?.steps || [];
  const ingredients = recipe?.ingredients || [];

  return (
    <main className="relative bg-gray-50 min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />

      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            className="px-1 py-1 hover:bg-gray-50 flex items-center gap-2"
          >
              <FaArrowLeft />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <h1 className="text-xl font-bold truncate">{recipe?.title || "Select a recipe"}</h1>
            <Select
              size="middle"
              className="min-w-[220px]"
              placeholder="Choose a recipe"
              loading={isLoadingList}
              value={selectedId || undefined}
              onChange={(val) => {
                setSelectedId(val);
                setSearchParams({ id: val });
              }}
              options={recipes.map((r) => ({ label: r.title, value: r._id }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 hidden sm:block">
              {recipe ? (
                <>
                  Servings: {recipe.servings ?? "-"} · Total: {recipe.totalTimeMin ?? "-"} min
                </>
              ) : (
                "No recipe loaded"
              )}
            </div>
            <button
              onClick={() => setShowOverview(true)}
              className="px-1 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            >
              <FaListUl /> Overview
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="relative z-0 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        <aside className="md:col-span-1 space-y-4">
          {recipe?.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-2xl border shadow-sm"
            />
          )}
          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <h2 className="font-semibold mb-2">Ingredients</h2>
            {ingredients.length === 0 ? (
              <p className="text-sm text-gray-500">No ingredients provided.</p>
            ) : (
              <ul className="space-y-2">
                {ingredients.map((it, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-gray-800">{it.name}</span>
                    <span className="text-gray-500 text-sm">{it.amount}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section
          ref={containerRef}
          className="md:col-span-2 h-[calc(100vh-180px)] overflow-y-auto rounded-2xl border bg-white shadow-sm scroll-smooth scroll-pt-6"
          style={{ scrollSnapType: "y mandatory" }}
        >
          {isLoadingRecipe ? (
            <div className="flex items-center justify-center h-full">
              <Spin tip="Loading recipe..." />
            </div>
          ) : !recipe ? (
            <div className="flex items-center justify-center h-full">
              <Empty description="No recipe selected" />
            </div>
          ) : steps.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Empty description="This recipe has no steps yet" />
            </div>
          ) : (
            steps.map((s, i) => (
              <div
                key={`${s._id || s.order || i}`}
                ref={(el) => (stepRefs.current[i] = el)}
                data-index={i}
                className="min-h-[82vh] p-6 flex items-center"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  className={`w-full p-6 rounded-3xl border shadow-sm ${
                    i === idx ? "bg-green-50 border-green-300" : "bg-gray-50"
                  }`}
                >
                  <div className="text-sm text-gray-500 mb-2">
                    Step {i + 1} / {steps.length}
                    {s.durationMin ? ` · ~${s.durationMin} min` : ""}
                  </div>
                  <div className="text-2xl md:text-3xl font-semibold leading-snug">{s.text}</div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {showOverview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white border shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="text-lg font-semibold">Step Overview</h3>
              <button onClick={() => setShowOverview(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>

            <div className="px-5 py-4">
              {steps.length === 0 ? (
                <Empty description="No steps to show" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {steps.map((s, i) => (
                    <button
                      key={`${s._id || s.order || i}`}
                      onClick={() => {
                        setShowOverview(false);
                        setTimeout(() => go(i), 0);
                      }}
                      className="text-left p-4 rounded-xl border hover:border-green-400 hover:bg-green-50"
                    >
                      <div className="text-xs text-gray-500 mb-1">Step {i + 1}</div>
                      <div className="font-medium">{s.text}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t text-right">
              <button
                onClick={() => setShowOverview(false)}
                className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
