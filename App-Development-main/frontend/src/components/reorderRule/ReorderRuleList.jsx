import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchReorderRules,
  evaluateRules,
  deleteReorderRule,
} from "../../store/reorderRuleSlice";

import SearchFilterBar from "../common/SearchFilterBar";
import EmptyState from "../common/EmptyState";
import ReorderRuleForm from "./ReorderRuleForm";

const ReorderRuleList = () => {
  const dispatch = useDispatch();

  const {
    rules = [],
    loading,
  } = useSelector(
    (state) => state.reorderRules
  );

  const { role } = useSelector(
    (state) => state.auth
  );

  const [showForm, setShowForm] =
    useState(false);

  const [editingRule, setEditingRule] =
    useState(null);

  const isAdmin =
    role === "ADMIN" || role === "MANAGER";

  useEffect(() => {
    dispatch(fetchReorderRules());
  }, [dispatch]);

  const handleEvaluate = async () => {
    try {
      await dispatch(evaluateRules()).unwrap();

      alert("Evaluation triggered successfully!");
    } catch (error) {
      console.error(
        "Evaluation failed:",
        error
      );
    }
  };

  const handleAdd = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reorder rule?"
    );

    if (confirmed) {
      dispatch(deleteReorderRule(id));
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Never";
    }

    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }

  return (
    <div className="list-page-container">
      <h1>Reorder Rules</h1>

      {/* Manual evaluation */}
      {isAdmin && (
        <button
          type="button"
          className="btn-secondary"
          onClick={handleEvaluate}
        >
          Run Auto-Reorder Check
        </button>
      )}

      {/* Add Rule */}
      {isAdmin && (
        <button
          type="button"
          onClick={handleAdd}
        >
          + Add Rule
        </button>
      )}

      {rules.length === 0 ? (
        <EmptyState
          message="No reorder rules configured."
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Stock Item ID</th>
                <th>Min Threshold</th>
                <th>Reorder Qty</th>
                <th>Pref. Supplier ID</th>
                <th>Auto Reorder</th>
                <th>Last Triggered</th>

                {isAdmin && (
                  <th>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    {rule.stockItemId}
                  </td>

                  <td>
                    {rule.minThreshold}
                  </td>

                  <td>
                    {rule.reorderQty}
                  </td>

                  <td>
                    {rule.preferredSupplierId ||
                      "None"}
                  </td>

                  <td>
                    {rule.autoReorder
                      ? "Enabled"
                      : "Disabled"}
                  </td>

                  <td>
                    {formatDate(
                      rule.lastTriggered
                    )}
                  </td>

                  {isAdmin && (
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(rule)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(rule.id)
                        }
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
        <ReorderRuleForm
          item={editingRule}
          onClose={() => {
            setShowForm(false);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
};

export default ReorderRuleList;