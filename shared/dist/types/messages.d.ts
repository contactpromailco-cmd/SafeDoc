/**
 * WebSocket message types for real-time communication
 * between Chrome Extension, Web App, and Backend
 */
import { Document, RiskScore, DocumentAnalysis } from './documents.js';
export declare enum MessageType {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    PING = "PING",
    PONG = "PONG",
    AUTH = "AUTH",
    AUTH_SUCCESS = "AUTH_SUCCESS",
    AUTH_FAILURE = "AUTH_FAILURE",
    DOCUMENT_DETECTED = "DOCUMENT_DETECTED",
    DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
    DOCUMENT_ANALYZE = "DOCUMENT_ANALYZE",
    DOCUMENT_ANALYSIS_COMPLETE = "DOCUMENT_ANALYSIS_COMPLETE",
    DOCUMENT_GENERATE = "DOCUMENT_GENERATE",
    DOCUMENT_GENERATED = "DOCUMENT_GENERATED",
    DOCUMENT_UPDATE = "DOCUMENT_UPDATE",
    DOCUMENT_DELETE = "DOCUMENT_DELETE",
    RISK_SCORE_UPDATE = "RISK_SCORE_UPDATE",
    RISK_ALERT = "RISK_ALERT",
    STATE_SYNC = "STATE_SYNC",
    STATE_REQUEST = "STATE_REQUEST",
    COMMAND = "COMMAND",
    COMMAND_RESULT = "COMMAND_RESULT",
    ERROR = "ERROR"
}
export interface BaseMessage {
    type: MessageType;
    timestamp: number;
    id: string;
    source: 'extension' | 'web-app' | 'backend';
}
export interface ConnectMessage extends BaseMessage {
    type: MessageType.CONNECT;
    clientId: string;
    clientType: 'extension' | 'web-app';
}
export interface AuthMessage extends BaseMessage {
    type: MessageType.AUTH;
    token: string;
    userId?: string;
}
export interface AuthSuccessMessage extends BaseMessage {
    type: MessageType.AUTH_SUCCESS;
    userId: string;
    sessionId: string;
}
export interface DocumentDetectedMessage extends BaseMessage {
    type: MessageType.DOCUMENT_DETECTED;
    url: string;
    documentType: string;
    preview?: string;
}
export interface DocumentUploadMessage extends BaseMessage {
    type: MessageType.DOCUMENT_UPLOAD;
    document: Document;
}
export interface DocumentAnalyzeMessage extends BaseMessage {
    type: MessageType.DOCUMENT_ANALYZE;
    documentId: string;
    analysisTypes: string[];
}
export interface DocumentAnalysisCompleteMessage extends BaseMessage {
    type: MessageType.DOCUMENT_ANALYSIS_COMPLETE;
    documentId: string;
    riskScore: RiskScore;
    analysis: DocumentAnalysis;
}
export interface DocumentGenerateMessage extends BaseMessage {
    type: MessageType.DOCUMENT_GENERATE;
    documentType: string;
    context: Record<string, any>;
    options?: Record<string, any>;
}
export interface DocumentGeneratedMessage extends BaseMessage {
    type: MessageType.DOCUMENT_GENERATED;
    document: Document;
}
export interface RiskScoreUpdateMessage extends BaseMessage {
    type: MessageType.RISK_SCORE_UPDATE;
    documentId: string;
    riskScore: RiskScore;
}
export interface RiskAlertMessage extends BaseMessage {
    type: MessageType.RISK_ALERT;
    documentId: string;
    alert: {
        severity: string;
        title: string;
        description: string;
        recommendation?: string;
    };
}
export interface StateSyncMessage extends BaseMessage {
    type: MessageType.STATE_SYNC;
    state: AppState;
}
export interface StateRequestMessage extends BaseMessage {
    type: MessageType.STATE_REQUEST;
}
export interface CommandMessage extends BaseMessage {
    type: MessageType.COMMAND;
    command: string;
    args: string[];
    context?: Record<string, any>;
}
export interface CommandResultMessage extends BaseMessage {
    type: MessageType.COMMAND_RESULT;
    commandId: string;
    success: boolean;
    result?: any;
    error?: string;
}
export interface ErrorMessage extends BaseMessage {
    type: MessageType.ERROR;
    error: string;
    details?: string;
    stack?: string;
}
export type Message = ConnectMessage | AuthMessage | AuthSuccessMessage | DocumentDetectedMessage | DocumentUploadMessage | DocumentAnalyzeMessage | DocumentAnalysisCompleteMessage | DocumentGenerateMessage | DocumentGeneratedMessage | RiskScoreUpdateMessage | RiskAlertMessage | StateSyncMessage | StateRequestMessage | CommandMessage | CommandResultMessage | ErrorMessage;
export interface AppState {
    documents: Document[];
    activeDocumentId?: string;
    analysisQueue: string[];
    alerts: RiskAlertMessage[];
    lastSync: number;
}
//# sourceMappingURL=messages.d.ts.map