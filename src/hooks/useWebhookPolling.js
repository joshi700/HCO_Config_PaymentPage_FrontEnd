import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchWebhookEvents } from '../utils/api';

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 1200000; // 20 minutes

export default function useWebhookPolling(orderId) {
  const [webhooks, setWebhooks] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | polling | received | timeout | error
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    if (!orderId) return;

    // Check timeout
    if (Date.now() - startTimeRef.current > POLL_TIMEOUT) {
      stopPolling();
      setStatus(prev => prev === 'received' ? 'received' : 'timeout');
      return;
    }

    try {
      const events = await fetchWebhookEvents(orderId);
      if (events && events.length > 0) {
        setWebhooks(events);
        setStatus('received');
      }
    } catch (err) {
      console.error('Webhook poll error:', err);
      setError(err.message);
      setStatus('error');
      stopPolling();
    }
  }, [orderId, stopPolling]);

  useEffect(() => {
    if (!orderId) return;

    setStatus('polling');
    setError(null);
    setWebhooks([]);
    startTimeRef.current = Date.now();

    // Initial fetch
    poll();

    // Start interval
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return stopPolling;
  }, [orderId, poll, stopPolling]);

  const addLocalEvent = useCallback((event) => {
    setWebhooks(prev => [event, ...prev]);
    setStatus('received');
  }, []);

  return { webhooks, status, error, stopPolling, addLocalEvent };
}
