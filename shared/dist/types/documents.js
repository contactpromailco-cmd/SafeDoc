/**
 * Core document types and interfaces for SafeDoc Workspace
 */
export var DocumentType;
(function (DocumentType) {
    DocumentType["INVOICE"] = "INVOICE";
    DocumentType["CONTRACT"] = "CONTRACT";
    DocumentType["EMAIL_TO_INVOICE"] = "EMAIL_TO_INVOICE";
    DocumentType["EXPENSE_VOUCHER"] = "EXPENSE_VOUCHER";
    DocumentType["MSA_ADDENDUM"] = "MSA_ADDENDUM";
    DocumentType["DPA_RIDER"] = "DPA_RIDER";
    DocumentType["STATEMENT_OF_WORK"] = "STATEMENT_OF_WORK";
    DocumentType["NDA"] = "NDA";
    DocumentType["CONTRACTOR_AGREEMENT"] = "CONTRACTOR_AGREEMENT";
    DocumentType["RISK_REPORT"] = "RISK_REPORT";
    DocumentType["REDLINE_SUMMARY"] = "REDLINE_SUMMARY";
    DocumentType["AML_CERTIFICATE"] = "AML_CERTIFICATE";
    DocumentType["PROCUREMENT_AUDIT"] = "PROCUREMENT_AUDIT";
    DocumentType["CORPORATE_RESOLUTION"] = "CORPORATE_RESOLUTION";
    DocumentType["RFP_RESPONSE"] = "RFP_RESPONSE";
    DocumentType["OFFBOARDING_CERTIFICATE"] = "OFFBOARDING_CERTIFICATE";
    DocumentType["SLA_FAILURE_RECORD"] = "SLA_FAILURE_RECORD";
    DocumentType["MOU"] = "MOU";
    DocumentType["BREACH_NOTIFICATION"] = "BREACH_NOTIFICATION";
    DocumentType["DUNNING_NOTICE"] = "DUNNING_NOTICE";
    DocumentType["VENDOR_ONBOARDING"] = "VENDOR_ONBOARDING";
})(DocumentType || (DocumentType = {}));
export var RiskLevel;
(function (RiskLevel) {
    RiskLevel["SAFE"] = "SAFE";
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (RiskLevel = {}));
export var RiskCategory;
(function (RiskCategory) {
    RiskCategory["METADATA_ANOMALY"] = "METADATA_ANOMALY";
    RiskCategory["FONT_ANOMALY"] = "FONT_ANOMALY";
    RiskCategory["SHELL_COMPANY"] = "SHELL_COMPANY";
    RiskCategory["BEHAVIORAL_ANOMALY"] = "BEHAVIORAL_ANOMALY";
    RiskCategory["ACCOUNT_MISMATCH"] = "ACCOUNT_MISMATCH";
    RiskCategory["DEEPFAKE_DETECTED"] = "DEEPFAKE_DETECTED";
    RiskCategory["COMPLIANCE_VIOLATION"] = "COMPLIANCE_VIOLATION";
    RiskCategory["HIDDEN_CLAUSE"] = "HIDDEN_CLAUSE";
    RiskCategory["CURRENCY_RISK"] = "CURRENCY_RISK";
    RiskCategory["TIMING_ANOMALY"] = "TIMING_ANOMALY";
})(RiskCategory || (RiskCategory = {}));
