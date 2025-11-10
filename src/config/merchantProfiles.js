// Pre-configured merchant profiles for demo purposes
// Sales people can select from these profiles without entering credentials

const merchantProfiles = {
  default: {
    id: 'default',
    name: 'Demo Merchant (Default)',
    description: 'Standard demo merchant for general presentations',
    config: {
      merchantId: 'GJMIDTESTING',
      username: 'merchant.GJMIDTESTING',
      password: '8e04556a57491fca8d7e3da9a98e3a8f',
      apiBaseUrl: 'https://mtf.gateway.mastercard.com',
      apiVersion: '73'
    }
  },
  retail: {
    id: 'retail',
    name: 'Retail Store Demo',
    description: 'Configured for retail/e-commerce demonstrations',
    config: {
      merchantId: 'TESTMIDtesting00',
      username: 'merchant.TESTMIDtesting00',
      password: '9233298fcaa1c01f578759954343aca1',
      apiBaseUrl: 'https://mtf.gateway.mastercard.com',
      apiVersion: '73'
    }
  },
  subscription: {
    id: 'subscription',
    name: 'Subscription Service Demo',
    description: 'For subscription-based business demos',
    config: {
      merchantId: 'GJMIDTESTING',
      username: 'merchant.GJMIDTESTING',
      password: '8e04556a57491fca8d7e3da9a98e3a8f',
      apiBaseUrl: 'https://mtf.gateway.mastercard.com',
      apiVersion: '73'
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Demo',
    description: 'Enterprise-level merchant configuration',
    config: {
      merchantId: 'GJMIDTESTING',
      username: 'merchant.GJMIDTESTING',
      password: '8e04556a57491fca8d7e3da9a98e3a8f',
      apiBaseUrl: 'https://mtf.gateway.mastercard.com',
      apiVersion: '73'
    }
  },
  custom: {
    id: 'custom',
    name: 'Custom Configuration',
    description: 'Enter your own merchant credentials',
    config: {
      merchantId: '',
      username: '',
      password: '',
      apiBaseUrl: 'https://mtf.gateway.mastercard.com',
      apiVersion: '73'
    }
  }
};

export default merchantProfiles;
