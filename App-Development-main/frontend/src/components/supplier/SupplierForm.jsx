import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  createSupplier,
  updateSupplier,
  fetchSuppliers,
} from "../../store/slices/supplierSlice";

const SupplierForm = ({ item = null, onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: item?.name || "",
    contactEmail: item?.contactEmail || "",
    phone: item?.phone || "",
    leadTimeDays: item?.leadTimeDays || "",
    status: item?.status || "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (item) {
      await dispatch(
        updateSupplier({
          id: item.id,
          dto: {
            ...formData,
            leadTimeDays: Number(formData.leadTimeDays),
          },
        })
      ).unwrap();
    } else {
      await dispatch(
        createSupplier({
          ...formData,
          leadTimeDays: Number(formData.leadTimeDays),
        })
      ).unwrap();
    }

    // Backend returns only a success message,
    // so fetch the actual supplier list again.
    await dispatch(fetchSuppliers()).unwrap();

    onClose();
  } catch (error) {
    console.error("Supplier operation failed:", error);
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

        <h2>
          {item
            ? "Update Supplier"
            : "Create Supplier"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">
              Company Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="contactEmail">
              Contact Email
            </label>

            <input
              id="contactEmail"
              type="email"
              name="contactEmail"
              placeholder="contact@supplier.com"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="+1..."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Lead Time */}
          <div className="form-group">
            <label htmlFor="leadTimeDays">
              Lead Time (Days)
            </label>

            <input
              id="leadTimeDays"
              type="number"
              name="leadTimeDays"
              min="1"
              value={formData.leadTimeDays}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit">
            {item
              ? "Update Supplier"
              : "Create Supplier"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;