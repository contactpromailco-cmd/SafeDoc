/**
 * Validation utilities for documents and data
 */
import { DocumentType, RiskLevel } from '../types/documents.js';
export declare function isValidEmail(email: string): boolean;
export declare function isValidURL(url: string): boolean;
export declare function isValidDocumentType(type: string): type is DocumentType;
export declare function isValidRiskLevel(level: string): level is RiskLevel;
export declare function sanitizeInput(input: string): string;
export declare function isValidAccountNumber(accountNumber: string): boolean;
export declare function isValidTaxId(taxId: string, type: 'EIN' | 'VAT' | 'SSN'): boolean;
export declare function validateCurrency(code: string): boolean;
export declare function validateAmount(amount: number): boolean;
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function validateDocument(doc: any): ValidationResult;
//# sourceMappingURL=validation.d.ts.map