import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchStockItems,
} from "../../store/stockItemSlice";

import {
  fetchSuppliers,
} from "../../store/supplierSlice";

import {
  createReorderRule,
  updateReorderRule,
} from "../../store/reorderRuleSlice";

const ReorderRuleForm = ({
  item = null,
  onClose,
}) => {
  const dispatch = useDispatch();

  const { items = [] } = useSelector(
    (state) => state.stockItems
  );

  const { suppliers = [] } = useSelector(
    (state) => state.suppliers
  );

  const [formData, setFormData] = useState({
    stockItemId: item?.stockItemId || "",
    minThreshold: item?.minThreshold || "",
    reorderQty: item?.reorderQty || "",
    preferredSupplierId:
      item?.preferredSupplierId || "",
    autoReorder: item?.autoReorder || false,
  });

  useEffect(() => {
    dispatch(fetchStockItems());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (item) {
      dispatch(
        updateReorderRule(
          item.id,
          formData
        )
      );
    } else {
      dispatch(
        createReorderRule(formData)
      );
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2>
          {item
            ? "Update Rule"
            : "Create Rule"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Stock Item */}
          <div className="form-group">
            <label htmlFor="stockItemId">
              Stock Item
            </label>

            <select
              id="stockItemId"
              name="stockItemId"
              value={formData.stockItemId}
              onChange={handleChange}
              required
              disabled={!!item}
            >
              <option value="">
                Select Stock Item
              </option>

              {items.map((stockItem) => (
                <option
                  key={stockItem.id}
                  value={stockItem.id}
                >
                  {stockItem.sku} -{" "}
                  {stockItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min Threshold */}
          <div className="form-group">
            <label htmlFor="minThreshold">
              Min Threshold
            </label>

            <input
              id="minThreshold"
              type="number"
              name="minThreshold"
              value={formData.minThreshold}
              onChange={handleChange}
              required
            />
          </div>

          {/* Reorder Quantity */}
          <div className="form-group">
            <label htmlFor="reorderQty">
              Reorder Qty
            </label>

            <input
              id="reorderQty"
              type="number"
              name="reorderQty"
              value={formData.reorderQty}
              onChange={handleChange}
              required
            />
          </div>

          {/* Preferred Supplier */}
          <div className="form-group">
            <label htmlFor="preferredSupplierId">
              Preferred Supplier
            </label>

            <select
              id="preferredSupplierId"
              name="preferredSupplierId"
              value={
                formData.preferredSupplierId
              }
              onChange={handleChange}
            >
              <option value="">
                No Preference
              </option>

              {suppliers.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Reorder */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="autoReorder"
                checked={formData.autoReorder}
                onChange={handleChange}
              />

              Enable Auto-Reorder Evaluation
            </label>
          </div>

          {/* Submit */}
          <button type="submit">
            {item
              ? "Update Rule"
              : "Create Rule"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReorderRuleForm;