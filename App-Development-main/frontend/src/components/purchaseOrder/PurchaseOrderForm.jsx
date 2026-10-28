import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSuppliers,
} from "../../store/slices/supplierSlice";

import {
  fetchStockItems,
} from "../../store/slices/stockItemSlice";

import {
  createPurchaseOrder,
  fetchPurchaseOrders,
} from "../../store/slices/purchaseOrderSlice";
const PurchaseOrderForm = ({ onClose }) => {
  const dispatch = useDispatch();

 const { items: suppliers = [] } = useSelector(
  (state) => state.suppliers
);
console.log("PO FORM SUPPLIERS:", JSON.stringify(suppliers, null, 2));
  const { items = [] } = useSelector(
    (state) => state.stockItems
  );

  const [formData, setFormData] = useState({
    supplierId: "",
    expectedDelivery: "",
    lines: [],
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchStockItems());
  }, [dispatch]);

  const handleSupplierChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      supplierId: e.target.value,
    }));
  };

  const handleDeliveryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      expectedDelivery: e.target.value,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          stockItemId: "",
          orderedQuantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const lines = [...prev.lines];

      lines[index] = {
        ...lines[index],
        [field]: value,
      };

      // Automatically populate unit price
      if (field === "stockItemId") {
        const selectedItem = items.find(
          (item) =>
            String(item.id) === String(value)
        );

        lines[index].unitPrice =
          selectedItem?.unitPrice || 0;
      }

      return {
        ...prev,
        lines,
      };
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.lines.length === 0) {
    return;
  }

  try {
    await dispatch(createPurchaseOrder(formData)).unwrap();

    await dispatch(fetchPurchaseOrders()).unwrap();

    onClose();
  } catch (error) {
    console.error("Purchase order creation failed:", error);
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

        <h2>Create Purchase Order</h2>

        <form onSubmit={handleSubmit}>
          {/* Supplier */}
          <div className="form-group">
            <label htmlFor="supplierId">
              Supplier
            </label>

            <select
              id="supplierId"
              value={formData.supplierId}
              onChange={handleSupplierChange}
              required
            >
              <option value="">
                Select Supplier
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

          {/* Expected Delivery */}
          <div className="form-group">
            <label htmlFor="expectedDelivery">
              Expected Delivery
            </label>

            <input
              id="expectedDelivery"
              type="date"
              placeholder="YYYY-MM-DD"
              value={formData.expectedDelivery}
              onChange={handleDeliveryChange}
            />
          </div>

          {/* Order Lines */}
          <div className="order-lines">
            <h3>Order Lines</h3>

            <button
              type="button"
              onClick={addItem}
            >
              + Add Item
            </button>

            {formData.lines.map((line, index) => (
              <div
                className="order-line"
                key={index}
              >
                {/* Stock Item */}
                <div className="form-group">
                  <label>
                    Stock Item
                  </label>

                  <select
                    value={line.stockItemId}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "stockItemId",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">
                      Select Item
                    </option>

                    {items.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.sku} - {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordered Quantity */}
                <div className="form-group">
                  <label>
                    Ordered Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={line.orderedQuantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "orderedQuantity",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* Unit Price */}
                <div className="form-group">
                  <label>
                    Unit Price
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={line.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "unitPrice",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formData.lines.length === 0}
          >
            Create Draft PO
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;