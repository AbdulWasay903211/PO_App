/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";

export default function InventoryManager() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  // for adding suppliers 
  const [modalOpen, setModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierUnit, setNewSupplierUnit] = useState("");
  const [addingSupplier, setAddingSupplier] = useState(false);


  /* =====================================
     ADD SUPPLIERS
  ====================================== */
  const handleAddSupplier = async () => {
    console.log("handleAddSupplier called"); // function started
    if (!newSupplierName || !newSupplierUnit) {
      console.log("Validation failed: missing name or unit");
      return alert("All fields are required!");
    }

    console.log("Adding supplier with:", { name: newSupplierName, unit: newSupplierUnit });
    setAddingSupplier(true);

    try {
      const res = await fetch("/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSupplierName,
          unit_of_measurement: newSupplierUnit,
        }),
      });

      console.log("Fetch response status:", res.status);

      const data = await res.json();
      console.log("Fetch response data:", data);

      if (res.ok) {
        console.log("Supplier added successfully");
        fetchSuppliers();
        setNewSupplierName("");
        setNewSupplierUnit("");
        setModalOpen(false);
      } else {
        console.error("Failed to add supplier:", data.error || data);
        alert(data.error || "Failed to add supplier");
      }
    } catch (err) {
      console.error("Error in fetch:", err);
      alert("Error adding supplier");
    }

    setAddingSupplier(false);
    console.log("handleAddSupplier finished");
  };

  /* =====================================
     FETCH SUPPLIERS
  ====================================== */
  const fetchSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const res = await fetch("/api/supplier");
      const data = await res.json();
      if (res.ok) setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  /* =====================================
     FETCH ITEMS FOR SELECTED SUPPLIER
  ====================================== */
  const fetchItems = async (supplierId) => {
    setLoadingItems(true);
    try {
      const res = await fetch("/api/item");
      const data = await res.json();
      if (res.ok) {
        setItems(data.filter((item) => item.supplier_id === supplierId));
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  /* =====================================
     DELETE SUPPLIER
  ====================================== */
  const handleDeleteSupplier = async (supplier) => {
    if (!confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) return;

    try {
      console.log("Deleting supplier ID:", supplier.id);

      const res = await fetch("/api/supplier", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: supplier.id }),
      });

      const data = await res.json();
      console.log("Delete response:", data);

      if (res.ok) {
        fetchSuppliers();
        if (selectedSupplier?.id === supplier.id) setSelectedSupplier(null);
      } else {
        alert(data.error || "Failed to delete supplier");
      }
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert("Error deleting supplier");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) fetchItems(selectedSupplier.id);
    else setItems([]);
  }, [selectedSupplier]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Inventory Manager
      </h1>

      {/* SUPPLIERS */}
      <div className="bg-white shadow-lg rounded-xl p-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Suppliers</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Supplier
          </button>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Add Supplier</h3>
              <input
                type="text"
                placeholder="Supplier Name"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="text"
                placeholder="Unit of Measurement"
                value={newSupplierUnit}
                onChange={(e) => setNewSupplierUnit(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSupplier}
                  disabled={addingSupplier}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {addingSupplier ? "Adding..." : "Add Supplier"}
                </button>
              </div>
            </div>
          </div>
        )}



        {/* UPDATED TABLE */}
        <table className="w-full border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left rounded-t-xl">
              <th className="p-3 font-medium text-left">ID</th>
              <th className="p-3 font-medium text-left">Name</th>
              <th className="p-3 font-medium text-left">Unit</th>
              <th className="p-3 font-medium text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loadingSuppliers ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading suppliers...
                </td>
              </tr>
            ) : suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className={`odd:bg-gray-50 hover:bg-gray-100 transition cursor-pointer ${
                    selectedSupplier?.id === supplier.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <td className="p-3">{supplier.id}</td>
                  <td className="p-3">{supplier.name}</td>
                  <td className="p-3">{supplier.unit_of_measurement}</td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const name = prompt(
                          "Edit supplier name:",
                          supplier.name
                        );
                        const unit = prompt(
                          "Edit unit of measurement:",
                          supplier.unit_of_measurement
                        );
                        if (name && unit) {
                          fetch("/api/supplier", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: supplier.id,
                              name,
                              unit_of_measurement: unit,
                            }),
                          }).then(fetchSuppliers);
                        }
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupplier(supplier);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No suppliers yet — click "Add Supplier" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ITEMS */}
      {selectedSupplier && (
        <div className="bg-white shadow-lg rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Items for:{" "}
              <span className="text-blue-600">{selectedSupplier.name}</span>
            </h2>

            <button
              onClick={() => {
                const name = prompt("Enter item name:");
                const price = prompt("Enter price per unit:");
                if (name && price) {
                  fetch("/api/item", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name,
                      price_per_unit: parseFloat(price),
                      supplier_id: selectedSupplier.id,
                    }),
                  }).then(() => fetchItems(selectedSupplier.id));
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add Item
            </button>
          </div>

          {/* UPDATED ITEM TABLE */}
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left rounded-t-xl">
                <th className="p-3 font-medium text-left">Name</th>
                <th className="p-3 font-medium text-left">Unit Price</th>
                <th className="p-3 font-medium text-left">Actions</th>
              </tr>
            </thead>


            <tbody>
              {loadingItems ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    Loading items...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="odd:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.price_per_unit}</td>
                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => {
                          const name = prompt("Edit item name:", item.name);
                          const price = prompt(
                            "Edit price per unit:",
                            item.price_per_unit
                          );
                          if (name && price) {
                            fetch("/api/item", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                id: item.id,
                                name,
                                price_per_unit: parseFloat(price),
                              }),
                            }).then(() => fetchItems(selectedSupplier.id));
                          }
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    No items for this supplier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
