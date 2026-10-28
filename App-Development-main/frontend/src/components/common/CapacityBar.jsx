import React from "react";

const CapacityBar = ({
  current = 0,
  minimum = 0,
  maxCapacity = 1,
}) => {
  const quantity = Number(current) || 0;
  const threshold = Number(minimum) || 0;
  const max = Number(maxCapacity) || 1;

  const percentage = Math.min(
    (quantity / max) * 100,
    100
  );

  const isLow =
    threshold > 0 && quantity <= threshold;

  const isMedium =
    threshold > 0 &&
    quantity > threshold &&
    quantity <= threshold * 1.5;

  let color = "#10b981";

  if (isLow) {
    color = "#ef4444";
  } else if (isMedium) {
    color = "#f59e0b";
  }

  return (
    <div className="capacity-bar-container">
      <div className="capacity-bar">
        <div
          className="capacity-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div
        className="capacity-bar-text"
        style={{ color }}
      >
        {quantity}
      </div>
    </div>
  );
};

export default CapacityBar;