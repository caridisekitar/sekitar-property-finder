import React from 'react';

const NotFoundIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 400 300"
    className={className || "w-full max-w-sm h-auto"}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base for illustration */}
    <path d="M50 280 H350" stroke="#333333" strokeWidth="2" fill="none" />

    {/* Plant */}
    <path d="M300 280 V250" stroke="#333333" strokeWidth="2" />
    <ellipse cx="300" cy="245" rx="15" ry="5" fill="#333333" />
    <path d="M300 260 C 315 250, 315 230, 300 220" stroke="#333333" strokeWidth="2" fill="none" />
    <path d="M300 260 C 285 250, 285 230, 300 220" stroke="#333333" strokeWidth="2" fill="none" />
    
    {/* Browser Window */}
    <rect x="120" y="80" width="180" height="120" rx="10" fill="#E9F2FC" stroke="#B0C4DE" strokeWidth="2" />
    <circle cx="135" cy="95" r="4" fill="#FF5F56" />
    <circle cx="150" cy="95" r="4" fill="#FFBD2E" />
    <circle cx="165" cy="95" r="4" fill="#27C93F" />

    {/* 404 Text */}
    <text x="155" y="155" fontFamily="Manrope, sans-serif" fontSize="60" fontWeight="bold" fill="#333333">404</text>
    
    {/* Character */}
    <circle cx="100" cy="180" r="10" fill="#333333" />
    <path d="M100 190 V240" stroke="#333333" strokeWidth="2" />
    <rect x="85" y="200" width="30" height="40" fill="#333333" />
    <path d="M100 240 L90 280" stroke="#333333" strokeWidth="2" />
    <path d="M100 240 L110 280" stroke="#333333" strokeWidth="2" />
    <path d="M100 205 L130 180" stroke="#333333" strokeWidth="2" />

    {/* Decorative elements */}
    <text x="210" y="200" fontFamily="Manrope, sans-serif" fontSize="20" fontWeight="bold" fill="#333333">#</text>
    <circle cx="240" cy="180" r="15" stroke="#333333" strokeWidth="2" fill="none"/>
    <path d="M232 172 L248 188 M232 188 L248 172" stroke="#333333" strokeWidth="2" />

  </svg>
);

export default NotFoundIllustration;