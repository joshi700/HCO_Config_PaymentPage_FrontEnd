import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';

function ReceiptPage() {
  const [receiptData, setReceiptData] = useState({
    resultIndicator: '',
    sessionVersion: '',
    checkoutVersion: '',
    orderAmount: '$99.99',
    orderId: '',
    transactionStatus: '',
    transactionId: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse URL parameters when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    
    const resultIndicator = urlParams.get('resultIndicator') || '';
    const sessionVersion = urlParams.get('sessionVersion') || '';
    const checkoutVersion = urlParams.get('checkoutVersion') || '';
    let orderId = urlParams.get('orderId') || '';
    
    // Get amount and orderId from localStorage if saved (FIX DEFECT 2)
    let orderAmount = '$99.99'; // default
    try {
      const savedAmount = localStorage.getItem('lastOrderAmount');
      if (savedAmount) {
        orderAmount = `$${parseFloat(savedAmount).toFixed(2)}`;
      }
      
      // If orderId is not in URL params, try to get it from localStorage
      if (!orderId) {
        const savedOrderId = localStorage.getItem('lastOrderId');
        if (savedOrderId) {
          orderId = savedOrderId;
          console.log('OrderId retrieved from localStorage:', orderId);
        }
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    // Determine transaction status
    // Result indicator presence typically indicates success
    const transactionStatus = resultIndicator ? 'SUCCESS' : 'UNKNOWN';
    const transactionId = resultIndicator || `TXN_${Date.now()}`;
    
    // Update state with all parsed data
    setReceiptData({
      resultIndicator,
      sessionVersion,
      checkoutVersion,
      orderId,
      orderAmount,
      transactionStatus,
      transactionId
    });

    setLoading(false);
    
    // Log for debugging
    console.log('Receipt data:', {
      resultIndicator,
      sessionVersion,
      checkoutVersion,
      orderId,
      orderAmount,
      transactionStatus
    });
  }, []);

  const handleReturnHome = () => {
    // Navigate back to main app
    window.location.href = '/';
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666' }}>Processing receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Logo Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <Logo size="medium" />
      </div>

      {/* Success/Failure Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '10px'
        }}>
          {receiptData.transactionStatus === 'SUCCESS' ? '✅' : '❌'}
        </div>
        <h1 style={{
          color: receiptData.transactionStatus === 'SUCCESS' ? '#28a745' : '#dc3545',
          margin: '0 0 10px 0',
          fontSize: '28px'
        }}>
          {receiptData.transactionStatus === 'SUCCESS' ? 'Payment Successful' : 'Payment Status Unknown'}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
          {receiptData.transactionStatus === 'SUCCESS' 
            ? 'Thank you for your order! Your transaction has been processed successfully.'
            : 'Please check the transaction details below.'
          }
        </p>
      </div>

      {/* Receipt Details */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          borderBottom: '2px solid #eee', 
          paddingBottom: '10px',
          marginTop: 0,
          color: '#333',
          fontSize: '20px'
        }}>
          Receipt Details
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Amount:</span>
            <span style={{ fontSize: '20px', color: '#28a745', fontWeight: 'bold' }}>
              {receiptData.orderAmount}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Order ID:</span>
            <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#333' }}>
              {receiptData.orderId || 'N/A'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Transaction ID:</span>
            <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#333', wordBreak: 'break-all' }}>
              {receiptData.transactionId}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Date:</span>
            <span style={{ fontSize: '14px', color: '#333' }}>
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px 0' }}>
            <span style={{ fontWeight: 'bold', color: '#555' }}>Status:</span>
            <span style={{ 
              color: receiptData.transactionStatus === 'SUCCESS' ? '#28a745' : '#dc3545',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {receiptData.transactionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Details (for debugging) */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          borderBottom: '1px solid #eee', 
          paddingBottom: '10px',
          marginTop: 0,
          color: '#666',
          fontSize: '16px'
        }}>
          Technical Details
        </h3>
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '8px 0' }}>
            <span style={{ fontWeight: '500' }}>Result Indicator:</span>
            <span style={{ 
              fontFamily: 'monospace', 
              backgroundColor: '#f8f9fa', 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '13px',
              wordBreak: 'break-all',
              maxWidth: '60%',
              textAlign: 'right'
            }}>
              {receiptData.resultIndicator || 'N/A'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '8px 0' }}>
            <span style={{ fontWeight: '500' }}>Session Version:</span>
            <span style={{ 
              fontFamily: 'monospace', 
              backgroundColor: '#f8f9fa', 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              {receiptData.sessionVersion || 'N/A'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '8px 0' }}>
            <span style={{ fontWeight: '500' }}>Checkout Version:</span>
            <span style={{ 
              fontFamily: 'monospace', 
              backgroundColor: '#f8f9fa', 
              padding: '4px 8px', 
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              {receiptData.checkoutVersion || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        <button
          onClick={handlePrintReceipt}
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '15px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(0,123,255,0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#007bff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.3)';
          }}
        >
          🖨️ Print Receipt
        </button>
        
        <button
          onClick={handleReturnHome}
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '15px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(40,167,69,0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1e7e34';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(40,167,69,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#28a745';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(40,167,69,0.3)';
          }}
        >
          🏠 Return to Home
        </button>
      </div>

      {/* Security Notice */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        🔒 This transaction was processed securely through Mastercard's encrypted payment gateway. 
        Please keep this receipt for your records.
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media print {
          body { 
            margin: 0; 
            background-color: white !important;
          }
          button { 
            display: none !important; 
          }
          div[style*="backgroundColor: '#e9ecef'"] {
            display: none !important;
          }
        }
        
        @media (max-width: 600px) {
          div[style*="flex"] button {
            flex: none !important;
            width: 100% !important;
            min-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ReceiptPage;
