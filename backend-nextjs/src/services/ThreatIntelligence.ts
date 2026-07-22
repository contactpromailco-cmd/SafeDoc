/**
 * Threat Intelligence Service
 * Implements Phase 3: Threat Intel Network
 */

import { RiskLevel, RiskCategory, type RiskFactor } from '@safedoc/shared';

interface FraudSignature {
  id: string;
  hash: string;
  timestamp: Date;
  severity: RiskLevel;
  reportCount: number;
}

interface DeepfakeAnalysis {
  isDeepfake: boolean;
  confidence: number;
  artifacts: string[];
}

interface CurrencyRisk {
  fromCurrency: string;
  toCurrency: string;
  volatility: number;
  exposure: number;
  recommendation: string;
}

interface ComplianceDrift {
  jurisdiction: string;
  regulationType: string;
  currentRule: string;
  expectedRule: string;
  isCompliant: boolean;
  effectiveDate: Date;
}

class ThreatIntelligence {
  private fraudConsortium: Map<string, FraudSignature> = new Map();

  /**
   * Phase 3.1: Decentralized Fraud Consortium
   * Anonymously shares confirmed fraud patterns
   */
  async checkFraudConsortium(documentHash: string): Promise<RiskFactor | null> {
    const signature = this.fraudConsortium.get(documentHash);

    if (signature && signature.reportCount >= 3) {
      return {
        id: `consortium-${Date.now()}`,
        category: RiskCategory.METADATA_ANOMALY,
        severity: signature.severity,
        description: 'Document matches known fraud pattern in threat intelligence network',
        evidence: [
          `Reported by ${signature.reportCount} independent sources`,
          `First seen: ${signature.timestamp.toLocaleDateString()}`,
          'Pattern flagged across multiple organizations',
        ],
        recommendation: 'CRITICAL: Do not process. Document matches confirmed fraud database.',
      };
    }

    return null;
  }

  async reportFraudPattern(documentHash: string, severity: RiskLevel): Promise<void> {
    const existing = this.fraudConsortium.get(documentHash);

    if (existing) {
      existing.reportCount++;
      existing.severity = this.maxSeverity(existing.severity, severity);
    } else {
      this.fraudConsortium.set(documentHash, {
        id: `sig-${Date.now()}`,
        hash: documentHash,
        timestamp: new Date(),
        severity,
        reportCount: 1,
      });
    }
  }

  /**
   * Phase 3.2: Deepfake Pixel Check
   * Detects AI-generated signatures, logos, and stamps
   */
  async detectDeepfake(imageData: ArrayBuffer): Promise<DeepfakeAnalysis> {
    // In production, use ML model for deepfake detection
    // Simulated analysis
    const artifacts: string[] = [];
    let isDeepfake = false;
    let confidence = 0.0;

    // Simulated artifact detection
    const hasGANArtifacts = Math.random() > 0.8;
    const hasCompressionAnomaly = Math.random() > 0.85;
    const hasPixelPatterns = Math.random() > 0.9;

    if (hasGANArtifacts) {
      artifacts.push('GAN-style noise patterns detected in signature region');
      isDeepfake = true;
      confidence += 0.35;
    }

    if (hasCompressionAnomaly) {
      artifacts.push('Unusual compression artifacts around logo boundaries');
      isDeepfake = true;
      confidence += 0.25;
    }

    if (hasPixelPatterns) {
      artifacts.push('Synthetic pixel distribution in stamp area');
      isDeepfake = true;
      confidence += 0.40;
    }

    return {
      isDeepfake,
      confidence: Math.min(confidence, 0.95),
      artifacts,
    };
  }

  async analyzeDeepfakeRisk(documentId: string): Promise<RiskFactor | null> {
    // Simulated image extraction and analysis
    const mockImageData = new ArrayBuffer(0);
    const analysis = await this.detectDeepfake(mockImageData);

    if (analysis.isDeepfake && analysis.confidence > 0.7) {
      return {
        id: `deepfake-${Date.now()}`,
        category: RiskCategory.DEEPFAKE_DETECTED,
        severity: analysis.confidence > 0.9 ? RiskLevel.CRITICAL : RiskLevel.HIGH,
        description: 'AI-generated content detected in document visual elements',
        evidence: analysis.artifacts,
        recommendation:
          'Signature or logo may be synthetic. Request original physical document or video verification.',
      };
    }

    return null;
  }

  /**
   * Phase 3.3: Volatility Hedging Alerts
   * Monitors currency risk exposure
   */
  async analyzeCurrencyRisk(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<CurrencyRisk> {
    // In production, integrate with real-time FX data
    const volatilityIndex = this.calculateVolatility(fromCurrency, toCurrency);
    const exposure = amount * volatilityIndex;

    let recommendation = '';
    if (volatilityIndex > 0.15) {
      recommendation = `High volatility detected. Consider ${fromCurrency} hedging or payment terms adjustment.`;
    } else if (volatilityIndex > 0.08) {
      recommendation = `Moderate currency risk. Monitor exchange rates closely.`;
    } else {
      recommendation = `Currency pair is relatively stable.`;
    }

    return {
      fromCurrency,
      toCurrency,
      volatility: volatilityIndex,
      exposure,
      recommendation,
    };
  }

  async detectCurrencyRisk(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<RiskFactor | null> {
    const risk = await this.analyzeCurrencyRisk(amount, fromCurrency, toCurrency);

    if (risk.volatility > 0.1) {
      const severity =
        risk.volatility > 0.2
          ? RiskLevel.HIGH
          : risk.volatility > 0.15
          ? RiskLevel.MEDIUM
          : RiskLevel.LOW;

      return {
        id: `currency-${Date.now()}`,
        category: RiskCategory.CURRENCY_RISK,
        severity,
        description: `Currency volatility detected for ${fromCurrency}/${toCurrency} pair`,
        evidence: [
          `Volatility index: ${(risk.volatility * 100).toFixed(1)}%`,
          `Exposure: $${risk.exposure.toFixed(2)}`,
          `Amount: ${amount.toFixed(2)} ${fromCurrency}`,
        ],
        recommendation: risk.recommendation,
      };
    }

    return null;
  }

  /**
   * Phase 3.4: Regulatory Compliance Drift Monitor
   * Tracks changing tax rules and regulations
   */
  async checkComplianceDrift(
    jurisdiction: string,
    taxType: string,
    appliedRate: number
  ): Promise<ComplianceDrift> {
    // In production, integrate with regulatory databases
    const currentRules = this.getCurrentTaxRules(jurisdiction, taxType);
    const expectedRate = currentRules.rate;
    const isCompliant = Math.abs(appliedRate - expectedRate) < 0.001;

    return {
      jurisdiction,
      regulationType: taxType,
      currentRule: `${(currentRules.rate * 100).toFixed(2)}% ${taxType}`,
      expectedRule: `${(expectedRate * 100).toFixed(2)}% ${taxType}`,
      isCompliant,
      effectiveDate: currentRules.effectiveDate,
    };
  }

  async detectComplianceViolation(
    jurisdiction: string,
    taxType: string,
    appliedRate: number
  ): Promise<RiskFactor | null> {
    const drift = await this.checkComplianceDrift(jurisdiction, taxType, appliedRate);

    if (!drift.isCompliant) {
      return {
        id: `compliance-${Date.now()}`,
        category: RiskCategory.COMPLIANCE_VIOLATION,
        severity: RiskLevel.HIGH,
        description: `Tax rate does not match current ${jurisdiction} regulations`,
        evidence: [
          `Applied: ${(appliedRate * 100).toFixed(2)}%`,
          `Expected: ${drift.expectedRule}`,
          `Effective: ${drift.effectiveDate.toLocaleDateString()}`,
        ],
        recommendation: `Update document to reflect current ${jurisdiction} ${taxType} rate before submission.`,
      };
    }

    return null;
  }

  /**
   * Phase 3.5: Implicit Intent Analysis
   * Detects hidden clauses and liability shifts
   */
  async analyzeIntent(documentContent: string): Promise<RiskFactor[]> {
    const riskFactors: RiskFactor[] = [];

    // Pattern detection for common hidden risks
    const patterns = [
      {
        regex: /reasonable efforts?|best efforts?/gi,
        category: RiskCategory.HIDDEN_CLAUSE,
        severity: RiskLevel.MEDIUM,
        description: 'Vague commitment language detected',
        recommendation: 'Request specific performance metrics and timelines.',
      },
      {
        regex: /indemnif(y|ication)/gi,
        category: RiskCategory.HIDDEN_CLAUSE,
        severity: RiskLevel.HIGH,
        description: 'Indemnification clause detected',
        recommendation: 'Review scope of indemnification carefully. May shift liability.',
      },
      {
        regex: /sole discretion|absolute discretion/gi,
        category: RiskCategory.HIDDEN_CLAUSE,
        severity: RiskLevel.HIGH,
        description: 'Unilateral decision-making clause detected',
        recommendation: 'Negotiate mutual agreement requirements for key decisions.',
      },
      {
        regex: /perpetual|in perpetuity/gi,
        category: RiskCategory.HIDDEN_CLAUSE,
        severity: RiskLevel.MEDIUM,
        description: 'Indefinite term commitment detected',
        recommendation: 'Consider adding termination clauses or time limitations.',
      },
      {
        regex: /waive[sd]? any|waive[sd]? all/gi,
        category: RiskCategory.HIDDEN_CLAUSE,
        severity: RiskLevel.HIGH,
        description: 'Rights waiver language detected',
        recommendation: 'Review carefully what rights are being waived.',
      },
    ];

    for (const pattern of patterns) {
      const matches = documentContent.match(pattern.regex);
      if (matches) {
        riskFactors.push({
          id: `intent-${Date.now()}-${Math.random()}`,
          category: pattern.category,
          severity: pattern.severity,
          description: pattern.description,
          evidence: [
            `Found ${matches.length} instance(s)`,
            `Examples: "${matches.slice(0, 3).join('", "')}"`,
          ],
          recommendation: pattern.recommendation,
        });
      }
    }

    return riskFactors;
  }

  // Helper methods
  private calculateVolatility(from: string, to: string): number {
    // Simulated volatility calculation
    const volatilePairs = ['BTC', 'ETH', 'TRY', 'ARS', 'ZAR'];
    const fromVolatile = volatilePairs.includes(from);
    const toVolatile = volatilePairs.includes(to);

    if (fromVolatile || toVolatile) {
      return 0.15 + Math.random() * 0.15;
    }

    return 0.02 + Math.random() * 0.05;
  }

  private getCurrentTaxRules(jurisdiction: string, taxType: string): any {
    // Simulated tax rules database
    const rules: Record<string, Record<string, any>> = {
      'United States': {
        'Sales Tax': { rate: 0.0825, effectiveDate: new Date('2024-01-01') },
      },
      'European Union': {
        VAT: { rate: 0.21, effectiveDate: new Date('2024-01-01') },
      },
      'United Kingdom': {
        VAT: { rate: 0.20, effectiveDate: new Date('2024-01-01') },
      },
    };

    return (
      rules[jurisdiction]?.[taxType] || {
        rate: 0.1,
        effectiveDate: new Date(),
      }
    );
  }

  private maxSeverity(a: RiskLevel, b: RiskLevel): RiskLevel {
    const order = {
      [RiskLevel.SAFE]: 0,
      [RiskLevel.LOW]: 1,
      [RiskLevel.MEDIUM]: 2,
      [RiskLevel.HIGH]: 3,
      [RiskLevel.CRITICAL]: 4,
    };
    return order[a] > order[b] ? a : b;
  }
}

export default ThreatIntelligence;
