import React, { useState } from 'react';

export default function WebhookPayloadViewer({ payload }) {
  const [copied, setCopied] = useState(null);
  const jsonStr = JSON.stringify(payload, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopied('json');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = jsonStr;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied('json');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyCurl = async () => {
    const curl = `curl -X POST \\\n  'YOUR_URL_HERE' \\\n  -H 'Content-Type: application/json' \\\n  -d '${jsonStr.replace(/'/g, "'\\''")}'`;
    try {
      await navigator.clipboard.writeText(curl);
      setCopied('curl');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied('curl');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="webhook-payload-viewer">
      <div className="webhook-payload-actions">
        <button
          className={`webhook-copy-btn ${copied === 'json' ? 'copied' : ''}`}
          onClick={handleCopyJson}
        >
          {copied === 'json' ? 'Copied!' : 'Copy JSON'}
        </button>
        <button
          className={`webhook-copy-btn ${copied === 'curl' ? 'copied' : ''}`}
          onClick={handleCopyCurl}
        >
          {copied === 'curl' ? 'Copied!' : 'Copy as cURL'}
        </button>
      </div>
      <pre className="webhook-json-pre">{jsonStr}</pre>
    </div>
  );
}
