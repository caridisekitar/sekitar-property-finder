import React from 'react';

const HandshakeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125A2.625 2.625 0 0012 4.875z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.125V21.75m0-11.625V4.875m0 5.25H3.375M12 10.125h8.625" />
    </svg>
);

export default HandshakeIcon;
