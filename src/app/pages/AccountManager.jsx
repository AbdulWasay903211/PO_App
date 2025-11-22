"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  /* =====================================
     DELETE ACCOUNT (Uses account_id)
  ====================================== */
  const handleDelete = async (acc) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      const res = await fetch(`/api/accounts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: acc.user_id, 
          account_id: acc.account_id 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Deleted:", data);
        fetchAccounts();
      } else {
        alert(data.error || "Failed to delete account");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting account");
    }
  };

  /* =====================================
     GET ACCOUNTS
  ====================================== */
  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();

      if (res.ok) setAccounts(data);
      else console.error(data.error);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          Account Manager
        </motion.h1>

        <motion.button
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add
        </motion.button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-xl overflow-hidden"
      >
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 w-10"></th>
              <th className="p-3">Account ID</th>
              <th className="p-3">User ID</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Account Type</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Loading accounts...
                </td>
              </tr>
            ) : accounts.length > 0 ? (
              accounts.map((acc) => (
                <motion.tr
                  key={acc.account_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-blue-50 transition"
                >
                  {/* DELETE BUTTON */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(acc)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </td>

                  <td className="p-3 font-semibold">{acc.account_id}</td>
                  <td className="p-3">{acc.user_id}</td>
                  <td className="p-3">{acc.first_name}</td>
                  <td className="p-3">{acc.last_name}</td>
                  <td className="p-3">{acc.email}</td>
                  <td className="p-3 font-medium text-blue-700">{acc.user_type}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No accounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          refresh={fetchAccounts}
        />
      )}
    </div>
  );
};

export default AccountManager;

/* ============================================
   ADD ACCOUNT MODAL — updated & compatible
============================================ */
const AddAccountModal = ({ onClose, refresh }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    user_type: "Employee",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Insert failed");

      onClose();
      refresh();
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add account");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Add New Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Inputs */}
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* ENUM TYPES */}
          <select
            name="user_type"
            value={form.user_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="CEO">CEO</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Account
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
