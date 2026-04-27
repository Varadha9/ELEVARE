// React hooks for state management and side effects
import { useState, useEffect, useCallback } from 'react';
// Shared axios instance with JWT interceptor
import api from '../services/api';

// useProfile — custom hook that fetches and exposes the authenticated user's profile
// Used by Dashboard, Personality, Ikigai, and Settings pages
export function useProfile() {
  const [profile, setProfile] = useState(null); // Behavioral traits, personality, ikigai data
  const [user, setUser]       = useState(null); // Basic user info (name, email, age)
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // fetch — wrapped in useCallback so it has a stable reference
  // This prevents infinite re-renders when passed as a dependency to useEffect
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

  // Fetch profile once on mount
  useEffect(() => { fetch(); }, [fetch]);

  // refetch is exposed so components can manually refresh after updates (e.g. after saving Ikigai)
  return { profile, user, loading, error, refetch: fetch };
}
