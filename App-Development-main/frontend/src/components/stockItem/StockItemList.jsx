// src/components/stockItem/StockItemList.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchStockItems,
  deleteStockItem,
} from "../../store/slices/stockItemSlice";

import CapacityBar from "../common/CapacityBar";
import SearchFilterBar from "../common/SearchFilterBar";
import EmptyState from "../common/EmptyState";
import StockAdjustmentModal from "./StockAdjustmentModal";
import StockItemForm from "./StockItemForm";

const StockItemList = () => {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector(
    (state) => state.stockItems
  );

  const { role } = useSelector(
    (state) => state.auth
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // null = no modal open
  const [adjustmentItem, setAdjustmentItem] = useState(null);
const [editingItem, setEditingItem] = useState(undefined);
  const isAdmin =
    role === "ADMIN" || role === "MANAGER";

  // ==========================================
  // FETCH STOCK ITEMS
  // ==========================================

  useEffect(() => {
    dispatch(fetchStockItems());
  }, [dispatch]);

  // ==========================================
  // GET UNIQUE CATEGORIES
  // ==========================================

  const categories = [
  ...new Set(
    (items || [])
      .map((item) => item.category)
      .filter(Boolean)
  ),
].map((category) => ({
  value: category,
  label: category,
}));

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredItems = (items || []).filter((item) => {
    const search = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !search ||
      item.sku?.toLowerCase().includes(search) ||
      item.username?.toLowerCase().includes(search);

    const matchesCategory =
      !selectedCategory ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stock item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteStockItem(id)).unwrap();

      // Refresh from backend so frontend stays in sync.
      await dispatch(fetchStockItems()).unwrap();
    } catch (err) {
      console.error("Failed to delete stock item:", err);
    }
  };

  // ==========================================
  // ADD NEW ITEM
  // ==========================================

  const handleAddItem = () => {
    // null means create mode
    setEditingItem(null);
  };

  // ==========================================
  // EDIT ITEM
  // ==========================================

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    setEditingItem(undefined);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && (!items || items.length === 0)) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  return (
    <div className="list-page-container">

      <h1>Stock Items</h1>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="form-error">
          {typeof error === "string"
            ? error
            : "Failed to load stock items."}
        </div>
      )}

      {/* ======================================
          SEARCH + FILTER
      ====================================== */}

      <SearchFilterBar
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by SKU or Name..."
        filterOptions={categories}
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
      />

      {/* ======================================
          ADD STOCK ITEM
      ====================================== */}

      {isAdmin && (
        <button
          type="button"
          onClick={handleAddItem}
          className="btn-primary"
        >
          + Add Stock Item
        </button>
      )}

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {filteredItems.length === 0 ? (
        <EmptyState
          message={
            searchQuery || selectedCategory
              ? "No stock items match your search."
              : "No stock items found."
          }
          ctaText={
            isAdmin &&
            !searchQuery &&
            !selectedCategory
              ? "Add Stock Item"
              : undefined
          }
          onCtaClick={
            isAdmin &&
            !searchQuery &&
            !selectedCategory
              ? handleAddItem
              : undefined
          }
        />
      ) : (

<div className="table-container">
  <table className="stock-items-table">

    {/* TABLE HEADER */}
    <thead>
      <tr>
        <th>SKU</th>
        <th>Name</th>
        <th>Category</th>
        <th>Status</th>
        <th>Stock Level</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>
    </thead>

    {/* TABLE BODY */}
    <tbody>
      {filteredItems.map((item) => (
        <tr key={item.id}>

          {/* SKU */}
          <td>
            {item.sku}
          </td>

          {/* NAME */}
          <td>
            {item.username}
          </td>

          {/* CATEGORY */}
          <td>
            {item.category}
          </td>

          {/* STATUS */}
          <td>
            <span
              className={`status-badge ${
                item.status?.toLowerCase() || ""
              }`}
            >
              {item.status}
            </span>
          </td>

          {/* STOCK LEVEL */}
          <td>
           <CapacityBar
  current={Number(item.currentQuantity) || 0}
  minimum={Number(item.minimumThreshold) || 0}
  maxCapacity={Math.max(
    ...(items || []).map(
      (i) => Number(i.currentQuantity) || 0
    ),
    1
  )}
/>
          </td>

          {/* PRICE */}
          <td>
            ${Number(item.unitPrice || 0).toFixed(2)}
          </td>

          {/* ACTIONS */}
          <td>
            {isAdmin && (
              <div className="item-actions">

                <button
                  type="button"
                  className="btn-adjust"
                  onClick={() =>
                    setAdjustmentItem(item)
                  }
                >
                  Adjust
                </button>

                <button
                  type="button"
                  className="btn-edit"
                  onClick={() =>
                    handleEditItem(item)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn-delete"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  Delete
                </button>

              </div>
            )}
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>
      )}

      {/* ======================================
          STOCK ADJUSTMENT MODAL
      ====================================== */}

      {adjustmentItem && (
        <StockAdjustmentModal
          item={adjustmentItem}
          onClose={() =>
            setAdjustmentItem(null)
          }
        />
      )}

      {/* ======================================
          STOCK ITEM FORM
          
          IMPORTANT:
          StockItemForm expects `item`,
          NOT `editingItem`.
      ====================================== */}

      {editingItem !== undefined && (
        <StockItemForm
          item={editingItem}
          onClose={handleCloseForm}
        />
      )}

    </div>
  );
};

export default StockItemList;