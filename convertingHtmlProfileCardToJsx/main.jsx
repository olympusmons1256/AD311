import React from 'react';
import ReactDOM from 'react-dom/client';
import UserProfile from './UserProfile';

function App() {
  return (
    <div className="App">
      <UserProfile
        name=""
        email=""
        photoUrl=""
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 