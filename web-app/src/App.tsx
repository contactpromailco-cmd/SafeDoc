/**
 * Main App Component
 * Deep Canvas Interface with Dual-Pane Layout
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Workspace from './pages/Workspace';
import { useWebSocketStore } from './store/websocket-pusher';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  const connectWebSocket = useWebSocketStore((state) => state.connect);

  useEffect(() => {
    // Connect to WebSocket on mount
    connectWebSocket();
  }, [connectWebSocket]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Workspace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
