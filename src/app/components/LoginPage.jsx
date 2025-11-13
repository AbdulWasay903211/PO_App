"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data.user); // pass user info
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Container with animation */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 w-full max-w-md"
      >
        {/* Logo animation */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-extrabold text-center text-gray-800 mb-6"
        >
          Pay Order Management System
        </motion.h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
