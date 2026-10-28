import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuppliers,
  deleteSupplier,
  setSearchQuery,
} from "../../store/slices/supplierSlice";

import SearchFilterBar from "../common/SearchFilterBar";
import EmptyState from "../common/EmptyState";
import SupplierForm from "./SupplierForm";

const SupplierList = () => {
  const dispatch = useDispatch();

  const {
    items: suppliers,
    searchQuery,
    loading,
  } = useSelector((state) => state.suppliers);
  const { role } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const isAdmin = role === "ADMIN" || role === "MANAGER";

  // Fetch suppliers on mount
  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // Filter using Redux searchQuery
  const filteredItems = (suppliers || []).filter((supplier) =>
    supplier.name?.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (confirmed) {
      dispatch(deleteSupplier(id));
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="list-page-container">
      <h1>Suppliers</h1>

      <SearchFilterBar
  searchTerm={searchQuery}
  onSearchChange={(value) =>
    dispatch(setSearchQuery(value))
  }
  searchPlaceholder="Search by supplier name..."
/>

      {isAdmin && (
        <button type="button" className="btn-primary" onClick={handleAdd}>
          + Add Supplier
        </button>
      )}

      {filteredItems.length === 0 ? (
        <EmptyState message="No suppliers found." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Email</th>
                <th>Phone</th>
                <th>Lead Time (Days)</th>
                <th>Reliability</th>
                <th>Status</th>

                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>

                  <td>{supplier.contactEmail || "-"}</td>

                  <td>{supplier.phone || "-"}</td>

                  <td>{supplier.leadTimeDays ?? "-"}</td>

                  <td>
                    {supplier.reliabilityScore != null
                      ? `${supplier.reliabilityScore}%`
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${supplier.status?.toLowerCase()}`}
                    >
                      {supplier.status}
                    </span>
                  </td>

                  {isAdmin && (
                    <td className="action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(supplier)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(supplier.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <SupplierForm
          item={editingSupplier}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />
      )}
    </div>
  );
};

export default SupplierList;
