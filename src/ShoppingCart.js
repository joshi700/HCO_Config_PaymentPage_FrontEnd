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
  const [cartItems, setCartItems] = useState([]);

  const sampleProducts = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: '🎧'
    },
    {
      id: 2,
      name: 'Premium Watch',
      price: 99.00,
      description: 'Elegant smartwatch with fitness tracking and notifications',
      image: '⌚'
    },
    {
      id: 3,
      name: 'Wireless Keyboard',
      price: 79.99,
      description: 'Mechanical keyboard with RGB backlighting',
      image: '⌨️'
    },
    {
      id: 4,
      name: 'Gaming Mouse',
      price: 59.99,
      description: 'High-precision gaming mouse with customizable buttons',
      image: '🖱️'
    },
    {
      id: 5,
      name: 'USB-C Hub',
      price: 49.99,
      description: 'Multi-port USB-C hub with HDMI and card reader',
      image: '🔌'
    }
  ];

  const addSampleItems = () => {
    setCartItems(sampleProducts);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '20px 30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    logo: {
      height: '50px',
      width: 'auto',
      maxWidth: '150px',
      objectFit: 'contain',
    },
    logoFallback: {
      width: '50px',
      height: '50px',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoIcon: {
      fontSize: '28px',
    },
    title: {
      margin: 0,
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a202c',
    },
    settingsButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      fontSize: '22px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    configStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 20px',
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      borderRadius: '8px',
      marginBottom: '20px',
      color: '#155724',
      fontSize: '15px',
      fontWeight: '500',
    },
    checkmark: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#28a745',
    },
    emptyCart: {
      textAlign: 'center',
      padding: '80px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    emptyIcon: {
      fontSize: '80px',
      marginBottom: '20px',
      animation: 'bounce 2s infinite',
    },
    emptyTitle: {
      fontSize: '28px',
      color: '#2d3748',
      marginBottom: '10px',
      fontWeight: '600',
    },
    emptyText: {
      color: '#718096',
      marginBottom: '40px',
      fontSize: '16px',
    },
    addItemsButton: {
      padding: '14px 40px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)',
    },
    cartContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    cartItems: {
      marginBottom: '30px',
    },
    cartItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f7fafc',
      borderRadius: '10px',
      marginBottom: '15px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
    },
    itemIcon: {
      fontSize: '48px',
      marginRight: '20px',
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      margin: '0 0 8px 0',
      fontSize: '20px',
      fontWeight: '600',
      color: '#2d3748',
    },
    itemDesc: {
      margin: 0,
      fontSize: '14px',
      color: '#718096',
    },
    itemPrice: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#38a169',
      marginRight: '20px',
    },
    removeButton: {
      background: 'rgba(245, 101, 101, 0.1)',
      color: '#f56565',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cartTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderTop: '2px solid #e2e8f0',
      borderBottom: '2px solid #e2e8f0',
      marginBottom: '30px',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
    },
    totalLabel: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#2d3748',
    },
    totalAmount: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#38a169',
    },
    checkoutButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    checkoutButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '24px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'left',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    hostedButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    embeddedButton: {
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      color: 'white',
    },
    buttonIcon: {
      fontSize: '36px',
      marginRight: '20px',
    },
    buttonContent: {
      flex: 1,
    },
    buttonTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '6px',
    },
    buttonSubtitle: {
      fontSize: '14px',
      opacity: 0.95,
      fontWeight: '400',
    },
    warning: {
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#fffaf0',
      border: '1px solid #fbd38d',
      borderRadius: '8px',
      color: '#744210',
      textAlign: 'center',
      fontSize: '15px',
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
      borderTop: '4px solid #3182ce',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px',
    },
  };

  return (
    <div style={styles.container}>
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

      {/* Header with Logo and Settings Icon */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <Logo size="medium" />
          <h1 style={styles.title}>Shopping Cart</h1>
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

      {/* Configuration Status Indicator */}
      {isConfigured && (
        <div style={styles.configStatus}>
          <span style={styles.checkmark}>✓</span>
          <span>Payment gateway configured and ready</span>
        </div>
      )}

      {/* Empty Cart State */}
      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>
            Add sample items to test the payment flow
          </p>
          <button 
            onClick={addSampleItems}
            style={styles.addItemsButton}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2c5aa0';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(49, 130, 206, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3182ce';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(49, 130, 206, 0.3)';
            }}
          >
            Add Sample Items
          </button>
        </div>
      ) : (
        /* Cart with Items */
        <div style={styles.cartContent}>
          {/* Cart Items */}
          <div style={styles.cartItems}>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                style={styles.cartItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#edf2f7';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7fafc';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={styles.itemIcon}>{item.image}</div>
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemDesc}>{item.description}</p>
                </div>
                <div style={styles.itemPrice}>${item.price}</div>
                <button 
                  onClick={() => removeItem(item.id)}
                  style={styles.removeButton}
                  title="Remove item from cart"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f56565';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(245, 101, 101, 0.1)';
                    e.currentTarget.style.color = '#f56565';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Cart Total */}
          <div style={styles.cartTotal}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalAmount}>${getTotal()}</span>
          </div>

          {/* Checkout Buttons */}
          <div style={styles.checkoutButtons}>
            <button
              onClick={onCheckoutHosted}
              style={{...styles.checkoutButton, ...styles.hostedButton}}
              disabled={!isConfigured || isLoading}
              onMouseOver={(e) => {
                if (isConfigured && !isLoading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <span style={styles.buttonIcon}>🌐</span>
              <div style={styles.buttonContent}>
                <div style={styles.buttonTitle}>Checkout with Hosted Payment Page</div>
                <div style={styles.buttonSubtitle}>
                  Redirects to secure gateway-hosted payment page
                </div>
              </div>
            </button>

            <button
              onClick={onCheckoutEmbedded}
              style={{...styles.checkoutButton, ...styles.embeddedButton}}
              disabled={!isConfigured || isLoading}
              onMouseOver={(e) => {
                if (isConfigured && !isLoading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(72, 187, 120, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <span style={styles.buttonIcon}>📄</span>
              <div style={styles.buttonContent}>
                <div style={styles.buttonTitle}>Checkout with Embedded Page</div>
                <div style={styles.buttonSubtitle}>
                  Integrates payment form within the application
                </div>
              </div>
            </button>
          </div>

          {!isConfigured && (
            <div style={styles.warning}>
              ⚠️ Please configure your API credentials in settings before proceeding to checkout
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default ShoppingCart;
