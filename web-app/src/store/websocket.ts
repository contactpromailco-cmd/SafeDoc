/**
 * WebSocket State Management Store
 * Using Zustand for real-time sync
 */

import { create } from 'zustand';
import {
  MessageType,
  type Message,
  type AppState,
  type Document,
} from '@safedoc/shared';

interface WebSocketState {
  ws: WebSocket | null;
  connected: boolean;
  appState: AppState;
  activeDocument: Document | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: Message) => void;
  updateAppState: (state: Partial<AppState>) => void;
  setActiveDocument: (document: Document | null) => void;
}

const WS_URL = 'ws://localhost:8080';

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  ws: null,
  connected: false,
  appState: {
    documents: [],
    analysisQueue: [],
    alerts: [],
    lastSync: Date.now(),
  },
  activeDocument: null,

  connect: () => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      set({ connected: true, ws });

      // Send connect message
      const connectMsg: Message = {
        type: MessageType.CONNECT,
        timestamp: Date.now(),
        id: generateId(),
        source: 'web-app',
        clientId: generateClientId(),
        clientType: 'web-app',
      };
      ws.send(JSON.stringify(connectMsg));

      // Request current state
      const stateMsg: Message = {
        type: MessageType.STATE_REQUEST,
        timestamp: Date.now(),
        id: generateId(),
        source: 'web-app',
      };
      ws.send(JSON.stringify(stateMsg));
    };

    ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        handleMessage(message, set, get);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      set({ connected: false, ws: null });

      // Attempt reconnection after 2 seconds
      setTimeout(() => {
        const state = get();
        if (!state.connected) {
          state.connect();
        }
      }, 2000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null, connected: false });
    }
  },

  sendMessage: (message: Message) => {
    const { ws, connected } = get();
    if (ws && connected) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  },

  updateAppState: (updates: Partial<AppState>) => {
    set((state) => ({
      appState: {
        ...state.appState,
        ...updates,
        lastSync: Date.now(),
      },
    }));
  },

  setActiveDocument: (document: Document | null) => {
    set({ activeDocument: document });
  },
}));

function handleMessage(
  message: Message,
  set: any,
  get: () => WebSocketState
): void {
  console.log('Received message:', message.type);

  switch (message.type) {
    case MessageType.STATE_SYNC:
      const syncMsg = message as any;
      set({ appState: syncMsg.state });
      break;

    case MessageType.DOCUMENT_GENERATED:
      const genMsg = message as any;
      const state = get();
      const newDocuments = [...state.appState.documents, genMsg.document];
      set({
        appState: {
          ...state.appState,
          documents: newDocuments,
        },
        activeDocument: genMsg.document,
      });
      break;

    case MessageType.DOCUMENT_ANALYSIS_COMPLETE:
      const analysisMsg = message as any;
      const currentState = get();
      const updatedDocs = currentState.appState.documents.map((doc) =>
        doc.metadata.id === analysisMsg.documentId
          ? { ...doc, riskScore: analysisMsg.riskScore, analysis: analysisMsg.analysis }
          : doc
      );
      set({
        appState: {
          ...currentState.appState,
          documents: updatedDocs,
        },
      });
      break;

    case MessageType.RISK_SCORE_UPDATE:
      const riskMsg = message as any;
      const prevState = get();
      const docsWithRisk = prevState.appState.documents.map((doc) =>
        doc.metadata.id === riskMsg.documentId
          ? { ...doc, riskScore: riskMsg.riskScore }
          : doc
      );
      set({
        appState: {
          ...prevState.appState,
          documents: docsWithRisk,
        },
      });
      break;
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateClientId(): string {
  return `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
