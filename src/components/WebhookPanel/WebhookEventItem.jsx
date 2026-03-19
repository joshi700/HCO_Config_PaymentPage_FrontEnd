import React, { useState } from 'react';
import WebhookPayloadViewer from './WebhookPayloadViewer';

export default function WebhookEventItem({ event }) {
  const [expanded, setExpanded] = useState(false);

  const typeLabel = event.type || 'UNKNOWN';
  const isTest = event.isTest;
  const timestamp = event.receivedAt
    ? new Date(event.receivedAt).toLocaleString()
    : 'N/A';

  const forwardStatus = event.forwarded;

  return (
    <div className="webhook-event-item">
      <div className="webhook-event-row" onClick={() => setExpanded(!expanded)}>
        <div className="webhook-event-left">
          <span className={`webhook-type-badge ${isTest ? 'test' : 'live'}`}>
            {isTest ? 'TEST' : 'LIVE'}
          </span>
          <span className="webhook-event-type">{typeLabel}</span>
        </div>
        <div className="webhook-event-right">
          {forwardStatus === 'success' && (
            <span className="webhook-forward-badge success">Forwarded</span>
          )}
          {forwardStatus === 'failed' && (
            <span className="webhook-forward-badge failed">Forward Failed</span>
          )}
          <span className="webhook-event-time">{timestamp}</span>
          <span className={`webhook-expand-icon ${expanded ? 'expanded' : ''}`}>&#9654;</span>
        </div>
      </div>

      {expanded && (
        <div className="webhook-event-detail">
          <WebhookPayloadViewer payload={event.payload || event} />
        </div>
      )}
    </div>
  );
}
