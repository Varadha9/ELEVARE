import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/profile');
      const data = res.data?.data || {};
      setUser(data.user || null);
      setProfile(data.profile || null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { profile, user, loading, error, refetch: fetch };
}
