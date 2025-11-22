"use client";
import React from "react";

const Sidebar = ({ onSelectPage, userType }) => {
  return (
    <div className="w-64 bg-gray-300 text-gray-800 min-h-full flex flex-col shadow-md">
      {/* Header Section */}
      <div className="py-7 px-7">
        <h2 className="text-2xl font-bold tracking-wide">Dashboard</h2>
      </div>

      {/* Buttons */}
      <div className="flex flex-col px-5 mt-1">
        <button
          onClick={() => onSelectPage("page1")} // Changed to match DashboardLayout page keys
          className="text-left mb-2 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => onSelectPage("page2")}
          className="text-left mb-2 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Page 2
        </button>

        {/* ✅ Only render Account Manager if CEO */}
        {userType === "CEO" && (
          <button
            onClick={() => onSelectPage("accountManager")}
            className="text-left mb-2 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Account Manager
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
