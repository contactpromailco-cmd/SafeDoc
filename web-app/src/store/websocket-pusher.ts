/**
 * Pusher State Management Store
 * Real-time sync via Pusher Channels
 */

import { create } from 'zustand';
import Pusher from 'pusher-js';
import { MessageType, type Document, type AppState } from '@safedoc/shared';
import { API_URL, PUSHER_CONFIG } from '../config';

interface WebSocketState {
  connected: boolean;
  appState: AppState;
  activeDocument: Document | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: any) => Promise<void>;
  updateAppState: (state: Partial<AppState>) => void;
  setActiveDocument: (document: Document | null) => void;
}

let pusher: Pusher | null = null;

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  connected: false,
  appState: {
    documents: [],
    analysisQueue: [],
    alerts: [],
    lastSync: Date.now(),
  },
  activeDocument: null,

  connect: () => {
    if (pusher) {
      console.log('Pusher already connected');
      return;
    }

    console.log('Connecting to Pusher...');

    pusher = new Pusher(PUSHER_CONFIG.key, {
      cluster: PUSHER_CONFIG.cluster,
    });

    const channel = pusher.subscribe('documents');

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Connected to Pusher!');
      set({ connected: true });
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('❌ Pusher subscription error:', error);
    });

    channel.bind('analysis-complete', (data: any) => {
      console.log('📊 Analysis complete:', data);
      
      const state = get();
      const updatedDocs = state.appState.documents.map((doc) =>
        doc.metadata.id === data.documentId
          ? { ...doc, riskScore: data.riskScore, analysis: data.analysis }
          : doc
      );

      set({
        appState: {
          ...state.appState,
          documents: updatedDocs,
        },
      });
    });

    channel.bind('document-generated', (data: any) => {
      console.log('📝 Document generated:', data);
      
      const state = get();
      set({
        appState: {
          ...state.appState,
          documents: [...state.appState.documents, data.document],
        },
        activeDocument: data.document,
      });
    });

    channel.bind('document-detected', (data: any) => {
      console.log('🔍 Document detected:', data);
    });

    // Fetch initial state
    fetch(`${API_URL}/api/state`)
      .then((res) => res.json())
      .then((state) => {
        set({ appState: state });
      })
      .catch((error) => {
        console.error('Failed to fetch initial state:', error);
      });
  },

  disconnect: () => {
    if (pusher) {
      pusher.unsubscribe('documents');
      pusher.disconnect();
      pusher = null;
      set({ connected: false });
      console.log('Disconnected from Pusher');
    }
  },

  sendMessage: async (message: any) => {
    console.log('Sending message:', message);

    try {
      if (message.type === MessageType.DOCUMENT_ANALYZE) {
        await fetch(`${API_URL}/api/documents/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: message.documentId,
            analysisTypes: message.analysisTypes,
          }),
        });
      } else if (message.type === MessageType.DOCUMENT_GENERATE) {
        await fetch(`${API_URL}/api/documents/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: message.documentType,
            context: message.context,
            options: message.options,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
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
