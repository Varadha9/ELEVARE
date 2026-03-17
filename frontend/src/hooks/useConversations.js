import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/conversations/history');
      setConversations(res.data?.data?.conversations || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { conversations, loading, error, refetch: fetch };
}
