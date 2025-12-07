import React from 'react';

const CrosshairIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v.01M12 20v.01M4 12h.01M20 12h.01M12 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
     <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12a4 4 0 110-8 4 4 0 010 8z"
    />
  </svg>
);

export default CrosshairIcon;
