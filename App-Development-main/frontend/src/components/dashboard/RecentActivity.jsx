import React from "react";

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  const recentActivities = activities.slice(0, 5);

  const formatMovementType = (type) => {
    if (!type) return "UNKNOWN";

    return String(type)
      .replace(/_/g, " ")
      .toUpperCase();
  };

  const getMovementClass = (type) => {
    if (!type) return "";

    return String(type)
      .toLowerCase()
      .replace(/\s+/g, "_");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="recent-activity">
      <h3>Recent Stock Movements</h3>

      <div className="activity-timeline">
        {recentActivities.map((activity, index) => {
          const movementType =
            activity.movementType || activity.type || "";

          const movementClass =
            getMovementClass(movementType);

          const quantity = Number(
            activity.quantityDelta ?? 0
          );

          const itemId =
            activity.stockItemId ??
            activity.itemId ??
            "-";

          return (
            <div
              className="activity-item"
              key={activity.id || index}
            >
              {/* Timeline dot */}
              <span
                className={`activity-type ${movementClass}`}
                aria-hidden="true"
              ></span>

              <div className="activity-details">

                {/* Movement type + date */}
                <div className="activity-header">

                  <span
                    className={`activity-badge ${movementClass}`}
                  >
                    {formatMovementType(
                      movementType
                    )}
                  </span>

                  <span className="activity-date">
                    {formatDate(
                      activity.movementDate
                    )}
                  </span>

                </div>

                {/* Item + quantity */}
                <div className="activity-description">
                  Item ID ({itemId}):{" "}
                  {quantity >= 0 ? "+" : ""}
                  {quantity} units
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;