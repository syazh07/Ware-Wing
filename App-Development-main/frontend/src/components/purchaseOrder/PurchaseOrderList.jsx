import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPurchaseOrders,
  updateOrderStatus,
  deletePurchaseOrder,
} from "../../store/slices/purchaseOrderSlice";

import SearchFilterBar from "../common/SearchFilterBar";
import EmptyState from "../common/EmptyState";
import PurchaseOrderForm from "./PurchaseOrderForm";

const PurchaseOrderList = () => {
  const dispatch = useDispatch();

  const { items: orders, loading } = useSelector(
    (state) => state.purchaseOrders
  );

  const { role } = useSelector((state) => state.auth);

  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);

  const isAdmin = role === "ADMIN" || role === "MANAGER";

  // Fetch purchase orders on mount
  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const filterOptions = [
    {
      value: "DRAFT",
      label: "Draft",
    },
    {
      value: "SUBMITTED",
      label: "Submitted",
    },
    {
      value: "APPROVED",
      label: "Approved",
    },
    {
      value: "RECEIVED",
      label: "Received",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
    },
  ];

  // Filter orders
  const filteredItems = (orders || []).filter((order) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      (order.poNumber || "").toLowerCase().includes(search) ||
      (order.purchaseOrderNumber || "").toLowerCase().includes(search) ||
      (order.supplierName || "").toLowerCase().includes(search) ||
      (order.supplier?.name || "").toLowerCase().includes(search);

    const matchesStatus = !filterStatus || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  const handleSubmitOrder = async (id) => {
    try {
      await dispatch(
        updateOrderStatus({
          id,
          action: "submit",
        })
      ).unwrap();

      await dispatch(fetchPurchaseOrders()).unwrap();
    } catch (error) {
      console.error("Submit PO failed:", error);
    }
  };

  const handleApproveOrder = async (id) => {
    try {
      await dispatch(
        updateOrderStatus({
          id,
          action: "approve",
        })
      ).unwrap();

      await dispatch(fetchPurchaseOrders()).unwrap();
    } catch (error) {
      console.error("Approve PO failed:", error);
    }
  };

  const handleReceiveOrder = async (id) => {
    try {
      await dispatch(
        updateOrderStatus({
          id,
          action: "receive",
        })
      ).unwrap();

      await dispatch(fetchPurchaseOrders()).unwrap();
    } catch (error) {
      console.error("Receive PO failed:", error);
    }
  };

  // Delete draft
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this purchase order?"
    );

    if (confirmed) {
      dispatch(deletePurchaseOrder(id));
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="list-page-container">
      <h1>Purchase Orders</h1>

      {/* Status Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search purchase orders..."
        filterValue={filterStatus}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
        filterLabel="All Statuses"
      />

      {/* Create PO */}
      {isAdmin && (
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Create PO
        </button>
      )}

      {filteredItems.length === 0 ? (
        <EmptyState message="No purchase orders found." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier Name</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((order) => (
                <tr key={order.id}>
                  {/* PO Number */}
                  <td>{order.poNumber || order.purchaseOrderNumber || "-"}</td>

                  {/* Supplier */}
                  <td>{order.supplierName || order.supplier?.name || "-"}</td>

                  {/* Total Amount */}
                  <td>${Number(order.totalAmount || 0).toFixed(2)}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`status-badge ${order.status?.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Order Date */}
                  <td>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="action-buttons">
                    {isAdmin ? (
                      <>
                        {order.status === "DRAFT" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSubmitOrder(order.id)}
                            >
                              Submit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(order.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {order.status === "SUBMITTED" && (
                          <button
                            type="button"
                            onClick={() => handleApproveOrder(order.id)}
                          >
                            Approve
                          </button>
                        )}

                        {order.status === "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleReceiveOrder(order.id)}
                          >
                            Receive
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="view-only">View Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase Order Form */}
      {showForm && <PurchaseOrderForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default PurchaseOrderList;
