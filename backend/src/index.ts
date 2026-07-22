/**
 * SafeDoc Backend Server
 * Handles WebSocket connections, document analysis, and API endpoints
 */

import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import { MessageType, type Message } from '@safedoc/shared';
import DocumentAnalyzer from './services/DocumentAnalyzer';
import DocumentGenerator from './services/DocumentGenerator';
import StateManager from './services/StateManager';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Services
const documentAnalyzer = new DocumentAnalyzer();
const documentGenerator = new DocumentGenerator();
const stateManager = new StateManager();

// Client connection tracking
interface Client {
  id: string;
  ws: WebSocket;
  type: 'extension' | 'web-app';
  authenticated: boolean;
  userId?: string;
}

const clients = new Map<string, Client>();

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');

  let clientId: string | null = null;

  ws.on('message', async (data: Buffer) => {
    try {
      const message: Message = JSON.parse(data.toString());
      await handleMessage(message, ws, (id) => {
        clientId = id;
      });
    } catch (error) {
      console.error('Error handling message:', error);
      sendError(ws, 'Failed to process message');
    }
  });

  ws.on('close', () => {
    if (clientId) {
      console.log(`Client disconnected: ${clientId}`);
      clients.delete(clientId);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

async function handleMessage(
  message: Message,
  ws: WebSocket,
  setClientId: (id: string) => void
): Promise<void> {
  console.log(`Received message: ${message.type}`);

  switch (message.type) {
    case MessageType.CONNECT:
      await handleConnect(message, ws, setClientId);
      break;
    case MessageType.AUTH:
      await handleAuth(message, ws);
      break;
    case MessageType.DOCUMENT_ANALYZE:
      await handleDocumentAnalyze(message, ws);
      break;
    case MessageType.DOCUMENT_GENERATE:
      await handleDocumentGenerate(message, ws);
      break;
    case MessageType.STATE_REQUEST:
      await handleStateRequest(message, ws);
      break;
    case MessageType.PING:
      sendMessage(ws, {
        type: MessageType.PONG,
        timestamp: Date.now(),
        id: generateId(),
        source: 'backend',
      });
      break;
    default:
      console.log(`Unhandled message type: ${message.type}`);
  }
}

async function handleConnect(
  message: any,
  ws: WebSocket,
  setClientId: (id: string) => void
): Promise<void> {
  const client: Client = {
    id: message.clientId,
    ws,
    type: message.clientType,
    authenticated: false,
  };

  clients.set(client.id, client);
  setClientId(client.id);

  console.log(`Client connected: ${client.id} (${client.type})`);

  // Send connection acknowledgment
  sendMessage(ws, {
    type: MessageType.CONNECT,
    timestamp: Date.now(),
    id: generateId(),
    source: 'backend',
    clientId: client.id,
    clientType: client.type,
  });
}

async function handleAuth(message: any, ws: WebSocket): Promise<void> {
  // In production, validate token against auth service
  const authenticated = true;
  const userId = message.userId || 'user-1';
  const sessionId = generateId();

  // Update client
  for (const [id, client] of clients.entries()) {
    if (client.ws === ws) {
      client.authenticated = authenticated;
      client.userId = userId;
      break;
    }
  }

  sendMessage(ws, {
    type: MessageType.AUTH_SUCCESS,
    timestamp: Date.now(),
    id: generateId(),
    source: 'backend',
    userId,
    sessionId,
  });
}

async function handleDocumentAnalyze(message: any, ws: WebSocket): Promise<void> {
  const { documentId, analysisTypes } = message;

  console.log(`Analyzing document: ${documentId}`);

  // Run analysis
  const analysis = await documentAnalyzer.analyze(documentId, analysisTypes);

  // Send results
  sendMessage(ws, {
    type: MessageType.DOCUMENT_ANALYSIS_COMPLETE,
    timestamp: Date.now(),
    id: generateId(),
    source: 'backend',
    documentId,
    riskScore: analysis.riskScore,
    analysis: analysis.details,
  });

  // Broadcast to all connected clients
  broadcastToClients(
    {
      type: MessageType.RISK_SCORE_UPDATE,
      timestamp: Date.now(),
      id: generateId(),
      source: 'backend',
      documentId,
      riskScore: analysis.riskScore,
    },
    ws
  );
}

async function handleDocumentGenerate(message: any, ws: WebSocket): Promise<void> {
  const { documentType, context, options } = message;

  console.log(`Generating document: ${documentType}`);

  // Generate document
  const document = await documentGenerator.generate(documentType, context, options);

  // Send result
  sendMessage(ws, {
    type: MessageType.DOCUMENT_GENERATED,
    timestamp: Date.now(),
    id: generateId(),
    source: 'backend',
    document,
  });
}

async function handleStateRequest(message: any, ws: WebSocket): Promise<void> {
  const state = await stateManager.getState();

  sendMessage(ws, {
    type: MessageType.STATE_SYNC,
    timestamp: Date.now(),
    id: generateId(),
    source: 'backend',
    state,
  });
}

function sendMessage(ws: WebSocket, message: Message): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function sendError(ws: WebSocket, error: string): void {
  sendMessage(ws, {
    type: MessageType.ERROR,
    timestamp: Date.now(),
    id: generateId(),
    source: 'backend',
    error,
  });
}

function broadcastToClients(message: Message, exclude?: WebSocket): void {
  for (const client of clients.values()) {
    if (client.ws !== exclude && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    clients: clients.size,
    timestamp: Date.now(),
  });
});

// API endpoints
app.post('/api/documents/upload', async (req, res) => {
  try {
    const { content, type } = req.body;
    // Handle document upload
    res.json({ success: true, documentId: generateId() });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`SafeDoc server running on port ${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`HTTP: http://localhost:${PORT}`);
});
