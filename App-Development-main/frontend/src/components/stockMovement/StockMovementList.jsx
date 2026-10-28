// src/components/stockMovement/StockMovementList.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStockMovements } from "../../store/slices/stockMovementSlice";
import SearchFilterBar from "../common/SearchFilterBar";
import EmptyState from "../common/EmptyState";

const StockMovementList = () => {
  const dispatch = useDispatch();

  // IMPORTANT:
  // stockMovementSlice uses "items", not "movements"
  const {
    items = [],
    loading = false,
    error = null,
  } = useSelector(
    (state) =>
      state.stockMovements || {
        items: [],
        loading: false,
        error: null,
      }
  );

  const [filterType, setFilterType] = useState("");

  // Fetch stock movements when component mounts
  useEffect(() => {
    dispatch(fetchStockMovements());
  }, [dispatch]);

  const filterOptions = [
    {
      value: "INBOUND",
      label: "Inbound",
    },
    {
      value: "OUTBOUND",
      label: "Outbound",
    },
    {
      value: "ADJUSTMENT",
      label: "Adjustment",
    },
    {
      value: "REORDER_TRIGGERED",
      label: "Reorder Triggered",
    },
  ];

  // Filter movements based on selected type
  const filteredItems = items.filter((movement) => {
    if (!filterType) {
      return true;
    }

    const movementType =
      movement.movementType ||
      movement.type ||
      "";

    return movementType === filterType;
  });

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="list-page-container">
        <h1>Stock Movements</h1>

        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="list-page-container">
      <h1>Stock Movements</h1>

      <SearchFilterBar
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          message="No stock movements recorded yet."
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Item ID</th>
                <th>Type</th>
                <th>Delta</th>
                <th>New Quantity</th>
                <th>Reference PO</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((movement, index) => {
                // Support both possible property names
                const movementType =
                  movement.movementType ||
                  movement.type ||
                  "";

                const delta = Number(
                  movement.quantityDelta ??
                    movement.delta ??
                    0
                );

                // Specification:
                // Item ID = itemSku OR stockItemId
                const itemId =
                  movement.itemSku ||
                  movement.stockItemId ||
                  movement.itemId ||
                  "-";

                return (
                  <tr
                    key={
                      movement.id ||
                      `${itemId}-${movementType}-${index}`
                    }
                  >
                    {/* Date */}
                    <td>
                      {formatDate(
                        movement.movementDate
                      )}
                    </td>

                    {/* Item ID */}
                    <td>{itemId}</td>

                    {/* Movement Type */}
                    <td>
                      <span
                        className={`type-badge ${movementType.toLowerCase()}`}
                      >
                        {movementType}
                      </span>
                    </td>

                    {/* Delta */}
                    <td>
                      {delta > 0 ? "+" : ""}
                      {delta}
                    </td>

                    {/* New Quantity */}
                    <td>
                      {movement.newQuantity ??
                        movement.quantityAfter ??
                        "-"}
                    </td>

                    {/* Reference PO */}
                    <td>
                      {movement.referencePO ||
                        movement.referencePo ||
                        movement.purchaseOrderId ||
                        "-"}
                    </td>

                    {/* Notes */}
                    <td>
                      {movement.notes || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockMovementList;