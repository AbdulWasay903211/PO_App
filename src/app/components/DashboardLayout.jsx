"use client";

import React, { useState, useEffect } from "react"; // ✅ Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "./Topbar";

import HomePage from "../pages/HomePage";
import Page2 from "../pages/Page2";
import AccountManager from "../pages/AccountManager";

const DashboardLayout = () => {
  const [currentPage, setCurrentPage] = useState("page1");
  const [userType, setUserType] = useState(() => sessionStorage.getItem("user_type"));

  const renderPage = () => {
    switch (currentPage) {
      case "page1":
        return <HomePage />;
      case "page2":
        return <Page2 />;
      case "accountManager":
        // ✅ Only allow CEO to see this page
        return userType === "CEO" ? <AccountManager /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 overflow-hidden">
      {/* Animated Topbar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Topbar />
      </motion.div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar animation */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* ✅ Pass userType to Sidebar for conditional links */}
          <Sidebar onSelectPage={setCurrentPage} userType={userType} />
        </motion.div>

        {/* Page transition animation */}
        <main className="flex-1 p-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
