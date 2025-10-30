"use client";
import React from "react";

const Topbar = () => {
  return (
    <div className="w-full bg-gray-100 text-gray-800 flex items-center justify-between px-8 py-5 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        
      </div>

      {/* Right: Title */}
      <h1 className="text-xl font-bold tracking-wide text-right">
        Pay Order Management System
      </h1>
    </div>
  );
};

export default Topbar;
