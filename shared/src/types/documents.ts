/**
 * Core document types and interfaces for SafeDoc Workspace
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
  overall: number; // 0-100
  level: RiskLevel;
  confidence: number; // 0-1
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

export interface Document {
  metadata: DocumentMetadata;
  content: string;
  rawContent?: ArrayBuffer | string;
  riskScore?: RiskScore;
  analysis?: DocumentAnalysis;
  versions?: DocumentVersion[];
}

export interface DocumentAnalysis {
  metadataForensics?: MetadataForensics;
  fontAnalysis?: FontAnalysis;
  entityValidation?: EntityValidation;
  behavioralProfile?: BehavioralProfile;
  accountValidation?: AccountValidation;
  complianceCheck?: ComplianceCheck;
  intentAnalysis?: IntentAnalysis;
}

export interface MetadataForensics {
  creationTimestamp: Date;
  modificationTimestamp: Date;
  documentDateClaim: Date;
  timestampMismatch: boolean;
  mismatchSeverity?: number;
  suspiciousPatterns: string[];
}

export interface FontAnalysis {
  fonts: FontInfo[];
  kerningAnomalies: KerningAnomaly[];
  suspiciousModifications: boolean;
}

export interface FontInfo {
  name: string;
  size: number;
  locations: TextLocation[];
}

export interface KerningAnomaly {
  location: TextLocation;
  expectedKerning: number;
  actualKerning: number;
  deviation: number;
}

export interface TextLocation {
  page: number;
  x: number;
  y: number;
  text: string;
}

export interface EntityValidation {
  entityName: string;
  registrationDate?: Date;
  registrationAge?: number; // hours
  address?: string;
  addressType?: 'commercial' | 'residential' | 'po_box' | 'unknown';
  isShellCompany: boolean;
  confidence: number;
  registrySource?: string;
}

export interface BehavioralProfile {
  vendorId: string;
  historicalFrequency: number; // invoices per month
  historicalAverage: number; // average amount
  currentFrequency: number;
  currentAmount: number;
  frequencyDeviation: number;
  amountDeviation: number;
  urgencyFlags: string[];
  isAnomalous: boolean;
}

export interface AccountValidation {
  accountNumber: string;
  accountHolder: string;
  expectedHolder: string;
  isMatch: boolean;
  bankName?: string;
  verificationSource?: string;
  lastVerified?: Date;
}

export interface ComplianceCheck {
  jurisdiction: string;
  taxType: string; // VAT, Sales Tax, GST, etc.
  expectedRate: number;
  actualRate?: number;
  isCompliant: boolean;
  violations: string[];
}

export interface IntentAnalysis {
  clauses: ClauseAnalysis[];
  hiddenRisks: string[];
  liabilityShifts: LiabilityShift[];
  overallIntent: 'neutral' | 'protective' | 'aggressive' | 'suspicious';
}

export interface ClauseAnalysis {
  text: string;
  type: string;
  riskLevel: RiskLevel;
  interpretation: string;
}

export interface LiabilityShift {
  from: string;
  to: string;
  description: string;
  severity: RiskLevel;
}

export interface DocumentVersion {
  id: string;
  timestamp: Date;
  content: string;
  changes: DocumentChange[];
  author?: string;
}

export interface DocumentChange {
  type: 'addition' | 'deletion' | 'modification';
  location: TextLocation;
  oldText?: string;
  newText?: string;
  riskImpact?: RiskLevel;
}

export interface GenerationRequest {
  type: DocumentType;
  context: Record<string, any>;
  template?: string;
  style?: DocumentStyle;
  options?: GenerationOptions;
}

export interface DocumentStyle {
  legalVoice?: 'formal' | 'casual' | 'technical' | 'custom';
  customVoiceSamples?: string[];
  formatting?: 'minimal' | 'standard' | 'detailed';
}

export interface GenerationOptions {
  includeCryptographicSignature?: boolean;
  includeEscrow?: boolean;
  expirationWindow?: number; // hours
  multiModal?: boolean;
  jurisdiction?: string;
  currency?: string;
}
