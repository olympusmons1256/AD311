import ChatWidget from '../components/ChatWidget';
import CircularProgress from '@mui/material/CircularProgress';
import LoginScreen from '../components/LoginScreen';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-primary)',
          color: 'var(--color-neutral-bg)',
          gap: 12,
        }}
      >
        <CircularProgress size={18} thickness={6} sx={{ color: 'var(--color-neutral-bg)' }} />
        <span>Restoring session…</span>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#FFFFFF',
      }}
    >
      <main
        style={{
          flex: 8,
          background: '#FFFFFF',
          minHeight: '100vh',
        }}
      />
      <aside
        style={{
          flex: 1,
          minWidth: 280,
          maxWidth: 360,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'var(--color-primary)',
        }}
      >
        <ChatWidget />
      </aside>
    </div>
  );
}
