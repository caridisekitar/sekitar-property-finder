
import React from 'react';

const HouseLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img src="/images/logo-house.svg" alt="Sekitar Logo" width={50} height={50} className={className} />
);

export default HouseLogo;
