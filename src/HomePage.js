import React, { useState, useEffect, useCallback } from 'react';
import ShoppingCart from './ShoppingCart';
import Logo from './components/Logo';

function HomePage() {
  // State Management
  const [currentView, setCurrentView] = useState('cart'); // 'cart', 'config', 'embedded'
  const [checkoutMode, setCheckoutMode] = useState(null); // 'hosted', 'embedded'
  const [paymentSession, setPaymentSession] = useState(null);
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [scriptKey, setScriptKey] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastSessionId, setLastSessionId] = useState(null);
  
  // Application configuration - no environment variables
  const API_BASE_URL = 'https://hco-config-payment-page-backend.vercel.app'
  //'https://hco-configurable-embedded-backend.vercel.app';
  const ENABLE_ADVANCED_MODE = true;
  const ENABLE_CONFIG_SAVE = true;
  const API_TIMEOUT = 30000;

  // Configuration for API credentials with hardcoded defaults
  const [config, setConfig] = useState({
    merchantId: 'TESTMIDtesting00',
    username: 'merchant.TESTMIDtesting00',
    password: '',
    apiBaseUrl: 'https://mtf.gateway.mastercard.com',
    apiVersion: '73'
  });

  // Order configuration with hardcoded defaults
  const [orderConfig, setOrderConfig] = useState({
    currency: 'USD',
    amount: '99.00',
    description: 'Goods and Services',
    merchantName: 'ABC Enterprises LLC',
    merchantUrl: 'https://microsoft.com/',
    returnUrl: `${window.location.origin}/ReceiptPage`
  });

  const [useAdvancedMode, setUseAdvancedMode] = useState(true); // Changed to true - start in Advanced mode by default
  const [showApiTest, setShowApiTest] = useState(false);

  // JSON payload for advanced mode with hardcoded defaults
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
    "currency": "EUR",
    "amount": "99.00",
    "id": "ORDER_PLACEHOLDER",
    "description": "Goods and Services"
  }
}`);

  const [jsonError, setJsonError] = useState(null);

  // Load API configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('apiConfiguration');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prevConfig => ({
          ...prevConfig,
          ...parsedConfig
        }));
      } catch (e) {
        console.error('Error loading API configuration:', e);
      }
    }
  }, []);

  // Connection check on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Connection check function
  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  // Load/reload Mastercard Checkout script
  useEffect(() => {
    const loadCheckoutScript = () => {
      const existingScript = document.querySelector('script[src*="checkout.min.js"]');
      if (existingScript) {
        existingScript.remove();
        delete window.Checkout;
      }

      const script = document.createElement('script');
      script.src = `${config.apiBaseUrl}/static/checkout/checkout.min.js`;
      script.async = true;
      script.onload = () => {
        setIsCheckoutReady(true);
      };
      script.onerror = () => {
        console.error('Failed to load checkout script');
        setError('Failed to load payment system. Please check your API Base URL and try again.');
        setIsCheckoutReady(false);
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    const cleanup = loadCheckoutScript();
    return cleanup;
  }, [scriptKey, config.apiBaseUrl]);

  // Configure checkout when script is loaded and session is available
  useEffect(() => {
    if (isCheckoutReady && window.Checkout && paymentSession) {
      try {
        setTimeout(() => {
          const configObj = {
            session: {
              id: paymentSession
            }
          };
          
          window.Checkout.configure(configObj);
          
          // Only show payment page for hosted mode
          if (checkoutMode === 'hosted') {
            setTimeout(() => {
              try {
                window.Checkout.showPaymentPage();
              } catch (showError) {
                console.error('Error showing payment page:', showError);
                setError('Failed to display payment page: ' + showError.message);
              }
            }, 500);
          }
          // Embedded mode is handled by the separate useEffect
          
        }, 100);
        
      } catch (configError) {
        console.error('Error configuring checkout:', configError);
        setError('Failed to configure payment system: ' + configError.message);
      }
    }
  }, [isCheckoutReady, paymentSession, checkoutMode]);

  // Display embedded form when view changes to embedded
  useEffect(() => {
    if (currentView === 'embedded' && isCheckoutReady && window.Checkout && paymentSession) {
      setTimeout(() => {
        try {
          const embeddedElement = document.getElementById('hco-embedded');
          if (!embeddedElement) {
            throw new Error('Embedded container element not found');
          }
          
          window.Checkout.showEmbeddedPage('#hco-embedded');
          
        } catch (showError) {
          console.error('Error showing embedded page:', showError);
          setError('Failed to display embedded payment form: ' + showError.message);
          setCurrentView('cart');
          setPaymentSession(null);
        }
      }, 600); // Wait for configuration to complete
    }
  }, [currentView, isCheckoutReady, paymentSession]);
  
  // Save configuration to localStorage if enabled
  const saveConfigToStorage = useCallback((newConfig, newOrderConfig) => {
    if (ENABLE_CONFIG_SAVE) {
      try {
        localStorage.setItem('mastercardConfig', JSON.stringify(newConfig));
        localStorage.setItem('mastercardOrderConfig', JSON.stringify(newOrderConfig));
        localStorage.setItem('mastercardConfigTimestamp', Date.now().toString());
        setSuccess('Configuration saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (e) {
        // Silent failure for localStorage
      }
    }
  }, [ENABLE_CONFIG_SAVE]);

  // Load configuration from localStorage if available
  useEffect(() => {
    if (ENABLE_CONFIG_SAVE) {
      try {
        const savedConfig = localStorage.getItem('mastercardConfig');
        const savedOrderConfig = localStorage.getItem('mastercardOrderConfig');
        const timestamp = localStorage.getItem('mastercardConfigTimestamp');
        
        // Check if saved config is not too old (24 hours)
        const isConfigFresh = timestamp && (Date.now() - parseInt(timestamp)) < (24 * 60 * 60 * 1000);
        
        if (savedConfig && isConfigFresh) {
          const parsed = JSON.parse(savedConfig);
          setConfig(prevConfig => ({ ...prevConfig, ...parsed }));
        }
        
        if (savedOrderConfig && isConfigFresh) {
          const parsed = JSON.parse(savedOrderConfig);
          setOrderConfig(prevConfig => ({ ...prevConfig, ...parsed }));
        }
      } catch (e) {
        // Clear corrupted data
        localStorage.removeItem('mastercardConfig');
        localStorage.removeItem('mastercardOrderConfig');
        localStorage.removeItem('mastercardConfigTimestamp');
      }
    }
  }, [ENABLE_CONFIG_SAVE]);

  // Handle config changes with automatic username generation
  const handleConfigChange = useCallback((field, value) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Auto-generate username when merchant ID changes
      if (field === 'merchantId') {
        updated.username = `merchant.${value}`;
      }
      
      return updated;
    });
    
    // Clear errors when user makes changes
    if (error) setError(null);
  }, [error]);

  // Handle order config changes
  const handleOrderConfigChange = useCallback((field, value) => {
    setOrderConfig(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      return updated;
    });
    
    // Clear errors when user makes changes
    if (error) setError(null);
  }, [error]);

  // Handle JSON payload changes with validation
  const handleJsonChange = useCallback((value) => {
    setJsonPayload(value);
    setJsonError(null);
    
    try {
      JSON.parse(value);
    } catch (e) {
      setJsonError(`Invalid JSON: ${e.message}`);
    }
  }, []);

  // Reset to hardcoded defaults
  const resetToDefaults = useCallback(() => {
    setConfig({
      merchantId: 'TESTMIDtesting00',
      username: 'merchant.TESTMIDtesting00',
      password: '',
      apiBaseUrl: 'https://mtf.gateway.mastercard.com',
      apiVersion: '73'
    });
    
    setOrderConfig({
      currency: 'USD',
      amount: '99.00',
      description: 'Goods and Services',
      merchantName: 'ABC Enterprises LLC',
      merchantUrl: 'https://microsoft.com/',
      returnUrl: `${window.location.origin}/ReceiptPage`
    });

    // Update JSON payload
    setJsonPayload(`{
  "apiOperation": "INITIATE_CHECKOUT",
  "checkoutMode": "WEBSITE",
  "interaction": {
    "operation": "PURCHASE",
    "merchant": { 
      "name": "ABC Enterprises LLC",
      "url": "https://microsoft.com/"
    },
    "returnUrl": "${window.location.origin}/ReceiptPage"
  },
  "order": {
    "currency": "EUR",
    "amount": "99.00",
    "id": "ORDER_PLACEHOLDER",
    "description": "Goods and Services"
  }
}`);

    // Clear stored configuration
    if (ENABLE_CONFIG_SAVE) {
      localStorage.removeItem('mastercardConfig');
      localStorage.removeItem('mastercardOrderConfig');
      localStorage.removeItem('mastercardConfigTimestamp');
    }

    setError(null);
    setSuccess('Reset to default configuration!');
    setTimeout(() => setSuccess(null), 3000);
  }, [ENABLE_CONFIG_SAVE]);

  // Test API connection
  const testApiConnection = async () => {
    try {
      setIsLoadingSession(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/test-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
        timeout: API_TIMEOUT
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('API connection test successful!');
      } else {
        throw new Error(data.error || 'API test failed');
      }
    } catch (error) {
      setError(`API Test Failed: ${error.message}`);
    } finally {
      setIsLoadingSession(false);
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  // Generate order ID and update JSON
  const updateJsonWithOrderId = (json) => {
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return json.replace('"ORDER_PLACEHOLDER"', `"${orderId}"`);
  };

  // Validate and parse JSON payload
  const getValidatedPayload = useCallback(() => {
    if (useAdvancedMode) {
      try {
        const updatedJson = updateJsonWithOrderId(jsonPayload);
        const parsed = JSON.parse(updatedJson);
        
        // Ensure required fields are present
        if (!parsed.apiOperation) {
          throw new Error('apiOperation is required');
        }
        if (!parsed.order || !parsed.order.amount) {
          throw new Error('order.amount is required');
        }
        if (!parsed.order.currency) {
          throw new Error('order.currency is required');
        }
        
        return parsed;
      } catch (e) {
        throw new Error(`JSON Validation Error: ${e.message}`);
      }
    } else {
      // Use simple form mode
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payload = {
        "apiOperation": "INITIATE_CHECKOUT",
        "checkoutMode": "WEBSITE",
        "interaction": {
          "operation": "PURCHASE",
          "merchant": { 
            "name": orderConfig.merchantName,
            "url": orderConfig.merchantUrl
          },
          "returnUrl": orderConfig.returnUrl
        },
        "order": {
          "currency": orderConfig.currency,
          "amount": orderConfig.amount,
          "id": orderId,
          "description": orderConfig.description
        }
      };
      
      return payload;
    }
  }, [useAdvancedMode, jsonPayload, orderConfig]);

  // Function to call the API
  const getSessionId = async () => {
    setIsLoadingSession(true);
    setError(null);
    
    try {
      // Validate payload
      const validatedPayload = getValidatedPayload();
      
      // Store amount for receipt page
      if (ENABLE_CONFIG_SAVE) {
        const amount = useAdvancedMode 
          ? validatedPayload.order?.amount || '99.00'
          : orderConfig.amount;
        localStorage.setItem('lastOrderAmount', amount);
      }
      
      const requestBody = {
        ...config, // Include auth config
        ...validatedPayload // Spread the payload directly
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || `HTTP ${response.status}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.sessionId) {
        setLastSessionId(data.sessionId);
        return data.sessionId;
      } else if (typeof data === 'string') {
        setLastSessionId(data);
        return data; // Fallback for direct session ID response
      } else {
        throw new Error('Invalid response format: missing sessionId');
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection and try again');
      }
      console.error('Error fetching session ID:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoadingSession(false);
    }
  };

  const openEmbeddedCheckout = async () => {
    try {
      setError(null);
      setIsLoadingSession(true);
      
      // Clear previous session
      setPaymentSession(null);
      if (typeof(Storage) !== "undefined") {
        sessionStorage.clear();
      }
      
      // Force script reload
      setScriptKey(prev => prev + 1);
      
      // Small delay for cleanup and to ensure React state is fully updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get new session
      const sessionId = await getSessionId();
      const trimmedSessionId = sessionId.trim();
      
      setPaymentSession(trimmedSessionId);
      setCurrentView('embedded');
      setCheckoutMode('embedded');
      
    } catch (error) {
      console.error('Failed to open embedded checkout:', error);
      setError('Failed to initialize embedded checkout: ' + error.message);
      setCurrentView('cart');
    } finally {
      setIsLoadingSession(false);
    }
  };
  
  const openCheckoutPage = async () => {
    try {
      setPaymentSession(null);
      setError(null);
      setIsCheckoutReady(false);
      setIsLoadingSession(true);
      
      if (typeof(Storage) !== "undefined") {
        sessionStorage.clear();
      }
      
      setScriptKey(prev => prev + 1);
      
      // Small delay to ensure React state is fully updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const sessionId = await getSessionId();
      const trimmedSessionId = sessionId.trim();
      
      setPaymentSession(trimmedSessionId);
      setCheckoutMode('hosted');
      
      // Show payment page will happen in the useEffect
      
    } catch (error) {
      console.error('Failed to open checkout page:', error);
      setError('Failed to initialize checkout: ' + error.message);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const styles = {
    // ... (keeping all your existing styles, adding new ones below)
    app: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    
    // NEW STYLES FOR MULTI-VIEW
    configOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    configModal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
    configHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 30px',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 10,
    },
    configLogoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flex: 1,
    },
    configLogo: {
      height: '40px',
      width: 'auto',
      maxWidth: '120px',
      objectFit: 'contain',
    },
    logoFallback: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoIcon: {
      fontSize: '24px',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: '#718096',
      padding: '0',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      transition: 'all 0.3s',
    },
    configContent: {
      padding: '30px',
    },
    configActions: {
      padding: '20px 30px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'white',
    },
    backButton: {
      padding: '12px 24px',
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    embeddedContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
    },
    embeddedHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    embeddedHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    embeddedLogo: {
      height: '45px',
      width: 'auto',
      maxWidth: '130px',
      objectFit: 'contain',
    },
    embeddedTitle: {
      margin: 0,
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a202c',
    },
    embeddedContent: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minHeight: '600px',
    },
    errorBanner: {
      backgroundColor: '#fff5f5',
      color: '#c53030',
      padding: '16px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #feb2b2',
    },
    floatingError: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#fff5f5',
      color: '#c53030',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #feb2b2',
      zIndex: 1000,
      maxWidth: '400px',
    },
    floatingSuccess: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#f0fff4',
      color: '#22543d',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid #9ae6b4',
      zIndex: 1000,
      maxWidth: '400px',
    },
    
    // EXISTING STYLES FROM YOUR CODE
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '12px',
      marginBottom: '30px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: connectionStatus === 'connected' ? '#22c55e' : 
                     connectionStatus === 'checking' ? '#f59e0b' : '#ef4444'
    },
    configForm: {
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      marginBottom: '24px',
      position: 'relative',
      border: '1px solid #e2e8f0'
    },
    modeToggle: {
      display: 'flex',
      gap: '6px',
      marginBottom: '30px',
      padding: '6px',
      backgroundColor: '#f1f5f9',
      borderRadius: '10px',
      border: '1px solid #e2e8f0'
    },
    modeButton: {
      flex: 1,
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      fontSize: '14px'
    },
    modeButtonActive: {
      backgroundColor: '#667eea',
      color: 'white',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
    },
    modeButtonInactive: {
      backgroundColor: 'transparent',
      color: '#64748b'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
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
      backgroundColor: '#f8fafc'
    },
    textareaError: {
      borderColor: '#ef4444'
    },
    jsonError: {
      color: '#dc2626',
      fontSize: '12px',
      marginTop: '6px',
      padding: '10px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '6px'
    },
    paymentButton: {
      width: '100%',
      padding: '16px 24px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '12px',
      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
    },
    paymentButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    secondaryButton: {
      width: '100%',
      padding: '12px 20px',
      backgroundColor: '#f8fafc',
      color: '#475569',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '8px'
    },
    spinner: {
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      animation: 'spin 1s linear infinite'
    },
    errorMessage: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #fecaca',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px'
    },
    successMessage: {
      backgroundColor: '#f0fdf4',
      color: '#166534',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #bbf7d0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px'
    },
    sectionTitle: {
      color: '#667eea',
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '16px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      color: '#1e40af',
      padding: '14px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px',
      border: '1px solid #dbeafe',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px'
    }
  };

  const getCurrentAmount = () => {
    if (useAdvancedMode) {
      try {
        const parsed = JSON.parse(jsonPayload);
        return parsed.order?.amount || '99.00';
      } catch {
        return '99.00';
      }
    } else {
      return orderConfig.amount;
    }
  };

  const isFormValid = () => {
    if (useAdvancedMode) {
      return !jsonError && jsonPayload.trim() !== '' && config.merchantId && config.username && config.password;
    } else {
      return config.merchantId && config.username && config.password && 
             orderConfig.amount && orderConfig.currency && orderConfig.description &&
             parseFloat(orderConfig.amount) > 0;
    }
  };

  // ========== MULTI-VIEW JSX RENDERING ==========
  return (
    <div style={styles.app}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .form-row {
              grid-template-columns: 1fr !important;
            }
          }
          
          .input-focused {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          
          .payment-button:hover:not(:disabled) {
            background-color: #047857;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
          }
          
          .secondary-button:hover {
            background-color: #f1f5f9;
            border-color: #cbd5e1;
          }
          
          .close-button:hover {
            background-color: #f3f4f6;
          }
          
          .back-button:hover {
            background-color: #3182ce;
          }
        `}
      </style>

      {/* ========== SHOPPING CART VIEW ========== */}
      {currentView === 'cart' && (
        <ShoppingCart
          onCheckoutHosted={openCheckoutPage}
          onCheckoutEmbedded={openEmbeddedCheckout}
          onOpenSettings={() => setCurrentView('config')}
          isConfigured={isFormValid()}
          isLoading={isLoadingSession}
        />
      )}
      
      {/* ========== CONFIGURATION MODAL VIEW ========== */}
      {currentView === 'config' && (
        <div style={styles.configOverlay}>
          <div style={styles.configModal}>
            <div style={styles.configHeader}>
              <div style={styles.configLogoSection}>
                <img 
                  src="/logo.png" 
                  alt="Company Logo" 
                  style={styles.configLogo}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{...styles.logoFallback, display: 'none'}}>
                  <span style={styles.logoIcon}>⚙️</span>
                </div>
                <h2 style={{margin: 0, flex: 1}}>Payment Gateway Configuration</h2>
              </div>
              <button 
                onClick={() => setCurrentView('cart')}
                style={styles.closeButton}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <div style={styles.configContent}>
              {/* Connection Status */}
              <div style={{...styles.statusIndicator, marginBottom: '20px', display: 'inline-flex'}}>
                <div style={styles.statusDot}></div>
                <span>
                  {connectionStatus === 'connected' ? 'Backend Connected' : 
                   connectionStatus === 'checking' ? 'Checking Connection...' : 
                   'Connection Error'}
                </span>
              </div>

              {success && (
                <div style={styles.successMessage}>
                  <span>✅</span>
                  <p style={{margin: 0}}>{success}</p>
                </div>
              )}

              {error && (
                <div style={styles.errorMessage}>
                  <span>⚠️</span>
                  <div>
                    <p style={{margin: 0, fontWeight: '600'}}>Error</p>
                    <p style={{margin: '4px 0 0 0', fontSize: '14px'}}>{error}</p>
                  </div>
                </div>
              )}

              {/* Mode Toggle */}
              {ENABLE_ADVANCED_MODE && (
                <div style={styles.modeToggle}>
                  <button
                    style={{
                      ...styles.modeButton,
                      ...(useAdvancedMode ? styles.modeButtonInactive : styles.modeButtonActive)
                    }}
                    onClick={() => setUseAdvancedMode(false)}
                  >
                    🎯 Simple Mode
                  </button>
                  <button
                    style={{
                      ...styles.modeButton,
                      ...(useAdvancedMode ? styles.modeButtonActive : styles.modeButtonInactive)
                    }}
                    onClick={() => setUseAdvancedMode(true)}
                  >
                    ⚙️ Advanced JSON Mode
                  </button>
                </div>
              )}

              {/* API Configuration Section */}
              <div style={styles.sectionTitle}>
                🔐 API Configuration
              </div>

              <div style={styles.formRow} className="form-row">
                <div style={styles.formGroup}>
                  <label style={styles.label}>Merchant ID</label>
                  <input
                    style={styles.input}
                    className="config-input"
                    type="text"
                    value={config.merchantId}
                    onChange={(e) => handleConfigChange('merchantId', e.target.value)}
                    placeholder="TESTMIDtesting00"
                    onFocus={(e) => e.target.classList.add('input-focused')}
                    onBlur={(e) => e.target.classList.remove('input-focused')}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username (auto-generated)</label>
                  <input
                    style={{...styles.input, backgroundColor: '#f9fafb', color: '#6b7280'}}
                    type="text"
                    value={config.username}
                    readOnly
                    placeholder="merchant.TESTMIDtesting00"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>API Password</label>
                <input
                  style={styles.input}
                  className="config-input"
                  type="password"
                  value={config.password}
                  onChange={(e) => handleConfigChange('password', e.target.value)}
                  placeholder="Enter your Mastercard API password"
                  onFocus={(e) => e.target.classList.add('input-focused')}
                  onBlur={(e) => e.target.classList.remove('input-focused')}
                />
              </div>

              <div style={styles.formRow} className="form-row">
                <div style={styles.formGroup}>
                  <label style={styles.label}>API Base URL</label>
                  <input
                    style={styles.input}
                    className="config-input"
                    type="text"
                    value={config.apiBaseUrl}
                    onChange={(e) => handleConfigChange('apiBaseUrl', e.target.value)}
                    placeholder="https://mtf.gateway.mastercard.com"
                    onFocus={(e) => e.target.classList.add('input-focused')}
                    onBlur={(e) => e.target.classList.remove('input-focused')}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>API Version</label>
                  <input
                    style={styles.input}
                    className="config-input"
                    type="text"
                    value={config.apiVersion}
                    onChange={(e) => handleConfigChange('apiVersion', e.target.value)}
                    placeholder="73"
                    onFocus={(e) => e.target.classList.add('input-focused')}
                    onBlur={(e) => e.target.classList.remove('input-focused')}
                  />
                </div>
              </div>

              {/* Simple Mode - Order Configuration */}
              {!useAdvancedMode && (
                <>
                  <div style={styles.sectionTitle}>
                    💳 Order Configuration
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Amount</label>
                      <input
                        style={styles.input}
                        className="config-input"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={orderConfig.amount}
                        onChange={(e) => handleOrderConfigChange('amount', e.target.value)}
                        placeholder="99.00"
                        onFocus={(e) => e.target.classList.add('input-focused')}
                        onBlur={(e) => e.target.classList.remove('input-focused')}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Currency</label>
                      <select
                        style={styles.input}
                        value={orderConfig.currency}
                        onChange={(e) => handleOrderConfigChange('currency', e.target.value)}
                        onFocus={(e) => e.target.classList.add('input-focused')}
                        onBlur={(e) => e.target.classList.remove('input-focused')}
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="HKD">HKD - Hong Kong Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Order Description</label>
                    <input
                      style={styles.input}
                      className="config-input"
                      type="text"
                      value={orderConfig.description}
                      onChange={(e) => handleOrderConfigChange('description', e.target.value)}
                      placeholder="Goods and Services"
                      onFocus={(e) => e.target.classList.add('input-focused')}
                      onBlur={(e) => e.target.classList.remove('input-focused')}
                    />
                  </div>

                  <div style={styles.sectionTitle}>
                    🏢 Merchant Information
                  </div>
                  <div style={styles.formRow} className="form-row">
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Merchant Name</label>
                      <input
                        style={styles.input}
                        className="config-input"
                        type="text"
                        value={orderConfig.merchantName}
                        onChange={(e) => handleOrderConfigChange('merchantName', e.target.value)}
                        placeholder="JK Enterprises LLC"
                        onFocus={(e) => e.target.classList.add('input-focused')}
                        onBlur={(e) => e.target.classList.remove('input-focused')}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Merchant URL</label>
                      <input
                        style={styles.input}
                        className="config-input"
                        type="url"
                        value={orderConfig.merchantUrl}
                        onChange={(e) => handleOrderConfigChange('merchantUrl', e.target.value)}
                        placeholder="https://microsoft.com/"
                        onFocus={(e) => e.target.classList.add('input-focused')}
                        onBlur={(e) => e.target.classList.remove('input-focused')}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Return URL</label>
                    <input
                      style={styles.input}
                      className="config-input"
                      type="url"
                      value={orderConfig.returnUrl}
                      onChange={(e) => handleOrderConfigChange('returnUrl', e.target.value)}
                      placeholder={`${window.location.origin}/ReceiptPage`}
                      onFocus={(e) => e.target.classList.add('input-focused')}
                      onBlur={(e) => e.target.classList.remove('input-focused')}
                    />
                  </div>
                </>
              )}

              {/* Advanced Mode - JSON Configuration */}
              {useAdvancedMode && ENABLE_ADVANCED_MODE && (
                <>
                  <div style={styles.sectionTitle}>
                    ⚙️ Advanced JSON Configuration
                  </div>
                  <div style={styles.infoBox}>
                    <span>🔧</span>
                    <div>
                      <strong>Advanced JSON Mode:</strong> Edit the complete JSON request payload for full control. 
                      Use "ORDER_PLACEHOLDER" for the order ID - it will be auto-generated with a unique timestamp and random string.
                    </div>
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
                </>
              )}
            </div>
            
            <div style={styles.configActions}>
              <button 
                onClick={() => setCurrentView('cart')}
                style={styles.backButton}
                className="back-button"
              >
                ← Back to Shopping Cart
              </button>
              
              <button 
                onClick={resetToDefaults}
                className="secondary-button"
                style={{...styles.secondaryButton, width: 'auto'}}
              >
                🔄 Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ========== EMBEDDED CHECKOUT VIEW ========== */}
      {currentView === 'embedded' && (
        <div style={styles.embeddedContainer}>
          <div style={styles.embeddedHeader}>
            <div style={styles.embeddedHeaderContent}>
              <Logo size="medium" />
              <h1 style={styles.embeddedTitle}>Complete Your Payment</h1>
            </div>
            <button 
              onClick={() => {
                setCurrentView('cart');
                setPaymentSession(null);
                setCheckoutMode(null);
                if (typeof(Storage) !== "undefined") {
                  sessionStorage.clear();
                }
              }}
              style={styles.backButton}
              className="back-button"
            >
              ← Back to Cart
            </button>
          </div>
          
          {error && (
            <div style={styles.errorBanner}>
              ⚠️ {error}
            </div>
          )}
          
          <div style={styles.embeddedContent}>
            <div id="hco-embedded"></div>
          </div>
        </div>
      )}
      
      {/* ========== FLOATING MESSAGES ========== */}
      {error && currentView === 'cart' && (
        <div style={styles.floatingError}>
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div style={styles.floatingSuccess}>
          ✓ {success}
        </div>
      )}
    </div>
  );
}

export default HomePage;
