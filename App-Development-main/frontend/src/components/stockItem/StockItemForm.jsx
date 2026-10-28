// src/components/stockItem/StockItemForm.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createStockItem,
  updateStockItem,
  fetchStockItems,
} from "../../store/slices/stockItemSlice";
import { fetchSuppliers } from "../../store/slices/supplierSlice";

//import supplierService from "../../services/supplierService";

const StockItemForm = ({ item = null, onClose }) => {
  const dispatch = useDispatch();

  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // FORM DATA
  // ==========================================
  const { items: suppliers = [], loading: loadingSuppliers } = useSelector(
    (state) => state.suppliers
  );
  const [formData, setFormData] = useState({
    sku: item?.sku || "",

    // Backend calls this field `username`
    // but UI displays it as product name.
    name: item?.username || item?.name || "",

    category: item?.category || "",

    unitPrice: item?.unitPrice ?? "",

    status: item?.status || "ACTIVE",

    preferredSupplierId: item?.preferredSupplierId
      ? String(item.preferredSupplierId)
      : "",
  });

  // ==========================================
  // LOAD SUPPLIERS
  // ==========================================

  useEffect(() => {
  dispatch(fetchSuppliers());
}, [dispatch]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!formData.sku.trim()) {
      setError("SKU is required.");

      return;
    }

    if (!formData.name.trim()) {
      setError("Product name is required.");

      return;
    }

    if (!formData.preferredSupplierId) {
      setError("Please select a preferred supplier.");

      return;
    }

    // ------------------------------------------
    // BUILD BACKEND PAYLOAD
    // ------------------------------------------

    const payload = {
      // Required
      sku: formData.sku.trim(),

      // Backend expects username
      username: formData.name.trim(),

      category: formData.category.trim(),

      // ----------------------------------------
      // Preserve existing values while editing.
      // Use defaults when creating.
      // ----------------------------------------

      currentQuantity: item?.currentQuantity ?? 0,

      unit: item?.unit || "PCS",

      minimumThreshold: item?.minimumThreshold ?? 0,

      reorderQuantity: item?.reorderQuantity ?? 1,

      unitPrice: Number(formData.unitPrice) || 0,

      status: formData.status,

      preferredSupplierId: Number(formData.preferredSupplierId),

      autoReorderEnabled: item?.autoReorderEnabled ?? false,
    };

    console.log("Stock Item Payload:", payload);

    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    try {
      setIsSubmitting(true);

      if (item) {
        // ======================================
        // UPDATE EXISTING ITEM
        // ======================================

        await dispatch(
          updateStockItem({
            id: item.id,
            dto: payload,
          })
        ).unwrap();
      } else {
        // ======================================
        // CREATE NEW ITEM
        // ======================================

        await dispatch(createStockItem(payload)).unwrap();
      }

      // ========================================
      // VERY IMPORTANT
      //
      // Backend returns only:
      //
      // "StockItem created successfully."
      //
      // Therefore fetch the complete list again.
      //
      // `await` ensures the GET finishes before
      // the modal is closed.
      // ========================================

      await dispatch(fetchStockItems()).unwrap();

      setSuccessMessage(
        item
          ? "Stock item updated successfully."
          : "Stock item created successfully."
      );
    } catch (err) {
      console.error("Stock item operation failed:", err);

      setError(
        typeof err === "string"
          ? err
          : err?.response?.data?.message ||
              err?.message ||
              "Failed to save stock item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
        >
          ×
        </button>

        {/* TITLE */}
        <h2>{item ? "Edit Stock Item" : "Create Stock Item"}</h2>

        <form onSubmit={handleSubmit}>
          {/* ==================================
              SKU
          ================================== */}

          <div className="form-group">
            <label htmlFor="sku">SKU</label>

            <input
              id="sku"
              type="text"
              name="sku"
              placeholder="e.g., SKU-1001"
              value={formData.sku}
              onChange={handleChange}
              disabled={!!item || isSubmitting}
              required
            />
          </div>

          {/* ==================================
              PRODUCT NAME
          ================================== */}

          <div className="form-group">
            <label htmlFor="name">Product Name</label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* ==================================
              CATEGORY
          ================================== */}

          <div className="form-group">
            <label htmlFor="category">Category</label>

            <input
              id="category"
              type="text"
              name="category"
              placeholder="e.g., Electronics"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* ==================================
              UNIT PRICE
          ================================== */}

          <div className="form-group">
            <label htmlFor="unitPrice">Unit Price</label>

            <input
              id="unitPrice"
              type="number"
              name="unitPrice"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* ==================================
              STATUS
          ================================== */}

          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="ACTIVE">Active</option>

              <option value="INACTIVE">Inactive</option>

              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>

          {/* ==================================
              PREFERRED SUPPLIER
          ================================== */}

          <div className="form-group">
            <label htmlFor="preferredSupplierId">Preferred Supplier</label>

            <select
              id="preferredSupplierId"
              name="preferredSupplierId"
              value={formData.preferredSupplierId}
              onChange={handleChange}
              disabled={loadingSuppliers || isSubmitting}
              required
            >
              <option value="">
                {loadingSuppliers
                  ? "Loading suppliers..."
                  : "Select a supplier"}
              </option>

              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name ||
                    supplier.supplierName ||
                    supplier.username ||
                    `Supplier ${supplier.id}`}
                </option>
              ))}
            </select>
          </div>
          {/* ==================================
    SUCCESS / ERROR
================================== */}

          {successMessage && (
            <div className="form-success">{successMessage}</div>
          )}
          {/* ==================================
              ERROR
          ================================== */}

          {error && <div className="form-error">{error}</div>}

          {/* ==================================
              SUBMIT
          ================================== */}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? item
                ? "Updating..."
                : "Creating..."
              : item
              ? "Update Stock Item"
              : "Create Stock Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockItemForm;
