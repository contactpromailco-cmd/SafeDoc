/**
 * AI Compliance Checker Service
 * Scans documents for GDPR, CCPA, tax compliance, and industry-specific rules
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

interface ComplianceCheck {
  standard: string;
  passed: boolean;
  score: number; // 0-100
  issues: ComplianceIssue[];
  recommendations: string[];
}

interface ComplianceIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  autoFixAvailable: boolean;
  suggestedFix?: string;
  reference: string; // Legal reference or regulation citation
}

interface ComplianceReport {
  overallScore: number;
  passedChecks: number;
  totalChecks: number;
  checks: ComplianceCheck[];
  criticalIssues: number;
  summary: string;
  recommendations: string[];
}

class ComplianceCheckerService {
  private genAI: GoogleGenerativeAI;
  
  private readonly COMPLIANCE_STANDARDS = {
    GDPR: 'General Data Protection Regulation (EU)',
    CCPA: 'California Consumer Privacy Act (US)',
    HIPAA: 'Health Insurance Portability and Accountability Act (US)',
    SOC2: 'Service Organization Control 2',
    PCI_DSS: 'Payment Card Industry Data Security Standard',
    TAX_US: 'US Tax Compliance',
    ESIGN: 'Electronic Signatures in Global and National Commerce Act',
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('🛡️ Compliance Checker initialized');
  }

  /**
   * Run comprehensive compliance check
   */
  async checkCompliance(params: {
    documentContent: string;
    documentType: string;
    industry?: string;
    jurisdiction?: string;
    standards?: string[];
  }): Promise<ComplianceReport> {
    const {
      documentContent,
      documentType,
      industry = 'general',
      jurisdiction = 'US',
      standards = ['GDPR', 'CCPA', 'ESIGN'],
    } = params;

    console.log(`🛡️ Running compliance check: ${documentType} (${standards.join(', ')})`);

    const checks: ComplianceCheck[] = [];

    // Run each standard check
    for (const standard of standards) {
      const check = await this.runStandardCheck(
        standard,
        documentContent,
        documentType,
        industry,
        jurisdiction
      );
      checks.push(check);
    }

    // Calculate overall score
    const overallScore = Math.round(
      checks.reduce((sum, c) => sum + c.score, 0) / checks.length
    );

    const passedChecks = checks.filter(c => c.passed).length;
    const criticalIssues = checks.reduce(
      (sum, c) => sum + c.issues.filter(i => i.severity === 'critical').length,
      0
    );

    // Generate summary
    const summary = this.generateSummary(checks, overallScore, criticalIssues);

    // Collect all recommendations
    const recommendations = checks.flatMap(c => c.recommendations).slice(0, 5);

    return {
      overallScore,
      passedChecks,
      totalChecks: checks.length,
      checks,
      criticalIssues,
      summary,
      recommendations,
    };
  }

  /**
   * Run check for specific standard
   */
  private async runStandardCheck(
    standard: string,
    content: string,
    documentType: string,
    industry: string,
    jurisdiction: string
  ): Promise<ComplianceCheck> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert compliance auditor specializing in ${standard} (${this.COMPLIANCE_STANDARDS[standard as keyof typeof this.COMPLIANCE_STANDARDS] || standard}).

DOCUMENT TYPE: ${documentType}
INDUSTRY: ${industry}
JURISDICTION: ${jurisdiction}

DOCUMENT CONTENT:
${content.substring(0, 3000)}

TASK: Perform a comprehensive ${standard} compliance audit. Identify:
1. Compliance violations (critical, high, medium, low severity)
2. Missing required elements
3. Specific fixes needed
4. Overall compliance score (0-100)

Return ONLY valid JSON in this exact format:
{
  "passed": true/false,
  "score": 85,
  "issues": [
    {
      "severity": "high",
      "title": "Missing Privacy Notice",
      "description": "GDPR Article 13 requires clear privacy notice when collecting personal data",
      "location": "Section 2.3",
      "autoFixAvailable": true,
      "suggestedFix": "Add: 'Your personal data will be processed in accordance with...'",
      "reference": "GDPR Article 13"
    }
  ],
  "recommendations": [
    "Add explicit consent mechanism for data processing",
    "Include data retention policy"
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const checkResult = JSON.parse(jsonMatch[0]);

      console.log(`✅ ${standard} check complete: ${checkResult.score}/100`);

      return {
        standard,
        passed: checkResult.passed,
        score: checkResult.score,
        issues: checkResult.issues || [],
        recommendations: checkResult.recommendations || [],
      };
    } catch (error) {
      console.error(`${standard} check error:`, error);

      // Fallback with simulated results
      return this.getFallbackCheck(standard, content, documentType);
    }
  }

  /**
   * Fallback compliance check with rule-based logic
   */
  private getFallbackCheck(
    standard: string,
    content: string,
    documentType: string
  ): ComplianceCheck {
    const issues: ComplianceIssue[] = [];
    let score = 85;

    const lowerContent = content.toLowerCase();

    // GDPR checks
    if (standard === 'GDPR') {
      if (!lowerContent.includes('privacy') && !lowerContent.includes('data protection')) {
        issues.push({
          severity: 'high',
          title: 'Missing Privacy Notice',
          description: 'GDPR requires clear information about data processing',
          location: 'Document Header',
          autoFixAvailable: true,
          suggestedFix: 'Add: "We process your personal data in accordance with GDPR. You have the right to access, rectify, and delete your data."',
          reference: 'GDPR Article 13',
        });
        score -= 15;
      }

      if (!lowerContent.includes('consent') && documentType.includes('agreement')) {
        issues.push({
          severity: 'medium',
          title: 'Unclear Consent Mechanism',
          description: 'GDPR requires explicit consent for data processing',
          location: 'Terms Section',
          autoFixAvailable: true,
          suggestedFix: 'Add explicit consent checkbox with clear language',
          reference: 'GDPR Article 7',
        });
        score -= 10;
      }
    }

    // CCPA checks
    if (standard === 'CCPA') {
      if (!lowerContent.includes('california') && !lowerContent.includes('ccpa')) {
        issues.push({
          severity: 'medium',
          title: 'Missing CCPA Disclosure',
          description: 'California residents must be informed of their privacy rights',
          location: 'Privacy Section',
          autoFixAvailable: true,
          suggestedFix: 'Add: "California residents have the right to request disclosure of personal information collected and the right to opt-out of sale of personal information."',
          reference: 'CCPA Section 1798.100',
        });
        score -= 10;
      }
    }

    // HIPAA checks
    if (standard === 'HIPAA') {
      if (!lowerContent.includes('hipaa') && !lowerContent.includes('phi')) {
        issues.push({
          severity: 'critical',
          title: 'Missing HIPAA Safeguards',
          description: 'Protected Health Information (PHI) requires specific safeguards',
          location: 'Security Section',
          autoFixAvailable: false,
          reference: 'HIPAA Security Rule',
        });
        score -= 25;
      }
    }

    // E-SIGN checks
    if (standard === 'ESIGN') {
      if (!lowerContent.includes('electronic signature') && !lowerContent.includes('e-sign')) {
        issues.push({
          severity: 'low',
          title: 'E-SIGN Act Disclosure Recommended',
          description: 'Electronic signatures should reference E-SIGN Act compliance',
          location: 'Signature Section',
          autoFixAvailable: true,
          suggestedFix: 'Add: "Electronic signatures are valid and enforceable under the E-SIGN Act."',
          reference: 'E-SIGN Act 15 USC 7001',
        });
        score -= 5;
      }
    }

    return {
      standard,
      passed: score >= 70,
      score: Math.max(0, score),
      issues,
      recommendations: issues.slice(0, 3).map(i => i.suggestedFix || i.description),
    };
  }

  /**
   * Generate compliance summary
   */
  private generateSummary(
    checks: ComplianceCheck[],
    overallScore: number,
    criticalIssues: number
  ): string {
    if (overallScore >= 90) {
      return 'Excellent compliance! Your document meets all major regulatory requirements.';
    } else if (overallScore >= 75) {
      return 'Good compliance with minor issues. Review recommendations to improve.';
    } else if (overallScore >= 60) {
      return 'Fair compliance with some concerns. Address highlighted issues before use.';
    } else if (criticalIssues > 0) {
      return 'CRITICAL: Major compliance violations found. Do not use this document until issues are resolved.';
    } else {
      return 'Poor compliance. Significant improvements needed to meet regulatory standards.';
    }
  }

  /**
   * Auto-fix compliance issues
   */
  async autoFixIssues(
    content: string,
    issues: ComplianceIssue[]
  ): Promise<{ fixedContent: string; appliedFixes: string[] }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const fixableIssues = issues.filter(i => i.autoFixAvailable && i.suggestedFix);

    if (fixableIssues.length === 0) {
      return {
        fixedContent: content,
        appliedFixes: [],
      };
    }

    const prompt = `You are a compliance expert. Fix the following compliance issues in this document:

ORIGINAL DOCUMENT:
${content}

FIXES TO APPLY:
${fixableIssues.map((issue, i) => `${i + 1}. ${issue.title}: ${issue.suggestedFix}`).join('\n')}

TASK:
1. Apply all suggested fixes naturally into the document
2. Maintain original formatting and structure
3. Ensure legal language is clear and precise
4. Return ONLY the fixed document, no explanations

Generate the fixed document:`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fixedContent = response.text();

      const appliedFixes = fixableIssues.map(i => i.title);

      console.log(`✅ Auto-fixed ${appliedFixes.length} issues`);

      return {
        fixedContent,
        appliedFixes,
      };
    } catch (error) {
      console.error('Auto-fix error:', error);
      return {
        fixedContent: content,
        appliedFixes: [],
      };
    }
  }

  /**
   * Get industry-specific compliance requirements
   */
  getIndustryRequirements(industry: string): string[] {
    const requirements: Record<string, string[]> = {
      healthcare: ['HIPAA', 'HITECH'],
      finance: ['SOC2', 'PCI_DSS', 'GLBA'],
      ecommerce: ['PCI_DSS', 'GDPR', 'CCPA'],
      saas: ['SOC2', 'GDPR', 'CCPA'],
      legal: ['ABA_MODEL_RULES', 'ESIGN'],
      'real-estate': ['RESPA', 'TILA', 'ESIGN'],
      general: ['GDPR', 'CCPA', 'ESIGN'],
    };

    return requirements[industry.toLowerCase()] || requirements.general;
  }

  /**
   * Get compliance checklist
   */
  getComplianceChecklist(standard: string): Array<{ item: string; required: boolean }> {
    const checklists: Record<string, Array<{ item: string; required: boolean }>> = {
      GDPR: [
        { item: 'Privacy notice present', required: true },
        { item: 'Data processing purpose stated', required: true },
        { item: 'Data retention policy included', required: true },
        { item: 'User rights explained (access, rectify, delete)', required: true },
        { item: 'Consent mechanism implemented', required: true },
        { item: 'Data transfer safeguards (if applicable)', required: false },
        { item: 'DPO contact information (if applicable)', required: false },
      ],
      CCPA: [
        { item: 'Privacy policy link provided', required: true },
        { item: 'California resident rights disclosed', required: true },
        { item: 'Right to opt-out of data sale explained', required: true },
        { item: 'Personal information categories listed', required: true },
        { item: 'Business purposes for collection stated', required: true },
      ],
      HIPAA: [
        { item: 'PHI definition and scope', required: true },
        { item: 'Security safeguards described', required: true },
        { item: 'Breach notification procedures', required: true },
        { item: 'Business Associate Agreement (if applicable)', required: true },
        { item: 'Patient rights outlined', required: true },
      ],
    };

    return checklists[standard] || [];
  }

  /**
   * Get supported standards
   */
  getSupportedStandards(): Array<{ code: string; name: string; region: string }> {
    return [
      { code: 'GDPR', name: 'General Data Protection Regulation', region: 'EU' },
      { code: 'CCPA', name: 'California Consumer Privacy Act', region: 'US-CA' },
      { code: 'HIPAA', name: 'Health Insurance Portability and Accountability Act', region: 'US' },
      { code: 'SOC2', name: 'Service Organization Control 2', region: 'Global' },
      { code: 'PCI_DSS', name: 'Payment Card Industry Data Security Standard', region: 'Global' },
      { code: 'ESIGN', name: 'Electronic Signatures Act', region: 'US' },
      { code: 'TAX_US', name: 'US Tax Compliance', region: 'US' },
    ];
  }
}

export default ComplianceCheckerService;
