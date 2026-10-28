import React from "react";

const EmptyState = ({
  message,
  ctaText = null,
  onCtaClick,
}) => {
  return (
    <div className="empty-state">
      {/* SVG Icon */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
        />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>

      <p className="empty-state-message">
        {message}
      </p>

      {ctaText && onCtaClick && (
        <button
          type="button"
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;