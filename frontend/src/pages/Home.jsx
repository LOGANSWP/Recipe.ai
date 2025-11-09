import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    // Main container with a light gray background
    // It's set to be at least the full viewport height (minus a header, approx 80px)
    // 'overflow-hidden' prevents the blur shapes from creating scrollbars
    <main className="relative bg-gray-50 min-h-[calc(100vh-80px)] flex justify-center items-center p-6 overflow-hidden">
      {/* Decorative background shapes with blur and opacity */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-200 rounded-full opacity-50 blur-3xl -z-0" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />

      {/* Content container, centered with text-center */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800">
          Welcome to <span className="text-orange-400">Recipe</span>
          <span className="text-green-600">.ai</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl">
          Stop wondering "what's for dinner?".
          <br />
          Let's turn the ingredients you have into a meal you'll love.
        </p>

        {/* Call to Action Button */}
        <div className="mt-10">
          <Link
            to="/recipes" // This should link to your recipe generation page
            className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-full text-lg sm:text-xl px-8 py-4 shadow-lg shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            Planning what to eat
          </Link>
        </div>
      </div>
    </main>
  );
}
