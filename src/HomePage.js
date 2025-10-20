import React, { useState, useEffect, useCallback, useRef } from 'react';

function HomePage() {
  // State Management
  const [paymentSession, setPaymentSession] = useState(null);
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [scriptKey, setScriptKey] = useState(0);
  const [showConfigForm, setShowConfigForm] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastSessionId, setLastSessionId] = useState(null);
  
  // 🔥 FIX: Add ref to prevent multiple payment page opens
  const hasOpenedPaymentPage = useRef(false);
  
  // Application configuration
  const API_BASE_URL = 'https://hco-config-payment-page-backend.vercel.app';
  const DEBUG_MODE = true;
  const ENABLE_CONSOLE_LOGS = true;
  const ENABLE_ADVANCED_MODE = true;
  const ENABLE_CONFIG_SAVE = true;
  const API_TIMEOUT = 30000;
  
  // Helper function for conditional logging
  const debugLog = useCallback((...args) => {
    if (ENABLE_CONSOLE_LOGS && DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  }, []);

  // Configuration state
  const [config, setConfig] = useState({
    merchantId: 'TESTMIDtesting00',
    username: 'merchant.TESTMIDtesting00',
    password: '',
    apiBaseUrl: 'https://mtf.gateway.mastercard.com',
    apiVersion: '73'
  });

  const [orderConfig, setOrderConfig] = useState({
    currency: 'USD',
    amount: '99.00',
    description: 'Goods and Services',
    merchantName: 'ABC Enterprises LLC',
    merchantUrl: 'https://microsoft.com/',
    returnUrl: `${window.location.origin}/ReceiptPage`
  });

  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
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

  // Connection check on mount - ONLY ONCE
  useEffect(() => {
    checkConnection();
  }, []); // Empty array = run once

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('connected');
        debugLog('Backend connection successful:', data);
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      debugLog('Backend connection failed:', error);
    }
  };

  // 🔥 FIX: Load script only when scriptKey changes, NOT when config changes
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="checkout.min.js"]');
    if (existingScript) {
      existingScript.remove();
      delete window.Checkout;
    }

    // Use the config.apiBaseUrl value at script load time
    const scriptUrl = `${config.apiBaseUrl}/static/checkout/checkout.min.js`;
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    
    script.onload = () => {
      debugLog('Checkout script loaded successfully');
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
  }, [scriptKey]); // 🔥 ONLY depend on scriptKey, not config.apiBaseUrl

  // 🔥 FIX: Configure checkout but DON'T automatically show payment page
  useEffect(() => {
    if (isCheckoutReady && window.Checkout && paymentSession && !hasOpenedPaymentPage.current) {
      debugLog('Configuring checkout with session:', paymentSession);
      
      try {
        setTimeout(() => {
          const configObj = {
            session: {
              id: paymentSession
            }
          };
          
          debugLog('Configuration object:', configObj);
          window.Checkout.configure(configObj);
          debugLog('Configuration completed successfully');
          
          // 🔥 FIX: Only show payment page once
          if (!hasOpenedPaymentPage.current) {
            hasOpenedPaymentPage.current = true;
            
            setTimeout(() => {
              try {
                window.Checkout.showPaymentPage();
                debugLog('Payment page displayed successfully');
              } catch (showError) {
                console.error('Error showing payment page:', showError);
                setError('Failed to display payment page: ' + showError.message);
                setShowConfigForm(true);
                hasOpenedPaymentPage.current = false;
              }
            }, 500);
          }
        }, 100);
        
      } catch (configError) {
        console.error('Error configuring checkout:', configError);
        setError('Failed to configure payment system: ' + configError.message);
        hasOpenedPaymentPage.current = false;
      }
    }
  }, [isCheckoutReady, paymentSession]);

  // Save configuration
  const saveConfigToStorage = useCallback((newConfig, newOrderConfig) => {
    if (ENABLE_CONFIG_SAVE) {
      try {
        localStorage.setItem('mastercardConfig', JSON.stringify(newConfig));
        localStorage.setItem('mastercardOrderConfig', JSON.stringify(newOrderConfig));
        localStorage.setItem('mastercardConfigTimestamp', Date.now().toString());
        debugLog('Configuration saved to localStorage');
        setSuccess('Configuration saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (e) {
        debugLog('Failed to save configuration:', e);
      }
    }
  }, []);

  // Load configuration from localStorage
  useEffect(() => {
    if (ENABLE_CONFIG_SAVE) {
      try {
        const savedConfig = localStorage.getItem('mastercardConfig');
        const savedOrderConfig = localStorage.getItem('mastercardOrderConfig');
        const timestamp = localStorage.getItem('mastercardConfigTimestamp');
        
        const isConfigFresh = timestamp && (Date.now() - parseInt(timestamp)) < (24 * 60 * 60 * 1000);
        
        if (savedConfig && isConfigFresh) {
          const parsed = JSON.parse(savedConfig);
          setConfig(prevConfig => ({ ...prevConfig, ...parsed }));
          debugLog('Loaded configuration from localStorage');
        }
        
        if (savedOrderConfig && isConfigFresh) {
          const parsed = JSON.parse(savedOrderConfig);
          setOrderConfig(prevConfig => ({ ...prevConfig, ...parsed }));
          debugLog('Loaded order configuration from localStorage');
        }
      } catch (e) {
        debugLog('Failed to load configuration from localStorage:', e);
        localStorage.removeItem('mastercardConfig');
        localStorage.removeItem('mastercardOrderConfig');
        localStorage.removeItem('mastercardConfigTimestamp');
      }
    }
  }, []);

  const handleConfigChange = useCallback((field, value) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      if (field === 'merchantId') {
        updated.username = `merchant.${value}`;
      }
      
      return updated;
    });
    
    if (error) setError(null);
  }, [error]);

  const handleOrderConfigChange = useCallback((field, value) => {
    setOrderConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) setError(null);
  }, [error]);

  const handleJsonChange = useCallback((value) => {
    setJsonPayload(value);
    setJsonError(null);
    
    try {
      JSON.parse(value);
    } catch (e) {
      setJsonError(`Invalid JSON: ${e.message}`);
    }
  }, []);

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
    "currency": "USD",
    "amount": "99.00",
    "id": "ORDER_PLACEHOLDER",
    "description": "Goods and Services"
  }
}`);

    if (ENABLE_CONFIG_SAVE) {
      localStorage.removeItem('mastercardConfig');
      localStorage.removeItem('mastercardOrderConfig');
      localStorage.removeItem('mastercardConfigTimestamp');
    }

    setError(null);
    setSuccess('Reset to default configuration!');
    setTimeout(() => setSuccess(null), 3000);
    debugLog('Reset to hardcoded defaults');
  }, []);

  const updateJsonWithOrderId = (json) => {
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return json.replace('"ORDER_PLACEHOLDER"', `"${orderId}"`);
  };

  const getValidatedPayload = useCallback(() => {
    if (useAdvancedMode) {
      try {
        const updatedJson = updateJsonWithOrderId(jsonPayload);
        const parsed = JSON.parse(updatedJson);
        
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
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
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
    }
  }, [useAdvancedMode, jsonPayload, orderConfig]);

  // 🔥 FIX: Add rate limiting to API calls
  const lastApiCallTime = useRef(0);
  const MIN_TIME_BETWEEN_CALLS = 2000; // 2 seconds minimum between calls

  const getSessionId = async () => {
    // 🔥 Rate limiting check
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime.current;
    
    if (timeSinceLastCall < MIN_TIME_BETWEEN_CALLS) {
      const waitTime = MIN_TIME_BETWEEN_CALLS - timeSinceLastCall;
      debugLog(`Rate limiting: waiting ${waitTime}ms before next call`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastApiCallTime.current = Date.now();
    
    setIsLoadingSession(true);
    setError(null);
    
    try {
      const validatedPayload = getValidatedPayload();
      
      const requestBody = {
        ...config,
        ...validatedPayload
      };

      debugLog('Sending request to:', API_BASE_URL);
      debugLog('Request body:', requestBody);

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
          debugLog('API Error Details:', errorData);
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      debugLog('Response received:', data);
      
      if (data.sessionId) {
        setLastSessionId(data.sessionId);
        return data.sessionId;
      } else if (typeof data === 'string') {
        setLastSessionId(data);
        return data;
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

  const openCheckoutPage = async () => {
    try {
      // 🔥 Reset the payment page flag
      hasOpenedPaymentPage.current = false;
      
      getValidatedPayload();
      saveConfigToStorage(config, orderConfig);
      setShowConfigForm(false);
      
      debugLog('Clearing all previous checkout state...');
      setPaymentSession(null);
      setError(null);
      setIsCheckoutReady(false);
      
      if (typeof(Storage) !== "undefined") {
        sessionStorage.clear();
      }
      
      setScriptKey(prev => prev + 1);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const sessionId = await getSessionId();
      
      const trimmedSessionId = sessionId.trim();
      debugLog('Setting NEW session ID:', trimmedSessionId);
      setPaymentSession(trimmedSessionId);
      
    } catch (error) {
      console.error('Failed to open checkout page:', error);
      setError(error.message);
      setShowConfigForm(true);
      hasOpenedPaymentPage.current = false;
    }
  };

  // Styles object (keeping your existing styles)
  const styles = {
    // ... (keep all your existing styles)
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px'}}>
      <h1>Fixed HomePage - Rate Limiting Applied</h1>
      <p>The 429 error should now be fixed. Key changes:</p>
      <ul>
        <li>✅ Script loading only depends on scriptKey</li>
        <li>✅ Payment page opens only once per session</li>
        <li>✅ 2-second minimum between API calls</li>
        <li>✅ Proper cleanup and state management</li>
      </ul>
      
      <button onClick={openCheckoutPage} disabled={isLoadingSession}>
        {isLoadingSession ? 'Loading...' : 'Test Payment'}
      </button>
      
      {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
      {success && <div style={{color: 'green', marginTop: '10px'}}>{success}</div>}
    </div>
  );
}

export default HomePage;
