import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { createStockMovement } from "../../store/slices/stockMovementSlice";
import { fetchStockItems } from "../../store/slices/stockItemSlice";

const StockAdjustmentModal = ({ item, onClose }) => {
  const dispatch = useDispatch();

  const [movementType, setMovementType] = useState("ADJUSTMENT");
  const [quantityDelta, setQuantityDelta] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuantity = Number(
    item?.currentQuantity ?? item?.quantity ?? item?.current ?? 0
  );

  const delta = Number(quantityDelta || 0);

  const resultingQuantity = currentQuantity + delta;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (delta === 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await dispatch(
        createStockMovement({
          stockItemId: item.id,
          movementType,
          quantityDelta: delta,
          notes,
        })
      ).unwrap();

      // Refresh stock quantities
      dispatch(fetchStockItems());

      onClose();
    } catch (error) {
      console.error("Stock adjustment failed:", error);
    } finally {
      setIsSubmitting(false);
    }
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

        <h2>Adjust Stock: {item.name}</h2>

        <form onSubmit={handleSubmit}>
          {/* Movement Type */}
          <div className="form-group">
            <label htmlFor="movementType">
              Movement Type
            </label>

            <select
              id="movementType"
              value={movementType}
              onChange={(e) =>
                setMovementType(e.target.value)
              }
            >
              <option value="ADJUSTMENT">
                Manual Adjustment
              </option>

              <option value="OUTBOUND">
                Outbound / Removal
              </option>

              <option value="INBOUND">
                Inbound / Addition
              </option>
            </select>
          </div>

          {/* Quantity Delta */}
          <div className="form-group">
            <label htmlFor="quantityDelta">
              Quantity Delta
            </label>

            <input
              id="quantityDelta"
              type="number"
              placeholder="e.g., -5 or 10"
              value={quantityDelta}
              onChange={(e) =>
                setQuantityDelta(e.target.value)
              }
              required
            />
          </div>

          {/* Resulting Quantity */}
          <div className="resulting-quantity">
            Resulting Quantity: {resultingQuantity}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              placeholder="Reason for adjustment (e.g., Damaged item, Stock count)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || delta === 0}
          >
            {isSubmitting
              ? "Submitting..."
              : "Confirm Adjustment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;