# SafeDoc Workspace - System Architecture

## Overview

SafeDoc Workspace is a dual-application ecosystem consisting of a Chrome Extension and a Web App, connected via real-time WebSocket communication. The system provides intelligent document analysis, fraud detection, and secure document generation.

## System Components

```
┌─────────────────────┐          ┌─────────────────────┐
│  Chrome Extension   │          │     Web App         │
│  (Manifest V3)      │          │  (React + Vite)     │
│                     │          │                     │
│  - Side Panel UI    │          │  - History Panel    │
│  - Content Scripts  │          │  - Document Canvas  │
│  - Background SW    │          │  - Risk Visualizer  │
└──────────┬──────────┘          └──────────┬──────────┘
           │                                 │
           │         WebSocket (ws://)       │
           └────────────┬────────────────────┘
                        │
            ┌───────────▼───────────┐
            │   Backend Server      │
            │   (Node.js + WS)      │
            │                       │
            │  - WebSocket Server   │
            │  - State Manager      │
            │  - Document Analyzer  │
            │  - Document Generator │
            │  - Threat Intelligence│
            └───────────────────────┘
```

## Data Flow

### 1. Document Detection Flow

```
User visits page with document
          ↓
Content Script detects attachment
          ↓
Message to Background Service Worker
          ↓
Background opens Side Panel
          ↓
Side Panel requests analysis via WebSocket
          ↓
Backend processes document
          ↓
Risk score broadcast to all clients
          ↓
Side Panel + Web App update UI
```

### 2. Document Generation Flow

```
User types /invoice command in Canvas
          ↓
Canvas sends DOCUMENT_GENERATE message
          ↓
Backend Document Generator creates document
          ↓
DOCUMENT_GENERATED broadcast to clients
          ↓
Document added to History Panel
          ↓
Canvas displays generated content
```

### 3. Real-Time State Sync

```
Client A modifies document
          ↓
STATE_SYNC message to backend
          ↓
Backend updates shared state
          ↓
Backend broadcasts to all clients
          ↓
Client B receives update
          ↓
UI reflects changes instantly
```

## Technology Stack

### Shared Layer
- **TypeScript** - Type safety across all applications
- **Shared Types** - Document, Message, Risk types

### Chrome Extension
- **Manifest V3** - Latest extension API
- **Side Panel API** - Non-intrusive UI
- **Content Scripts** - Page monitoring
- **Service Worker** - Background processing
- **React** - UI components
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Web Application
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime
- **Express** - HTTP server
- **ws** - WebSocket library
- **TypeScript** - Type safety

## Core Services

### Document Analyzer
Implements 5 forensic checks:
1. Metadata time-warp analysis
2. Font anomaly detection
3. Entity validation
4. Behavioral profiling
5. Account verification

**Input:** Document ID + Analysis types
**Output:** Risk score + Detailed analysis

### Document Generator
Generates 20 document types:
- Invoices, Contracts, NDAs, SOWs
- MSA Addendums, DPA Riders
- Risk Reports, Compliance docs
- And 12 more specialized types

**Input:** Document type + Context + Options
**Output:** Formatted document + Metadata

### Threat Intelligence
Phase 3 features:
- Fraud consortium checking
- Deepfake detection
- Currency risk analysis
- Compliance monitoring
- Intent analysis

**Input:** Document data / Images / Text
**Output:** Risk factors

### State Manager
Manages shared application state:
- Documents list
- Active document
- Analysis queue
- Alerts and notifications

**Sync:** Real-time across all clients

## Security Architecture

### Communication Security
- WebSocket connections
- Message validation
- Client authentication
- Session management

### Document Security
- Cryptographic signatures
- Hash verification
- Tamper detection
- Expiration tokens

### Data Privacy
- No external data transmission (unless explicitly configured)
- Local processing priority
- Encrypted storage options
- Audit logs

## Scalability Considerations

### Horizontal Scaling
- Stateless backend services
- WebSocket connection pooling
- Load balancer support
- Distributed state management (future: Redis)

### Performance Optimization
- Lazy loading in UI
- Incremental analysis
- Background processing
- Caching strategies

## Extension Points

### Adding New Analysis Types
1. Add to `DocumentAnalysis` interface in shared types
2. Implement analysis method in `DocumentAnalyzer`
3. Add risk evaluation logic
4. Update UI to display results

### Adding New Document Types
1. Add to `DocumentType` enum
2. Implement generation method in `DocumentGenerator`
3. Add command pattern (if needed)
4. Update UI templates

### Adding New Threat Checks
1. Implement check in `ThreatIntelligence`
2. Define risk factor structure
3. Integrate into analysis pipeline
4. Add UI visualization

## Monitoring & Observability

### Metrics to Track
- WebSocket connection count
- Message throughput
- Analysis processing time
- Document generation time
- Error rates
- Client types (extension vs web)

### Logging Strategy
- Structured JSON logs
- Log levels: ERROR, WARN, INFO, DEBUG
- Request/response logging
- State change logging

## Future Enhancements

### Planned Features
- Machine learning models for fraud detection
- Real-time collaboration
- Document versioning with git-like diffs
- Mobile applications
- Enterprise SSO integration
- API rate limiting
- Advanced caching
- Offline support

### Integration Opportunities
- Banking APIs for account verification
- Corporate registry APIs
- Currency exchange services
- Compliance databases
- E-signature providers
- Document storage (S3, GCS)
