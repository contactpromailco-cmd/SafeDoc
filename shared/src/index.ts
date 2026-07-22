/**
 * Shared types and utilities for SafeDoc Workspace
 */

// Re-export all types and utilities
export * from './types/documents.js';
export * from './types/messages.js';
export * from './utils/crypto.js';
export * from './utils/validation.js';

// Make sure enums are exported
export { DocumentType, RiskLevel, RiskCategory } from './types/documents.js';
export { MessageType } from './types/messages.js';
