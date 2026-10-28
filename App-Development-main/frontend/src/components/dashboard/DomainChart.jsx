import React from "react";

const DomainChart = ({ data = [], title }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(
    ...data.map((item) => Number(item.value) || 0)
  );

  return (
    <div className="domain-chart-card">
      <h3>{title}</h3>

      <div className="chart-container">
        {data.map((item, index) => {
          const value = Number(item.value) || 0;

          const percentage =
            maxValue > 0
              ? (value / maxValue) * 100
              : 0;

          return (
            <div
              className="chart-bar-wrapper"
              key={index}
            >
              <div
                className="chart-bar"
                style={{
                  height: `${percentage}%`,
                }}
                title={`${item.label}: ${value}`}
              />

              <div className="chart-bar-label">
                {item.label}
              </div>

              <div className="chart-bar-value">
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DomainChart;