
import React from 'react';

const SekitarLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img src="/images/LogoHeader.svg" alt="Sekitar Logo" width={50} height={50} className={className} />
);

export default SekitarLogo;
