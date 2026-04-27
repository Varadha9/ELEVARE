// React hooks for state management and side effects
import { useState, useEffect, useCallback } from 'react';
// Shared axios instance with JWT interceptor
import api from '../services/api';

// useConversations — custom hook that fetches the user's conversation history
// Used by Dashboard (for stats) and ProgressTracking (for chart data)
export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // fetch — wrapped in useCallback for a stable reference across renders
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/conversations/history');
      // Extract the conversations array from the nested response structure
      setConversations(res.data?.data?.conversations || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch conversations once on mount
  useEffect(() => { fetch(); }, [fetch]);

  // refetch is exposed so the Reflection page can refresh history after sending a message
  return { conversations, loading, error, refetch: fetch };
}
