"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from "./Topbar";

// this is where we import the pages we use
import HomePage from '../pages/HomePage';
import Page2 from '../pages/Page2';

const DashboardLayout = () => {
  const [currentPage, setCurrentPage] = useState('page1');

  const renderPage = () => {
    switch (currentPage) {
      case 'page1':
        return <HomePage />;
      case 'page2':
        return <Page2 />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Topbar at the top */}
      <Topbar />

      {/* Sidebar + Main Content below */}
      <div className="flex flex-1">
        {/* Sidebar (left) */}
        <Sidebar onSelectPage={setCurrentPage} />

        {/* Main Area (right) */}
        <main className="flex-1 p-6 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
