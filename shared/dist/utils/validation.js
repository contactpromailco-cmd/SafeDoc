/**
 * Validation utilities for documents and data
 */
import { DocumentType, RiskLevel } from '../types/documents.js';
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
export function isValidDocumentType(type) {
    return Object.values(DocumentType).includes(type);
}
export function isValidRiskLevel(level) {
    return Object.values(RiskLevel).includes(level);
}
export function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
}
export function isValidAccountNumber(accountNumber) {
    // Basic validation - should be customized per region
    const cleaned = accountNumber.replace(/[\s-]/g, '');
    return /^[0-9]{8,17}$/.test(cleaned);
}
export function isValidTaxId(taxId, type) {
    const cleaned = taxId.replace(/[\s-]/g, '');
    switch (type) {
        case 'EIN':
            return /^\d{9}$/.test(cleaned);
        case 'VAT':
            // EU VAT format (simplified)
            return /^[A-Z]{2}\d{8,12}$/.test(taxId.replace(/\s/g, ''));
        case 'SSN':
            return /^\d{9}$/.test(cleaned);
        default:
            return false;
    }
}
export function validateCurrency(code) {
    const validCurrencies = [
        'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD',
        'CNY', 'INR', 'BRL', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK'
    ];
    return validCurrencies.includes(code.toUpperCase());
}
export function validateAmount(amount) {
    return Number.isFinite(amount) && amount >= 0 && amount < Number.MAX_SAFE_INTEGER;
}
export function validateDocument(doc) {
    const errors = [];
    if (!doc.metadata) {
        errors.push('Document metadata is required');
    }
    else {
        if (!doc.metadata.id)
            errors.push('Document ID is required');
        if (!doc.metadata.type || !isValidDocumentType(doc.metadata.type)) {
            errors.push('Valid document type is required');
        }
        if (!doc.metadata.title)
            errors.push('Document title is required');
    }
    if (!doc.content || typeof doc.content !== 'string') {
        errors.push('Document content is required and must be a string');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
