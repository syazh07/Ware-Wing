import React from "react";

const StatCards = ({ stats = [] }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="stat-cards-container">
      {stats.map((stat, index) => (
        <div
          className="stat-card"
          key={index}
        >
          <div className="stat-card-label">
            {stat.label}
          </div>

          <div className="stat-card-value">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;