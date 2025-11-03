
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogoProvider } from './contexts/LogoContext';
import HomePage from './HomePage';
import ReceiptPage from './ReceiptPage';
import ConfigurationPage from './ConfigurationPage';
import './App.css';

function App() {
  return (
    <LogoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ReceiptPage" element={<ReceiptPage />} />
          <Route path="/config" element={<ConfigurationPage />} />
        </Routes>
      </Router>
    </LogoProvider>
  );
}

export default App;
