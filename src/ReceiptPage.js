import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';

function ReceiptPage() {
  const [receiptData, setReceiptData] = useState({
    resultIndicator: '',
    sessionVersion: '',
    checkoutVersion: '',
    orderAmount: '0.00',
    orderId: '',
    transactionStatus: '',
    transactionId: '',
    cartItems: []
  });
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Parse URL parameters when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    
    const resultIndicator = urlParams.get('resultIndicator') || '';
    const sessionVersion = urlParams.get('sessionVersion') || '';
    const checkoutVersion = urlParams.get('checkoutVersion') || '';
    let orderId = urlParams.get('orderId') || '';
    
    // Get amount and orderId from localStorage if saved
    let orderAmount = '0.00';
    let cartItems = [];
    let subtotal = 0;
    let tax = 0;
    
    try {
      const savedAmount = localStorage.getItem('lastOrderAmount');
      if (savedAmount) {
        const totalAmount = parseFloat(savedAmount);
        subtotal = totalAmount / 1.08; // Reverse calculate assuming 8% tax
        tax = totalAmount - subtotal;
        orderAmount = totalAmount.toFixed(2);
      }
      
      // Try to get cart items from localStorage
      const savedCart = localStorage.getItem('lastCartItems');
      if (savedCart) {
        cartItems = JSON.parse(savedCart);
      }
      
      // If orderId is not in URL params, try to get it from localStorage
      if (!orderId) {
        const savedOrderId = localStorage.getItem('lastOrderId');
        if (savedOrderId) {
          orderId = savedOrderId;
        }
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    // Determine transaction status
    const transactionStatus = resultIndicator ? 'CAPTURED' : 'PENDING';
    const transactionId = resultIndicator || `TXN_${Date.now()}`;
    const gatewayRecommendation = resultIndicator ? 'PROCEED' : 'REVIEW';
    
    // Update state with all parsed data
    setReceiptData({
      resultIndicator,
      sessionVersion,
      checkoutVersion,
      orderId,
      orderAmount,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      transactionStatus,
      transactionId,
      gatewayRecommendation,
      cartItems
    });

    setLoading(false);
    
    // Trigger success animation
    setTimeout(() => setShowSuccess(true), 100);
    
    // Log for debugging
    console.log('Receipt data:', {
      resultIndicator,
      sessionVersion,
      checkoutVersion,
      orderId,
      orderAmount,
      transactionStatus,
      cartItems
    });
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    alert('Receipt will be sent to your email address');
  };

  const isSuccess = receiptData.transactionStatus === 'CAPTURED' && receiptData.gatewayRecommendation === 'PROCEED';

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f5f5f7'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0071e3',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#86868b', fontSize: '15px' }}>Processing receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <Logo size="medium" />
      </header>

      <div style={styles.container}>
        {/* Success Icon */}
        <div style={{
          ...styles.successIcon,
          ...(showSuccess ? styles.successIconVisible : {})
        }}>
          {isSuccess ? (
            <svg width="80" height="80" viewBox="0 0 80 80" style={styles.checkmark}>
              <circle cx="40" cy="40" r="38" fill="#34C759" stroke="#fff" strokeWidth="4"/>
              <path 
                d="M25 40 L35 50 L55 30" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="38" fill="#FF3B30" stroke="#fff" strokeWidth="4"/>
              <path 
                d="M30 30 L50 50 M50 30 L30 50" 
                stroke="#fff" 
                strokeWidth="5" 
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Status Message */}
        <h1 style={styles.statusHeading}>
          {isSuccess ? 'Payment Successful!' : 'Payment Processing'}
        </h1>
        <p style={styles.statusSubtext}>
          {isSuccess 
            ? 'Thank you for your purchase. Your order has been confirmed.' 
            : 'Your payment is being processed. Please check back later.'}
        </p>

        {/* Receipt Card */}
        <div style={styles.receiptCard}>
          {/* Order Header */}
          <div style={styles.receiptHeader}>
            <h2 style={styles.receiptTitle}>Order Details</h2>
            <p style={styles.receiptDate}>{currentDate}</p>
          </div>

          {/* Order ID Section */}
          <div style={styles.orderIdSection}>
            <div style={styles.orderIdLabel}>Order ID</div>
            <div style={styles.orderIdValue}>{receiptData.orderId || 'N/A'}</div>
          </div>

          <div style={styles.divider}></div>

          {/* Items Section */}
          {receiptData.cartItems && receiptData.cartItems.length > 0 && (
            <>
              <div style={styles.itemsSection}>
                <h3 style={styles.sectionTitle}>Items Purchased</h3>
                {receiptData.cartItems.map((item) => (
                  <div key={item.id} style={styles.item}>
                    <div style={styles.itemLeft}>
                      <div style={styles.itemImage}>{item.image || '📦'}</div>
                      <div>
                        <p style={styles.itemName}>{item.name}</p>
                        <p style={styles.itemQuantity}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div style={styles.divider}></div>
            </>
          )}

          {/* Payment Summary */}
          <div style={styles.summarySection}>
            <h3 style={styles.sectionTitle}>Payment Summary</h3>
            
            {receiptData.subtotal && parseFloat(receiptData.subtotal) > 0 && (
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>${receiptData.subtotal}</span>
              </div>
            )}
            
            {receiptData.tax && parseFloat(receiptData.tax) > 0 && (
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Tax (8%)</span>
                <span style={styles.summaryValue}>${receiptData.tax}</span>
              </div>
            )}
            
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Shipping</span>
              <span style={styles.summaryValue}>Free</span>
            </div>
            
            <div style={styles.divider}></div>
            
            <div style={{...styles.summaryRow, ...styles.totalRow}}>
              <span style={styles.totalLabel}>Total Paid</span>
              <span style={styles.totalValue}>${receiptData.orderAmount}</span>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Transaction Details */}
          <div style={styles.transactionSection}>
            <h3 style={styles.sectionTitle}>Transaction Details</h3>
            
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: isSuccess ? '#d1f4e0' : '#fff4e6',
                color: isSuccess ? '#047857' : '#d97706'
              }}>
                {receiptData.transactionStatus}
              </span>
            </div>
            
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Transaction ID</span>
              <span style={styles.detailValue}>{receiptData.transactionId.substring(0, 20)}...</span>
            </div>
            
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Recommendation</span>
              <span style={styles.detailValue}>{receiptData.gatewayRecommendation}</span>
            </div>

            {/* Technical Details */}
            {(receiptData.sessionVersion || receiptData.checkoutVersion) && (
              <>
                <div style={{...styles.divider, margin: '16px 0'}}></div>
                
                {receiptData.sessionVersion && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Session Version</span>
                    <span style={styles.detailValue}>{receiptData.sessionVersion}</span>
                  </div>
                )}
                
                {receiptData.checkoutVersion && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Checkout Version</span>
                    <span style={styles.detailValue}>{receiptData.checkoutVersion}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button onClick={handlePrintReceipt} style={styles.secondaryButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.buttonIcon}>
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Receipt
          </button>
          
          <button onClick={handleEmailReceipt} style={styles.secondaryButton}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.buttonIcon}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Email Receipt
          </button>
        </div>

        <button onClick={handleReturnHome} style={styles.primaryButton}>
          Return to Home
        </button>

        {/* Help Section */}
        {isSuccess && (
          <div style={styles.helpSection}>
            <h4 style={styles.helpTitle}>What's Next?</h4>
            <ul style={styles.helpList}>
              <li style={styles.helpItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759" style={styles.helpIcon}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
                You'll receive a confirmation email shortly
              </li>
              <li style={styles.helpItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759" style={styles.helpIcon}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
                Your order will be processed within 24 hours
              </li>
              <li style={styles.helpItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759" style={styles.helpIcon}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
                Track your order status in your account
              </li>
            </ul>
          </div>
        )}

        {!isSuccess && (
          <div style={styles.errorSection}>
            <h4 style={styles.errorTitle}>Need Help?</h4>
            <p style={styles.errorText}>
              Contact our support team at <a href="mailto:support@merchant.com" style={styles.errorLink}>support@merchant.com</a> or call our customer service
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          🔒 This transaction was processed securely through Mastercard's encrypted payment gateway.
        </p>
        <p style={styles.footerText}>© 2025 All rights reserved.</p>
      </footer>

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
          header {
            border-bottom: 1px solid #d2d2d7 !important;
          }
          footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    paddingBottom: '60px',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d2d2d7',
    padding: '12px 0',
    textAlign: 'center',
  },
  container: {
    maxWidth: '700px',
    margin: '40px auto 0',
    padding: '0 20px',
  },
  successIcon: {
    textAlign: 'center',
    marginBottom: '24px',
    opacity: 0,
    transform: 'scale(0.5)',
    transition: 'all 0.5s ease-out',
  },
  successIconVisible: {
    opacity: 1,
    transform: 'scale(1)',
  },
  checkmark: {
    filter: 'drop-shadow(0 4px 12px rgba(52, 199, 89, 0.3))',
  },
  statusHeading: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#1d1d1f',
    textAlign: 'center',
    margin: '0 0 8px 0',
  },
  statusSubtext: {
    fontSize: '17px',
    color: '#86868b',
    textAlign: 'center',
    marginBottom: '32px',
  },
  receiptCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
  },
  receiptHeader: {
    marginBottom: '24px',
  },
  receiptTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: '0 0 4px 0',
  },
  receiptDate: {
    fontSize: '14px',
    color: '#86868b',
    margin: 0,
  },
  orderIdSection: {
    backgroundColor: '#f5f5f7',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  orderIdLabel: {
    fontSize: '13px',
    color: '#86868b',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  orderIdValue: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1d1d1f',
    fontFamily: 'monospace',
  },
  divider: {
    height: '1px',
    backgroundColor: '#d2d2d7',
    margin: '24px 0',
  },
  itemsSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  itemLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  itemImage: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    backgroundColor: '#f5f5f7',
    borderRadius: '8px',
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1d1d1f',
    margin: '0 0 4px 0',
  },
  itemQuantity: {
    fontSize: '13px',
    color: '#86868b',
    margin: 0,
  },
  itemPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: 0,
  },
  summarySection: {
    marginBottom: '24px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  summaryLabel: {
    fontSize: '15px',
    color: '#1d1d1f',
  },
  summaryValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1d1d1f',
  },
  totalRow: {
    marginTop: '16px',
  },
  totalLabel: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1d1d1f',
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1d1d1f',
  },
  transactionSection: {},
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  detailLabel: {
    fontSize: '15px',
    color: '#86868b',
  },
  detailValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1d1d1f',
    maxWidth: '60%',
    textAlign: 'right',
    wordBreak: 'break-all',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  secondaryButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 20px',
    backgroundColor: '#ffffff',
    color: '#1d1d1f',
    border: '1px solid #d2d2d7',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonIcon: {
    flexShrink: 0,
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#0071e3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'background-color 0.2s',
  },
  helpSection: {
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
  },
  helpTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  helpList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  helpItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '15px',
    color: '#1d1d1f',
  },
  helpIcon: {
    flexShrink: 0,
  },
  errorSection: {
    backgroundColor: '#fff5f5',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '24px',
  },
  errorTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  errorText: {
    fontSize: '15px',
    color: '#1d1d1f',
    margin: 0,
  },
  errorLink: {
    color: '#0071e3',
    textDecoration: 'none',
  },
  footer: {
    textAlign: 'center',
    padding: '40px 20px',
    borderTop: '1px solid #d2d2d7',
    marginTop: '60px',
  },
  footerText: {
    fontSize: '12px',
    color: '#86868b',
    margin: '8px 0',
  },
};

export default ReceiptPage;
