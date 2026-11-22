import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentSession = useRef(null);
  const getCurrentSession = useCallback(() => currentSession.current, []);

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;

    const applySession = nextSession => {
      if (!active) return;
      currentSession.current = nextSession;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    };

    // Subscribe first so a sign-out cannot be overwritten by an older snapshot.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      receivedAuthEvent = true;
      applySession(nextSession);
    });

    const readInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!receivedAuthEvent) applySession(error ? null : (data?.session ?? null));
      } catch {
        if (!receivedAuthEvent) applySession(null);
      }
    };
    void readInitialSession();

    return () => {
      active = false;
      currentSession.current = null;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, getCurrentSession }}>
      {children}
    </AuthContext.Provider>
  );
}
