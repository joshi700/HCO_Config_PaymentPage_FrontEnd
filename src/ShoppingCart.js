import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './components/Logo';

function ShoppingCart({ 
  onCheckoutHosted, 
  onCheckoutEmbedded, 
  onOpenSettings,
  isConfigured,
  isLoading 
}) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Headphones',
      price: 99.99,
      quantity: 1,
      description: 'High-quality wireless headphones with noise cancellation',
      image: '🎧'
    },
    {
      id: 2,
      name: 'Premium Watch',
      price: 99.00,
      quantity: 1,
      description: 'Elegant smartwatch with fitness tracking and notifications',
      image: '⌚'
    },
    {
      id: 3,
      name: 'Wireless Keyboard',
      price: 79.99,
      quantity: 1,
      description: 'Mechanical keyboard with RGB backlighting',
      image: '⌨️'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #d2d2d7',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    headerTitle: {
      fontSize: '21px',
      fontWeight: '600',
      color: '#1d1d1f',
    },
    settingsButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '44px',
      height: '44px',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px',
    },
    configStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 20px',
      backgroundColor: '#d1f4e0',
      border: '1px solid #86efac',
      borderRadius: '12px',
      marginBottom: '30px',
      color: '#047857',
      fontSize: '15px',
      fontWeight: '500',
    },
    checkmark: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '30px',
    },
    cartSection: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#1d1d1f',
      marginBottom: '24px',
      margin: 0,
      paddingBottom: '24px',
    },
    cartItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    cartItem: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#fbfbfd',
      borderRadius: '8px',
      border: '1px solid #e8e8ed',
      transition: 'all 0.3s ease',
    },
    itemIcon: {
      fontSize: '60px',
      width: '120px',
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      flexShrink: 0,
    },
    itemDetails: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    itemName: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#1d1d1f',
      margin: 0,
    },
    itemDesc: {
      fontSize: '14px',
      color: '#86868b',
      margin: 0,
    },
    itemPrice: {
      fontSize: '15px',
      color: '#86868b',
      margin: 0,
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
    },
    quantityButton: {
      width: '32px',
      height: '32px',
      border: '1px solid #d2d2d7',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontWeight: '500',
      color: '#1d1d1f',
    },
    quantityInput: {
      width: '50px',
      height: '32px',
      textAlign: 'center',
      border: '1px solid #d2d2d7',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '500',
      color: '#1d1d1f',
    },
    itemRight: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    itemTotal: {
      fontSize: '19px',
      fontWeight: '600',
      color: '#1d1d1f',
      margin: 0,
    },
    removeButton: {
      color: '#e8563a',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      textDecoration: 'underline',
      padding: '4px 0',
      fontWeight: '500',
    },
    summarySection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    summaryCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      position: 'sticky',
      top: '80px',
    },
    summaryTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1d1d1f',
      marginBottom: '20px',
      margin: 0,
      paddingBottom: '20px',
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
    divider: {
      height: '1px',
      backgroundColor: '#d2d2d7',
      margin: '16px 0',
    },
    totalRow: {
      marginBottom: '24px',
    },
    totalLabel: {
      fontSize: '19px',
      fontWeight: '600',
      color: '#1d1d1f',
    },
    totalValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1d1d1f',
    },
    checkoutButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    checkoutButton: {
      width: '100%',
      padding: '16px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    hostedButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    embeddedButton: {
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    securePayment: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
      color: '#86868b',
      fontSize: '13px',
    },
    acceptedCards: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    acceptedCardsTitle: {
      fontSize: '13px',
      color: '#86868b',
      marginBottom: '12px',
      textAlign: 'center',
      fontWeight: '500',
    },
    cardLogos: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      alignItems: 'center',
    },
    warning: {
      marginTop: '16px',
      padding: '12px 16px',
      backgroundColor: '#fffaf0',
      border: '1px solid #fbd38d',
      borderRadius: '8px',
      color: '#744210',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '500',
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    loadingContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #0071e3',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px',
    },
  };

  return (
    <div style={styles.pageContainer}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner}></div>
            <p style={{margin: 0, fontSize: '16px', color: '#2d3748'}}>
              Initializing payment session...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <Logo size="medium" />
            <div style={styles.headerTitle}>Checkout</div>
          </div>
          <button 
            onClick={() => navigate('/config')}
            style={styles.settingsButton}
            title="Configuration Settings"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            ⚙️
          </button>
        </div>
      </header>

      <div style={styles.container}>
        {/* Configuration Status Indicator */}
        {isConfigured && (
          <div style={styles.configStatus}>
            <span style={styles.checkmark}>✓</span>
            <span>Payment gateway configured and ready</span>
          </div>
        )}

        <div style={styles.mainContent}>
          {/* Cart Items Section */}
          <div style={styles.cartSection}>
            <h2 style={styles.sectionTitle}>Shopping Cart ({cartItems.length} items)</h2>
            
            <div style={styles.cartItems}>
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  style={styles.cartItem}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f5';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbfbfd';
                  }}
                >
                  <div style={styles.itemIcon}>{item.image}</div>
                  
                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemDesc}>{item.description}</p>
                    <p style={styles.itemPrice}>${item.price.toFixed(2)}</p>
                    
                    <div style={styles.quantityControls}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f7';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        style={styles.quantityInput}
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f7';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div style={styles.itemRight}>
                    <p style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={styles.removeButton}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#dc2626';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#e8563a';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div style={styles.summarySection}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>${getSubtotal().toFixed(2)}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Tax (8%)</span>
                <span style={styles.summaryValue}>${getTax().toFixed(2)}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Shipping</span>
                <span style={styles.summaryValue}>Free</span>
              </div>
              
              <div style={styles.divider}></div>
              
              <div style={{...styles.summaryRow, ...styles.totalRow}}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>${getTotal().toFixed(2)}</span>
              </div>
              
              <div style={styles.checkoutButtons}>
                <button
                  onClick={onCheckoutHosted}
                  style={{
                    ...styles.checkoutButton, 
                    ...styles.hostedButton,
                    ...(!isConfigured || isLoading ? styles.buttonDisabled : {})
                  }}
                  disabled={!isConfigured || isLoading}
                  onMouseOver={(e) => {
                    if (isConfigured && !isLoading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  <span>🌐</span>
                  <span>Checkout with Hosted Page</span>
                </button>

                <button
                  onClick={onCheckoutEmbedded}
                  style={{
                    ...styles.checkoutButton, 
                    ...styles.embeddedButton,
                    ...(!isConfigured || isLoading ? styles.buttonDisabled : {})
                  }}
                  disabled={!isConfigured || isLoading}
                  onMouseOver={(e) => {
                    if (isConfigured && !isLoading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(72, 187, 120, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
                  }}
                >
                  <span>📄</span>
                  <span>Checkout with Embedded Page</span>
                </button>
              </div>
              
              {!isConfigured && (
                <div style={styles.warning}>
                  ⚠️ Please configure your API credentials before checkout
                </div>
              )}
              
              <div style={styles.securePayment}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
            
            <div style={styles.acceptedCards}>
              <p style={styles.acceptedCardsTitle}>We Accept</p>
              <div style={styles.cardLogos}>
                <span style={{fontSize: '40px'}}>💳</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 968px) {
          .mainContent {
            grid-template-columns: 1fr !important;
          }
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default ShoppingCart;
