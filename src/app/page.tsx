"use client";

import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import LoginPage from "./components/LoginPage"; // make sure you save it in /components/

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <DashboardLayout />
      ) : (
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;
