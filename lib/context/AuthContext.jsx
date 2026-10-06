'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getBrowserClient } from '@/lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  role: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshSession: async () => {},
  becomeSeller: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRole = async (supabaseUser) => {
    if (!supabaseUser) {
      setUser(null);
      setProfile(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || supabaseUser);
        setProfile(data.profile);
        setRole(data.role || 'buyer');
      } else {
        setUser(supabaseUser);
        setRole('buyer');
      }
    } catch (err) {
      setUser(supabaseUser);
      setRole('buyer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfileAndRole(session.user);
      } else {
        setLoading(false);
      }
    });

    // 2. Subscribe to auth state updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        fetchProfileAndRole(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const supabase = getBrowserClient();
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
    if (data?.user) {
      await fetchProfileAndRole(data.user);
    }
    return data;
  };

  const signup = async (email, password, name) => {
    const supabase = getBrowserClient();
    if (!supabase) throw new Error('Supabase client is not configured.');

    // Always enforce default role = 'buyer'. Never allow selecting 'admin'.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          role: 'buyer',
        },
      },
    });

    if (error) throw error;
    if (data?.user) {
      await fetchProfileAndRole(data.user);
    }
    return data;
  };

  const logout = async () => {
    const supabase = getBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const becomeSeller = async () => {
    const res = await fetch('/api/auth/become-seller', { method: 'POST' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upgrade account.');
    }
    const data = await res.json();
    setRole('seller');
    setProfile((prev) => ({ ...prev, role: 'seller' }));
    return data;
  };

  const refreshSession = async () => {
    const supabase = getBrowserClient();
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfileAndRole(session.user);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        login,
        signup,
        logout,
        refreshSession,
        becomeSeller,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
