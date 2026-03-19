const API_BASE = '';

export async function createCheckoutSession(payload) {
  const response = await fetch(`${API_BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(error.details || error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchWebhookEvents(orderId) {
  const response = await fetch(`${API_BASE}/api/webhooks/${orderId}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function sendTestWebhook(orderId, amount, currency) {
  const response = await fetch(`${API_BASE}/api/test-webhook/${orderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
