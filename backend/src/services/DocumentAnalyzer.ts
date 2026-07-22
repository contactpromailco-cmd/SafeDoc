/**
 * Document Analyzer Service
 * Implements Phase 1: Forensic Fraud & Anomaly Detection
 */

import {
  RiskLevel,
  RiskCategory,
  type RiskScore,
  type RiskFactor,
  type DocumentAnalysis,
  type MetadataForensics,
  type FontAnalysis,
  type EntityValidation,
  type BehavioralProfile,
  type AccountValidation,
} from '@safedoc/shared';

interface AnalysisResult {
  riskScore: RiskScore;
  details: DocumentAnalysis;
}

class DocumentAnalyzer {
  async analyze(documentId: string, analysisTypes: string[]): Promise<AnalysisResult> {
    const analysis: DocumentAnalysis = {};
    const riskFactors: RiskFactor[] = [];

    // Run requested analysis types
    if (analysisTypes.includes('metadata')) {
      analysis.metadataForensics = await this.analyzeMetadata(documentId);
      const factor = this.evaluateMetadataRisk(analysis.metadataForensics);
      if (factor) riskFactors.push(factor);
    }

    if (analysisTypes.includes('font')) {
      analysis.fontAnalysis = await this.analyzeFont(documentId);
      const factor = this.evaluateFontRisk(analysis.fontAnalysis);
      if (factor) riskFactors.push(factor);
    }

    if (analysisTypes.includes('entity')) {
      analysis.entityValidation = await this.validateEntity(documentId);
      const factor = this.evaluateEntityRisk(analysis.entityValidation);
      if (factor) riskFactors.push(factor);
    }

    if (analysisTypes.includes('behavioral')) {
      analysis.behavioralProfile = await this.analyzeBehavior(documentId);
      const factor = this.evaluateBehavioralRisk(analysis.behavioralProfile);
      if (factor) riskFactors.push(factor);
    }

    if (analysisTypes.includes('account')) {
      analysis.accountValidation = await this.validateAccount(documentId);
      const factor = this.evaluateAccountRisk(analysis.accountValidation);
      if (factor) riskFactors.push(factor);
    }

    // Calculate overall risk score
    const riskScore = this.calculateRiskScore(riskFactors);

    return {
      riskScore,
      details: analysis,
    };
  }

  /**
   * Phase 1.1: Metadata Time-Warp Forensic
   * Compares file metadata timestamps against document claimed dates
   */
  private async analyzeMetadata(documentId: string): Promise<MetadataForensics> {
    // In production, extract actual PDF metadata
    const now = new Date();
    const creationTimestamp = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const modificationTimestamp = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const documentDateClaim = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Check for timestamp mismatches
    const timestampMismatch =
      documentDateClaim < creationTimestamp ||
      Math.abs(documentDateClaim.getTime() - creationTimestamp.getTime()) >
        48 * 60 * 60 * 1000;

    const suspiciousPatterns: string[] = [];

    if (timestampMismatch) {
      suspiciousPatterns.push('Document date predates file creation');
    }

    if (modificationTimestamp > creationTimestamp) {
      const hoursSinceCreation =
        (modificationTimestamp.getTime() - creationTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCreation < 1) {
        suspiciousPatterns.push('File modified within 1 hour of creation');
      }
    }

    return {
      creationTimestamp,
      modificationTimestamp,
      documentDateClaim,
      timestampMismatch,
      suspiciousPatterns,
    };
  }

  /**
   * Phase 1.2: Font Anomaly & Kerning Checker
   * Detects suspicious text modifications via font and spacing analysis
   */
  private async analyzeFont(documentId: string): Promise<FontAnalysis> {
    // In production, extract actual font data from PDF
    const fonts = [
      {
        name: 'Arial',
        size: 12,
        locations: [
          { page: 1, x: 100, y: 200, text: 'Invoice Total:' },
          { page: 1, x: 100, y: 250, text: 'Bank Account:' },
        ],
      },
      {
        name: 'Arial',
        size: 12.2,
        locations: [{ page: 1, x: 200, y: 200, text: '$5,000.00' }],
      },
    ];

    const kerningAnomalies = [];

    // Check for micro-size variations (common in fraud)
    if (fonts.length > 1 && Math.abs(fonts[0].size - fonts[1].size) > 0.1) {
      kerningAnomalies.push({
        location: fonts[1].locations[0],
        expectedKerning: 1.0,
        actualKerning: 1.2,
        deviation: 0.2,
      });
    }

    return {
      fonts,
      kerningAnomalies,
      suspiciousModifications: kerningAnomalies.length > 0,
    };
  }

  /**
   * Phase 1.3: Shell Company Registry Sweep
   * Cross-references entity against corporate registries
   */
  private async validateEntity(documentId: string): Promise<EntityValidation> {
    // In production, call actual registry APIs
    const entityName = 'QuickPay Solutions LLC';
    const registrationDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const registrationAge = (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60);
    const address = '123 Main St Suite 100';
    const addressType = 'commercial' as const;

    // Shell company indicators - checking if registration is recent or using PO box
    const isShellCompany = registrationAge < 48;

    return {
      entityName,
      registrationDate,
      registrationAge,
      address,
      addressType,
      isShellCompany,
      confidence: 0.85,
      registrySource: 'State Corporate Database',
    };
  }

  /**
   * Phase 1.4: Behavioral Cadence Profiler
   * Analyzes historical patterns for anomalies
   */
  private async analyzeBehavior(documentId: string): Promise<BehavioralProfile> {
    // In production, query transaction history database
    const vendorId = 'vendor-123';
    const historicalFrequency = 2.5; // invoices per month
    const historicalAverage = 1250.0;
    const currentFrequency = 8.0; // Sudden spike
    const currentAmount = 5000.0; // Much higher than average

    const frequencyDeviation =
      Math.abs(currentFrequency - historicalFrequency) / historicalFrequency;
    const amountDeviation =
      Math.abs(currentAmount - historicalAverage) / historicalAverage;

    const urgencyFlags: string[] = [];

    if (frequencyDeviation > 1.5) {
      urgencyFlags.push('Unusual billing frequency detected');
    }

    if (amountDeviation > 2.0) {
      urgencyFlags.push('Invoice amount significantly exceeds historical average');
    }

    const isAnomalous = urgencyFlags.length > 0;

    return {
      vendorId,
      historicalFrequency,
      historicalAverage,
      currentFrequency,
      currentAmount,
      frequencyDeviation,
      amountDeviation,
      urgencyFlags,
      isAnomalous,
    };
  }

  /**
   * Phase 1.5: Multi-Layer Account Ownership Validation
   * Verifies bank account ownership matches vendor
   */
  private async validateAccount(documentId: string): Promise<AccountValidation> {
    // In production, integrate with banking verification APIs
    const accountNumber = '****5678';
    const accountHolder = 'QuickPay Solutions LLC';
    const expectedHolder = 'QuickPay Solutions LLC';
    const isMatch = accountHolder === expectedHolder;

    return {
      accountNumber,
      accountHolder,
      expectedHolder,
      isMatch,
      bankName: 'First National Bank',
      verificationSource: 'Banking Consortium API',
      lastVerified: new Date(),
    };
  }

  // Risk evaluation methods
  private evaluateMetadataRisk(metadata: MetadataForensics): RiskFactor | null {
    if (!metadata.timestampMismatch && metadata.suspiciousPatterns.length === 0) {
      return null;
    }

    const severity =
      metadata.suspiciousPatterns.length > 2
        ? RiskLevel.HIGH
        : metadata.timestampMismatch
        ? RiskLevel.MEDIUM
        : RiskLevel.LOW;

    return {
      id: `metadata-${Date.now()}`,
      category: RiskCategory.METADATA_ANOMALY,
      severity,
      description: 'Document metadata contains suspicious timestamp patterns',
      evidence: metadata.suspiciousPatterns,
      recommendation:
        'Verify document authenticity with issuer. Request original signed copy.',
    };
  }

  private evaluateFontRisk(fontAnalysis: FontAnalysis): RiskFactor | null {
    if (!fontAnalysis.suspiciousModifications) {
      return null;
    }

    return {
      id: `font-${Date.now()}`,
      category: RiskCategory.FONT_ANOMALY,
      severity: RiskLevel.HIGH,
      description: 'Font and kerning anomalies detected suggesting document tampering',
      evidence: fontAnalysis.kerningAnomalies.map(
        (a) => `Deviation of ${a.deviation.toFixed(2)} at "${a.location.text}"`
      ),
      recommendation:
        'Critical: Potential fraud detected. Do not process payment until verified.',
    };
  }

  private evaluateEntityRisk(entity: EntityValidation): RiskFactor | null {
    if (!entity.isShellCompany) {
      return null;
    }

    const severity =
      entity.registrationAge && entity.registrationAge < 48
        ? RiskLevel.CRITICAL
        : RiskLevel.HIGH;

    return {
      id: `entity-${Date.now()}`,
      category: RiskCategory.SHELL_COMPANY,
      severity,
      description: `Entity "${entity.entityName}" shows shell company indicators`,
      evidence: [
        `Registered ${Math.round(
          (entity.registrationAge || 0) / 24
        )} days ago`,
        `Address type: ${entity.addressType}`,
      ],
      recommendation:
        'Conduct enhanced due diligence. Verify business legitimacy before payment.',
    };
  }

  private evaluateBehavioralRisk(profile: BehavioralProfile): RiskFactor | null {
    if (!profile.isAnomalous) {
      return null;
    }

    const severity =
      profile.amountDeviation > 3.0 ? RiskLevel.HIGH : RiskLevel.MEDIUM;

    return {
      id: `behavioral-${Date.now()}`,
      category: RiskCategory.BEHAVIORAL_ANOMALY,
      severity,
      description: 'Invoice pattern deviates significantly from historical baseline',
      evidence: profile.urgencyFlags,
      recommendation: 'Contact vendor via known channels to confirm invoice authenticity.',
    };
  }

  private evaluateAccountRisk(account: AccountValidation): RiskFactor | null {
    if (account.isMatch) {
      return null;
    }

    return {
      id: `account-${Date.now()}`,
      category: RiskCategory.ACCOUNT_MISMATCH,
      severity: RiskLevel.CRITICAL,
      description: 'Bank account holder does not match vendor credentials',
      evidence: [
        `Expected: ${account.expectedHolder}`,
        `Actual: ${account.accountHolder}`,
      ],
      recommendation:
        'DO NOT PROCESS PAYMENT. Possible account takeover or fraud attempt.',
    };
  }

  /**
   * Calculate overall risk score from factors
   */
  private calculateRiskScore(factors: RiskFactor[]): RiskScore {
    if (factors.length === 0) {
      return {
        overall: 98,
        level: RiskLevel.SAFE,
        confidence: 0.95,
        factors: [],
        timestamp: new Date(),
      };
    }

    // Weight factors by severity
    const weights = {
      [RiskLevel.CRITICAL]: 40,
      [RiskLevel.HIGH]: 25,
      [RiskLevel.MEDIUM]: 15,
      [RiskLevel.LOW]: 5,
      [RiskLevel.SAFE]: 0,
    };

    let totalRisk = 0;
    let maxSeverity = RiskLevel.SAFE;

    for (const factor of factors) {
      totalRisk += weights[factor.severity];
      if (
        this.severityOrder(factor.severity) > this.severityOrder(maxSeverity)
      ) {
        maxSeverity = factor.severity;
      }
    }

    // Invert for safety score (100 = safe, 0 = dangerous)
    const overall = Math.max(0, 100 - totalRisk);

    return {
      overall,
      level: maxSeverity,
      confidence: 0.85,
      factors,
      timestamp: new Date(),
    };
  }

  private severityOrder(level: RiskLevel): number {
    const order = {
      [RiskLevel.SAFE]: 0,
      [RiskLevel.LOW]: 1,
      [RiskLevel.MEDIUM]: 2,
      [RiskLevel.HIGH]: 3,
      [RiskLevel.CRITICAL]: 4,
    };
    return order[level];
  }
}

export default DocumentAnalyzer;
