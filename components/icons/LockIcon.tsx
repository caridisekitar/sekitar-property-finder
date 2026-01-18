import React from 'react';

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
  <path
    d="M6 10V8a6 6 0 1 1 12 0v2"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
  />
  <rect
    x="4"
    y="10"
    width="16"
    height="10"
    rx="2"
    stroke="currentColor"
    stroke-width="2"
  />
  <circle cx="12" cy="15" r="1.5" fill="currentColor" />
</svg>
);

export default LockIcon;



