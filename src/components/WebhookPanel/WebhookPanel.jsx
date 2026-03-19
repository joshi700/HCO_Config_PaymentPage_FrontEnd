import React, { useState } from 'react';
import useWebhookPolling from '../../hooks/useWebhookPolling';
import WebhookEventItem from './WebhookEventItem';
import './WebhookPanel.css';

export default function WebhookPanel({ orderId, amount }) {
  const { webhooks, status, error } = useWebhookPolling(orderId);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="webhook-panel">
      <div className="webhook-panel-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="webhook-panel-title">
          <span className="webhook-panel-icon">&#123;&#125;</span>
          <span>Webhook Delivery Log</span>
          {webhooks.length > 0 && (
            <span className="webhook-badge">{webhooks.length}</span>
          )}
        </div>
        <span className={`webhook-chevron ${collapsed ? 'collapsed' : ''}`}>&#9660;</span>
      </div>

      {!collapsed && (
        <div className="webhook-panel-body">
          {/* Status indicator */}
          {status === 'polling' && webhooks.length === 0 && (
            <div className="webhook-status polling">
              <span className="pulse-dot" />
              <span>Waiting for webhook notifications from Mastercard...</span>
            </div>
          )}

          {status === 'timeout' && webhooks.length === 0 && (
            <div className="webhook-status timeout">
              <span>No webhooks received within 20 minutes. Check that order.notificationUrl is set in the Advanced JSON configuration and that BACKEND_PUBLIC_URL is configured on the server.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="webhook-status error">
              <span>Error polling webhooks: {error}</span>
            </div>
          )}

          {/* Event list */}
          {webhooks.length > 0 && (
            <div className="webhook-events">
              {webhooks.map((event, index) => (
                <WebhookEventItem key={event.id || index} event={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
