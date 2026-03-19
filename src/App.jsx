import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogoProvider } from './contexts/LogoContext';
import HomePage from './pages/HomePage';
import ReceiptPage from './pages/ReceiptPage';
import ConfigurationPage from './pages/ConfigurationPage';
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
