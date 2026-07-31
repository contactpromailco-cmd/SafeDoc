/**
 * Shared types (copied from @safedoc/shared to avoid workspace dependency issues)
 */

export enum DocumentType {
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
  EMAIL_TO_INVOICE = 'EMAIL_TO_INVOICE',
  EXPENSE_VOUCHER = 'EXPENSE_VOUCHER',
  MSA_ADDENDUM = 'MSA_ADDENDUM',
  DPA_RIDER = 'DPA_RIDER',
  STATEMENT_OF_WORK = 'STATEMENT_OF_WORK',
  NDA = 'NDA',
  CONTRACTOR_AGREEMENT = 'CONTRACTOR_AGREEMENT',
  RISK_REPORT = 'RISK_REPORT',
  REDLINE_SUMMARY = 'REDLINE_SUMMARY',
  AML_CERTIFICATE = 'AML_CERTIFICATE',
  PROCUREMENT_AUDIT = 'PROCUREMENT_AUDIT',
  CORPORATE_RESOLUTION = 'CORPORATE_RESOLUTION',
  RFP_RESPONSE = 'RFP_RESPONSE',
  OFFBOARDING_CERTIFICATE = 'OFFBOARDING_CERTIFICATE',
  SLA_FAILURE_RECORD = 'SLA_FAILURE_RECORD',
  MOU = 'MOU',
  BREACH_NOTIFICATION = 'BREACH_NOTIFICATION',
  DUNNING_NOTICE = 'DUNNING_NOTICE',
  VENDOR_ONBOARDING = 'VENDOR_ONBOARDING'
}

export enum RiskLevel {
  SAFE = 'SAFE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum RiskCategory {
  METADATA_ANOMALY = 'METADATA_ANOMALY',
  FONT_ANOMALY = 'FONT_ANOMALY',
  SHELL_COMPANY = 'SHELL_COMPANY',
  BEHAVIORAL_ANOMALY = 'BEHAVIORAL_ANOMALY',
  ACCOUNT_MISMATCH = 'ACCOUNT_MISMATCH',
  DEEPFAKE_DETECTED = 'DEEPFAKE_DETECTED',
  COMPLIANCE_VIOLATION = 'COMPLIANCE_VIOLATION',
  HIDDEN_CLAUSE = 'HIDDEN_CLAUSE',
  CURRENCY_RISK = 'CURRENCY_RISK',
  TIMING_ANOMALY = 'TIMING_ANOMALY'
}

export enum MessageType {
  // Connection
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  PING = 'PING',
  PONG = 'PONG',
  
  // Authentication
  AUTH = 'AUTH',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  
  // Document Operations
  DOCUMENT_DETECTED = 'DOCUMENT_DETECTED',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  DOCUMENT_ANALYZE = 'DOCUMENT_ANALYZE',
  DOCUMENT_ANALYSIS_COMPLETE = 'DOCUMENT_ANALYSIS_COMPLETE',
  DOCUMENT_GENERATE = 'DOCUMENT_GENERATE',
  DOCUMENT_GENERATED = 'DOCUMENT_GENERATED',
  DOCUMENT_UPDATE = 'DOCUMENT_UPDATE',
  DOCUMENT_DELETE = 'DOCUMENT_DELETE',
  
  // Risk Analysis
  RISK_SCORE_UPDATE = 'RISK_SCORE_UPDATE',
  RISK_ALERT = 'RISK_ALERT',
  
  // State Sync
  STATE_SYNC = 'STATE_SYNC',
  STATE_REQUEST = 'STATE_REQUEST',
  
  // Commands
  COMMAND = 'COMMAND',
  COMMAND_RESULT = 'COMMAND_RESULT',
  
  // Errors
  ERROR = 'ERROR'
}

export interface DocumentMetadata {
  id: string;
  type: DocumentType;
  title: string;
  createdAt: Date;
  modifiedAt: Date;
  fileCreatedAt?: Date;
  filePath?: string;
  source: 'extension' | 'web-app' | 'upload';
  userId?: string;
}

export interface RiskScore {
  overall: number;
  level: RiskLevel;
  confidence: number;
  factors: RiskFactor[];
  timestamp: Date;
}

export interface RiskFactor {
  id: string;
  category: RiskCategory;
  severity: RiskLevel;
  description: string;
  evidence: string[];
  recommendation?: string;
}

export interface DocumentAnalysis {
  [key: string]: any;
}

export interface Document {
  metadata: DocumentMetadata;
  content: string;
  rawContent?: ArrayBuffer | string;
  riskScore?: RiskScore;
  analysis?: DocumentAnalysis;
  versions?: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  timestamp: Date;
  content: string;
  changes: any[];
  author?: string;
}

export interface RiskAlertMessage {
  type: MessageType;
  timestamp: number;
  id: string;
  source: 'extension' | 'web-app' | 'backend';
  documentId: string;
  alert: {
    severity: string;
    title: string;
    description: string;
    recommendation?: string;
  };
}

export interface AppState {
  documents: Document[];
  activeDocumentId?: string;
  analysisQueue: string[];
  alerts: RiskAlertMessage[];
  lastSync: number;
}
