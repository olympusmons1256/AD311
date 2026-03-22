import ChatWidget from '../components/ChatWidget';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#fff',
    }}>
      {/* Simulated main app area (8/9ths) */}
      <div style={{
        flex: 8,
        background: '#fff',
        minHeight: '100vh',
        borderRight: '1px solid #e5e7eb',
        boxSizing: 'border-box',
      }}>
        {/* You can put simulated app content here if desired */}
      </div>
      {/* ChatWidget sidebar (1/9th) */}
      <div style={{
        flex: 1,
        minWidth: 320,
        maxWidth: 400,
        minHeight: '100vh',
        background: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '-2px 0 8px #0002',
      }}>
        <ChatWidget />
      </div>
    </div>
  );
}
