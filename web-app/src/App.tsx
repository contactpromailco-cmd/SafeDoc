/**
 * Main App Component
 * Landing Page → Workspace Flow
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Workspace from './pages/Workspace';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
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
          <Route path="/" element={<Landing />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
