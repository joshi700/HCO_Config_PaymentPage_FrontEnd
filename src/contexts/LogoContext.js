import React, { createContext, useContext, useState, useEffect } from 'react';

const LogoContext = createContext();

export const useLogoContext = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogoContext must be used within a LogoProvider');
  }
  return context;
};

export const LogoProvider = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [companyName, setCompanyName] = useState('ABC Company');

  // Load logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('merchantLogo');
    const savedCompanyName = localStorage.getItem('companyName');
    
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
    if (savedCompanyName) {
      setCompanyName(savedCompanyName);
    }
  }, []);

  // Save logo to localStorage whenever it changes
  const updateLogo = (newLogoUrl) => {
    setLogoUrl(newLogoUrl);
    if (newLogoUrl) {
      localStorage.setItem('merchantLogo', newLogoUrl);
    } else {
      localStorage.removeItem('merchantLogo');
    }
  };

  const updateCompanyName = (name) => {
    setCompanyName(name);
    if (name) {
      localStorage.setItem('companyName', name);
    } else {
      localStorage.removeItem('companyName');
    }
  };

  const clearLogo = () => {
    setLogoUrl('');
    localStorage.removeItem('merchantLogo');
  };

  return (
    <LogoContext.Provider
      value={{
        logoUrl,
        companyName,
        updateLogo,
        updateCompanyName,
        clearLogo,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
};
