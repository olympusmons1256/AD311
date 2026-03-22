import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowserClient } from '../utils/supabaseBrowserClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return;
      }

      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }

      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const supabase = getSupabaseBrowserClient();

    return {
      session,
      user,
      loading,
      authError,
      authNotice,
      clearAuthFeedback() {
        setAuthError('');
        setAuthNotice('');
      },
      async signIn({ email, password }) {
        setAuthError('');
        setAuthNotice('');

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          setAuthError(error.message);
          throw error;
        }
      },
      async signUp({ email, password }) {
        setAuthError('');
        setAuthNotice('');

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email,
            },
          },
        });

        if (error) {
          setAuthError(error.message);
          throw error;
        }

        if (!data.session) {
          setAuthNotice('Check your email to confirm your account, then sign in.');
        }
      },
      async signOut() {
        setAuthError('');
        setAuthNotice('');

        const { error } = await supabase.auth.signOut();

        if (error) {
          setAuthError(error.message);
          throw error;
        }
      },
    };
  }, [session, user, loading, authError, authNotice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}