import React from 'react';

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25V7.5a2.25 2.25 0 00-2.25-2.25h-12A2.25 2.25 0 003.75 7.5v6.75m16.5 0v2.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-2.25m16.5 0h-16.5" />
  </svg>
);

export default BriefcaseIcon;
