import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoContext } from './contexts/LogoContext';
import Logo from './components/Logo';
import ImageUtils from './utils/ImageUtils';

function ConfigurationPage() {
  const navigate = useNavigate();
  const { logoUrl, companyName, updateLogo, updateCompanyName, clearLogo } = useLogoContext();
  
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState(logoUrl);
  const [tempCompanyName, setTempCompanyName] = useState(companyName);
  const [saveMessage, setSaveMessage] = useState('');
  const [imageInfo, setImageInfo] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  
  // JSON Payload state for Advanced Mode
  const [jsonPayload, setJsonPayload] = useState(`{
  "apiOperation": "INITIATE_CHECKOUT",
  "checkoutMode": "WEBSITE",
  "interaction": {
    "operation": "PURCHASE",
    "displayControl": {
      "billingAddress": "HIDE"
    },
    "merchant": { 
      "name": "JK Enterprises LLC",
      "url": "https://mastercard.com/"
    },
    "returnUrl": "${window.location.origin}/ReceiptPage"
  },
  "order": {
    "currency": "USD",
    "amount": "99.00",
    "id": "ORDER_PLACEHOLDER",
    "description": "Goods and Services"
  }
}`);
  const [jsonError, setJsonError] = useState(null);

  // API Configuration
  const [apiConfig, setApiConfig] = useState({
    merchantId: '',
    username: '',
    password: '',
    apiBaseUrl: 'https://mtf.gateway.mastercard.com',
    apiVersion: '73'
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('apiConfiguration');
    if (savedConfig) {
      try {
        setApiConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Error loading saved configuration:', e);
      }
    }
    
    // Load saved JSON payload
    const savedJsonPayload = localStorage.getItem('advancedJsonPayload');
    if (savedJsonPayload) {
      setJsonPayload(savedJsonPayload);
      // Validate loaded JSON
      try {
        JSON.parse(savedJsonPayload);
      } catch (e) {
        setJsonError(`Invalid JSON: ${e.message}`);
      }
    }
  }, []);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const validation = ImageUtils.validateImage(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      try {
        const base64 = await ImageUtils.fileToBase64(file);
        setLogoPreview(base64);
        
        const dimensions = await ImageUtils.getImageDimensions(base64);
        const specsCheck = ImageUtils.checkRecommendedSpecs(dimensions.width, dimensions.height);
        
        setImageInfo({
          name: file.name,
          size: ImageUtils.formatFileSize(file.size),
          dimensions: `${dimensions.width}×${dimensions.height}px`,
          type: file.type
        });
        
        setValidationMessage(specsCheck.message);
      } catch (error) {
        alert('Failed to process image. Please try another file.');
        console.error('Image processing error:', error);
      }
    }
  };

  const handleLogoUrlInput = async (url) => {
    setLogoPreview(url);
    setImageInfo(null);
    setValidationMessage('');
    
    if (url && ImageUtils.validateUrl(url)) {
      try {
        const dimensions = await ImageUtils.getImageDimensions(url);
        const specsCheck = ImageUtils.checkRecommendedSpecs(dimensions.width, dimensions.height);
        
        setImageInfo({
          name: url.split('/').pop() || 'logo',
          dimensions: `${dimensions.width}×${dimensions.height}px`,
          type: 'URL'
        });
        
        setValidationMessage(specsCheck.message);
      } catch (error) {
        setValidationMessage('⚠️ Unable to load image from URL.');
      }
    }
  };

  const handleSaveLogo = () => {
    if (logoPreview) {
      updateLogo(logoPreview);
      updateCompanyName(tempCompanyName);
      showSaveMessage('Logo and company name saved successfully!');
    }
  };

  const handleClearLogo = () => {
    clearLogo();
    setLogoPreview('');
    setImageInfo(null);
    setValidationMessage('');
    showSaveMessage('Logo cleared successfully!');
  };

  const handleApiConfigChange = (field, value) => {
    setApiConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveApiConfig = () => {
    localStorage.setItem('apiConfiguration', JSON.stringify(apiConfig));
    showSaveMessage('API configuration saved successfully!');
  };
  
  const handleJsonChange = (value) => {
    setJsonPayload(value);
    setJsonError(null);
    
    try {
      JSON.parse(value);
    } catch (e) {
      setJsonError(`Invalid JSON: ${e.message}`);
    }
  };
  
  const handleSaveJsonConfig = () => {
    if (jsonError) {
      alert('Please fix JSON errors before saving.');
      return;
    }
    localStorage.setItem('advancedJsonPayload', jsonPayload);
    showSaveMessage('Advanced JSON configuration saved successfully!');
  };

  const showSaveMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      backgroundColor: 'white',
      padding: '20px 40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    content: {
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '0 20px',
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#718096',
      marginBottom: '40px',
    },
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '2px solid #e2e8f0',
    },
    tab: {
      padding: '12px 24px',
      background: 'none',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      color: '#718096',
      transition: 'all 0.3s ease',
    },
    activeTab: {
      color: '#667eea',
      borderBottom: '3px solid #667eea',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a202c',
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#4a5568',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
    },
    logoPreview: {
      marginTop: '20px',
      padding: '30px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      border: '2px dashed #cbd5e0',
      textAlign: 'center',
    },
    logoImage: {
      maxWidth: '250px',
      maxHeight: '100px',
      objectFit: 'contain',
    },
    uploadButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      marginRight: '10px',
    },
    clearButton: {
      background: '#e53e3e',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    saveMessage: {
      padding: '16px',
      backgroundColor: '#c6f6d5',
      color: '#22543d',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: '600',
    },
    infoBox: {
      backgroundColor: '#ebf8ff',
      border: '1px solid #90cdf4',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
    },
    infoText: {
      fontSize: '14px',
      color: '#2c5282',
      margin: 0,
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
    },
    hiddenInput: {
      display: 'none',
    },
    textarea: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '13px',
      minHeight: '420px',
      resize: 'vertical',
      fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
      boxSizing: 'border-box',
      lineHeight: '1.5',
      backgroundColor: '#f8fafc',
    },
    textareaError: {
      borderColor: '#ef4444',
    },
    jsonError: {
      marginTop: '12px',
      padding: '12px',
      backgroundColor: '#fee2e2',
      border: '1px solid #ef4444',
      borderRadius: '6px',
      color: '#991b1b',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Logo size="medium" />
        <button 
          style={styles.backButton}
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </header>

      <div style={styles.content}>
        <h1 style={styles.title}>Configuration Settings</h1>
        <p style={styles.subtitle}>Manage your payment gateway settings and branding</p>

        {saveMessage && (
          <div style={styles.saveMessage}>
            ✓ {saveMessage}
          </div>
        )}

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'general' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('general')}
          >
            General & Branding
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'api' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('api')}
          >
            API Configuration
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'advanced' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced JSON
          </button>
        </div>

        {activeTab === 'general' && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Company Branding</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Company Name</label>
              <input
                type="text"
                style={styles.input}
                value={tempCompanyName}
                onChange={(e) => setTempCompanyName(e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company Logo</label>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '12px' }}>
                Upload your logo or provide a URL. Recommended size: 200x60px (PNG or JPG)
              </p>
              
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                style={styles.hiddenInput}
              />
              
              <button
                style={styles.uploadButton}
                onClick={() => document.getElementById('logo-upload').click()}
              >
                📁 Upload Logo
              </button>

              <div style={{ marginTop: '20px' }}>
                <label style={styles.label}>Or enter logo URL:</label>
                <input
                  type="url"
                  style={styles.input}
                  value={logoPreview}
                  onChange={(e) => handleLogoUrlInput(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {logoPreview && (
                <div style={styles.logoPreview}>
                  <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>
                    Logo Preview:
                  </p>
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    style={styles.logoImage}
                  />
                  
                  {imageInfo && (
                    <div style={{ marginTop: '16px', fontSize: '13px', color: '#4a5568' }}>
                      <p style={{ margin: '4px 0' }}><strong>File:</strong> {imageInfo.name}</p>
                      {imageInfo.size && <p style={{ margin: '4px 0' }}><strong>Size:</strong> {imageInfo.size}</p>}
                      <p style={{ margin: '4px 0' }}><strong>Dimensions:</strong> {imageInfo.dimensions}</p>
                    </div>
                  )}
                  
                  {validationMessage && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '10px', 
                      backgroundColor: validationMessage.includes('✓') ? '#d4edda' : '#fff3cd',
                      border: `1px solid ${validationMessage.includes('✓') ? '#c3e6cb' : '#ffeaa7'}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: validationMessage.includes('✓') ? '#155724' : '#856404'
                    }}>
                      {validationMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={styles.buttonGroup}>
              <button style={styles.uploadButton} onClick={handleSaveLogo}>
                💾 Save Branding
              </button>
              {logoPreview && (
                <button style={styles.clearButton} onClick={handleClearLogo}>
                  🗑️ Clear Logo
                </button>
              )}
            </div>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>ℹ️ Note:</strong> Your logo will appear on all pages including the shopping cart, 
                checkout page, payment page, and receipt page.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Payment Gateway Configuration</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Merchant ID</label>
              <input
                type="text"
                style={styles.input}
                value={apiConfig.merchantId}
                onChange={(e) => handleApiConfigChange('merchantId', e.target.value)}
                placeholder="Enter Merchant ID"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>API Username</label>
              <input
                type="text"
                style={styles.input}
                value={apiConfig.username}
                onChange={(e) => handleApiConfigChange('username', e.target.value)}
                placeholder="merchant.YOUR_MERCHANT_ID"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>API Password</label>
              <input
                type="password"
                style={styles.input}
                value={apiConfig.password}
                onChange={(e) => handleApiConfigChange('password', e.target.value)}
                placeholder="Enter API Password"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>API Base URL</label>
              <input
                type="url"
                style={styles.input}
                value={apiConfig.apiBaseUrl}
                onChange={(e) => handleApiConfigChange('apiBaseUrl', e.target.value)}
                placeholder="https://mtf.gateway.mastercard.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>API Version</label>
              <input
                type="text"
                style={styles.input}
                value={apiConfig.apiVersion}
                onChange={(e) => handleApiConfigChange('apiVersion', e.target.value)}
                placeholder="73"
              />
            </div>

            <button style={styles.uploadButton} onClick={handleSaveApiConfig}>
              💾 Save API Configuration
            </button>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>🔒 Security:</strong> API credentials are stored locally in your browser.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>⚙️ Advanced JSON Configuration</h2>
            
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>🔧 Advanced JSON Mode:</strong> Edit the complete JSON request payload for full control. 
                Use "ORDER_PLACEHOLDER" for the order ID - it will be auto-generated with a unique timestamp and random string.
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>JSON Request Payload</label>
              <textarea
                style={{
                  ...styles.textarea,
                  ...(jsonError ? styles.textareaError : {})
                }}
                value={jsonPayload}
                onChange={(e) => handleJsonChange(e.target.value)}
                placeholder="Enter complete JSON payload..."
              />
              {jsonError && (
                <div style={styles.jsonError}>
                  <strong>JSON Error:</strong> {jsonError}
                </div>
              )}
            </div>

            <button style={styles.uploadButton} onClick={handleSaveJsonConfig}>
              💾 Save JSON Configuration
            </button>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>ℹ️ Note:</strong> This JSON payload will be used for advanced checkout scenarios. 
                Make sure your JSON is valid before saving.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfigurationPage;
