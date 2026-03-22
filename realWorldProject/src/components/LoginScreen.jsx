import { useMemo, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp, authError, authNotice, clearAuthFeedback } = useAuth();
  const [mode, setMode] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const heading = useMemo(() => {
    return mode === 'sign-in' ? 'Welcome back' : 'Create your account';
  }, [mode]);

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);
    clearAuthFeedback();

    try {
      if (mode === 'sign-in') {
        await signIn({ email, password });
      } else {
        await signUp({ email, password });
      }
    } catch {
      return;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(320px, 396px)',
        background: 'var(--color-neutral-bg)',
      }}
    >
      <section
        style={{
          padding: '64px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100%',
            width: '100%',
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              color: 'var(--color-primary)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontSize: 14,
              textTransform: 'uppercase',
            }}
          >
            <img src="/connection-icon%201.png" alt="Collective Intelligence logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            <span>Collective Intelligence Engine</span>
          </div>

          <div style={{ marginTop: 86, maxWidth: 560 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(15, 23, 42, 0.52)' }}>
              Welcome
            </div>
            <div style={{ marginTop: 12, fontSize: 32, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--color-neutral-text)' }}>
              Sign in to the Collective Intelligence Engine
            </div>
            <div style={{ marginTop: 18, fontSize: 16, lineHeight: 1.6, color: 'rgba(15, 23, 42, 0.72)' }}>
              Access your workspace, continue your conversations, and work with organization context in one place.
            </div>
          </div>

          <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 180px))', gap: 20, maxWidth: 640 }}>
            {[
              { title: 'Connection', detail: 'Organization context and linked data sources.' },
              { title: 'Analytics', detail: 'Structured retrieval, status, and visibility.' },
              { title: 'Intelligence', detail: 'Focused responses inside a lightweight chat workspace.' },
            ].map(item => (
              <div key={item.title} style={{ borderLeft: '1px solid rgba(15, 23, 42, 0.12)', paddingLeft: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 12, lineHeight: 1.55, color: 'rgba(15, 23, 42, 0.62)' }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside
        style={{
          background: 'var(--color-chat-bg)',
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            background: 'var(--color-neutral-bg)',
            borderRadius: 8,
            padding: 20,
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.22)',
            display: 'grid',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 24, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--color-neutral-text)' }}>{heading}</div>
            <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.5, color: 'rgba(15, 23, 42, 0.72)' }}>
              {mode === 'sign-in' ? 'Use your email and password to continue.' : 'Create an account to get started.'}
            </div>
          </div>

          <div style={{ display: 'inline-flex', background: '#F8FAFC', padding: 4, borderRadius: 6, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
            {[
              { id: 'sign-in', label: 'Sign in' },
              { id: 'sign-up', label: 'Sign up' },
            ].map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setMode(option.id);
                  clearAuthFeedback();
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  background: mode === option.id ? 'var(--color-neutral-bg)' : 'transparent',
                  color: 'var(--color-neutral-text)',
                  borderRadius: 4,
                  padding: '9px 12px',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: mode === option.id ? '0 4px 12px rgba(15, 23, 42, 0.08)' : 'none',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-neutral-text)' }}>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid rgba(15, 23, 42, 0.12)',
                background: '#F8FAFC',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </label>

          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-neutral-text)' }}>
            Password
            <input
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid rgba(15, 23, 42, 0.12)',
                background: '#F8FAFC',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </label>

          {authError && (
            <div style={{ borderRadius: 6, padding: '10px 12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.18)', color: 'var(--color-error)', fontSize: 12.5, lineHeight: 1.45 }}>
              {authError}
            </div>
          )}

          {authNotice && (
            <div style={{ borderRadius: 6, padding: '10px 12px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.18)', color: 'var(--color-secondary)', fontSize: 12.5, lineHeight: 1.45 }}>
              {authNotice}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 4,
              border: 'none',
              background: 'var(--color-secondary)',
              color: '#fff',
              borderRadius: 6,
              padding: '12px 14px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {submitting && <CircularProgress size={14} thickness={6} sx={{ color: '#fff' }} />}
            <span>{mode === 'sign-in' ? 'Sign in' : 'Create account'}</span>
          </button>
        </form>
      </aside>
    </div>
  );
}