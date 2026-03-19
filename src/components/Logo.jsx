import React from 'react';
import { useLogoContext } from '../contexts/LogoContext';

const Logo = ({ size = 'medium', style = {} }) => {
  const { logoUrl, companyName } = useLogoContext();

  const sizeConfig = {
    small: { height: '35px', fontSize: '18px', iconSize: '20px' },
    medium: { height: '50px', fontSize: '24px', iconSize: '28px' },
    large: { height: '70px', fontSize: '32px', iconSize: '38px' }
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', ...style }}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${companyName} Logo`}
          style={{ height: currentSize.height, width: 'auto', maxWidth: '200px', objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div style={{
          minWidth: currentSize.height, height: currentSize.height,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontWeight: 'bold',
          fontSize: currentSize.iconSize,
        }}>
          🛒
        </div>
      )}
      {!logoUrl && (
        <span style={{ fontSize: currentSize.fontSize, fontWeight: '700', color: '#1a202c', margin: 0 }}>
          {companyName}
        </span>
      )}
    </div>
  );
};

export default Logo;
