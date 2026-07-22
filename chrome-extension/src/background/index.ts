/**
 * Background Service Worker
 * Handles Side Panel opening, message routing, and WebSocket connection
 */

import { MessageType, type Message } from '@safedoc/shared';

interface WebSocketConnection {
  ws: WebSocket | null;
  connected: boolean;
  reconnectAttempts: number;
}

const wsConnection: WebSocketConnection = {
  ws: null,
  connected: false,
  reconnectAttempts: 0,
};

const WS_URL = 'ws://localhost:8080';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;

// Initialize WebSocket connection
function connectWebSocket(): void {
  if (wsConnection.ws && wsConnection.connected) {
    return;
  }

  try {
    wsConnection.ws = new WebSocket(WS_URL);

    wsConnection.ws.onopen = () => {
      console.log('WebSocket connected');
      wsConnection.connected = true;
      wsConnection.reconnectAttempts = 0;

      // Send connect message
      const connectMsg: Message = {
        type: MessageType.CONNECT,
        timestamp: Date.now(),
        id: generateId(),
        source: 'extension',
        clientId: generateClientId(),
        clientType: 'extension',
      };
      sendToWebSocket(connectMsg);
    };

    wsConnection.ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsConnection.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsConnection.ws.onclose = () => {
      console.log('WebSocket disconnected');
      wsConnection.connected = false;
      wsConnection.ws = null;

      // Attempt reconnection
      if (wsConnection.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        wsConnection.reconnectAttempts++;
        setTimeout(connectWebSocket, RECONNECT_DELAY);
      }
    };
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
  }
}

function sendToWebSocket(message: Message): void {
  if (wsConnection.ws && wsConnection.connected) {
    wsConnection.ws.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket not connected, queuing message');
    // In production, implement message queue
  }
}

function handleWebSocketMessage(message: Message): void {
  // Broadcast to all extension contexts
  chrome.runtime.sendMessage(message).catch(() => {
    // Side panel might not be open
  });
}

// Listen for messages from content scripts and side panel
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  console.log('Background received message:', message.type);

  // Forward to WebSocket
  if (message.source === 'extension') {
    sendToWebSocket(message);
  }

  // Handle specific message types
  switch (message.type) {
    case MessageType.DOCUMENT_DETECTED:
      handleDocumentDetected(message, sender.tab?.id);
      break;
    case MessageType.DOCUMENT_ANALYZE:
      // Forward to backend via WebSocket
      sendToWebSocket(message);
      break;
  }

  sendResponse({ received: true });
  return true; // Keep channel open for async response
});

async function handleDocumentDetected(_message: any, tabId?: number): Promise<void> {
  if (!tabId) return;

  // Open side panel when document is detected
  try {
    await chrome.sidePanel.open({ tabId });
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true,
    });
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('SafeDoc extension installed');
  connectWebSocket();
});

// Connect on startup
chrome.runtime.onStartup.addListener(() => {
  console.log('SafeDoc extension started');
  connectWebSocket();
});

// Utility functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateClientId(): string {
  return `ext-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Store session data (for future use in authentication)
interface SessionData {
  userId?: string;
  sessionId?: string;
  token?: string;
}

const sessionData: SessionData = {};

chrome.storage.local.get(['userId', 'sessionId', 'token'], (result) => {
  Object.assign(sessionData, result);
});

// Initialize WebSocket connection
connectWebSocket();
