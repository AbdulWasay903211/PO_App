"use client";
import React from "react";

const Topbar = () => {
  return (
    <div className="w-full bg-gray-100 text-gray-800 flex items-center justify-between px-12 py-5 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.png" // place your logo in /public
          alt="Logo"
          className="w-30 h-13"
        />
      </div>

      {/* Right: Title */}
      <h1 className="text-2xl font-bold tracking-wide text-right">
        Pay Order Management System
      </h1>
    </div>
  );
};

export default Topbar;
