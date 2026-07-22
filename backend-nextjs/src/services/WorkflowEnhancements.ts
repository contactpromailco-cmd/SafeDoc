/**
 * Workflow Enhancements Service
 * Implements Phase 4: Workflow Expansions & Delights
 */

import { RiskLevel } from '@safedoc/shared';

interface EscrowMilestone {
  id: string;
  name: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed';
  lockedAt?: Date;
  releaseConditions: string[];
  verificationRequired: boolean;
}

interface PricingHistory {
  date: Date;
  service: string;
  amount: number;
  changeFromPrevious?: number;
  changePercentage?: number;
}

interface DarkPatternAlert {
  type: 'price_increase' | 'new_fee' | 'changed_terms' | 'tier_change';
  severity: RiskLevel;
  description: string;
  oldValue: string;
  newValue: string;
  detectedAt: Date;
}

class WorkflowEnhancements {
  /**
   * Phase 4.1: One-Click Milestone Escrow
   * Performance-locked payment infrastructure
   */
  async createMilestoneEscrow(
    projectId: string,
    milestones: Array<{
      name: string;
      amount: number;
      conditions: string[];
    }>
  ): Promise<EscrowMilestone[]> {
    return milestones.map((milestone, idx) => ({
      id: `escrow-${projectId}-${idx}`,
      name: milestone.name,
      amount: milestone.amount,
      status: 'pending',
      releaseConditions: milestone.conditions,
      verificationRequired: true,
    }));
  }

  async lockMilestonePayment(escrowId: string): Promise<EscrowMilestone> {
    return {
      id: escrowId,
      name: 'Sample Milestone',
      amount: 5000,
      status: 'locked',
      lockedAt: new Date(),
      releaseConditions: ['Client sign-off', 'Deliverables verified'],
      verificationRequired: true,
    };
  }

  async verifyAndRelease(escrowId: string, verificationProof: string): Promise<boolean> {
    // In production, verify cryptographic proof of completion
    console.log(`Verifying escrow ${escrowId} with proof: ${verificationProof}`);
    return true;
  }

  /**
   * Phase 4.2: Dark-Pattern Pricing Tracker
   * Detects stealth fee increases and subscription changes
   */
  async trackPricingHistory(
    vendorId: string,
    service: string
  ): Promise<PricingHistory[]> {
    // In production, query historical pricing database
    const history: PricingHistory[] = [
      {
        date: new Date('2024-01-01'),
        service,
        amount: 100.0,
      },
      {
        date: new Date('2024-06-01'),
        service,
        amount: 105.0,
        changeFromPrevious: 5.0,
        changePercentage: 5.0,
      },
      {
        date: new Date('2025-01-01'),
        service,
        amount: 115.0,
        changeFromPrevious: 10.0,
        changePercentage: 9.52,
      },
    ];

    return history;
  }

  async detectDarkPatterns(
    vendorId: string,
    currentInvoice: any
  ): Promise<DarkPatternAlert[]> {
    const alerts: DarkPatternAlert[] = [];
    const history = await this.trackPricingHistory(vendorId, currentInvoice.service);

    if (history.length > 1) {
      const previous = history[history.length - 2];
      const current = history[history.length - 1];

      if (current.changePercentage && current.changePercentage > 5) {
        alerts.push({
          type: 'price_increase',
          severity: current.changePercentage > 15 ? RiskLevel.HIGH : RiskLevel.MEDIUM,
          description: 'Unannounced price increase detected',
          oldValue: `$${previous.amount.toFixed(2)}`,
          newValue: `$${current.amount.toFixed(2)}`,
          detectedAt: new Date(),
        });
      }
    }

    // Check for new line items
    if (currentInvoice.lineItems) {
      const newFees = currentInvoice.lineItems.filter(
        (item: any) => item.description.toLowerCase().includes('fee') && item.isNew
      );

      for (const fee of newFees) {
        alerts.push({
          type: 'new_fee',
          severity: RiskLevel.MEDIUM,
          description: `New fee added: ${fee.description}`,
          oldValue: 'Not present',
          newValue: `$${fee.amount.toFixed(2)}`,
          detectedAt: new Date(),
        });
      }
    }

    return alerts;
  }

  /**
   * Phase 4.3: Self-Destructing Pre-Approvals
   * Time-locked authorization documents
   */
  async createSelfDestructingApproval(
    approvalType: string,
    expirationHours: number,
    content: string
  ): Promise<{
    approvalId: string;
    expiresAt: Date;
    encryptedContent: string;
    accessToken: string;
  }> {
    const approvalId = `approval-${Date.now()}`;
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    // In production, use proper encryption
    const encryptedContent = Buffer.from(content).toString('base64');
    const accessToken = this.generateSecureToken();

    return {
      approvalId,
      expiresAt,
      encryptedContent,
      accessToken,
    };
  }

  async accessApproval(approvalId: string, accessToken: string): Promise<string | null> {
    // In production, verify token and check expiration
    // If expired, return null and destroy content
    return 'Approval content (if not expired)';
  }

  /**
   * Phase 4.4: Command Parser for Zen Mode
   * Parses natural language commands into document structures
   */
  parseZenCommand(input: string): {
    command: string;
    type: string;
    context: Record<string, any>;
  } | null {
    const trimmed = input.trim();

    if (!trimmed.startsWith('/')) {
      return null;
    }

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const patterns: Record<string, any> = {
      '/invoice': {
        type: 'INVOICE',
        parseContext: (text: string) => {
          const amountMatch = text.match(/\$?([\d,]+\.?\d*)/);
          const toMatch = text.match(/to\s+([^,\n]+)/i);
          return {
            amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
            to: toMatch ? toMatch[1].trim() : 'Client',
            description: text,
          };
        },
      },
      '/contract': {
        type: 'CONTRACT',
        parseContext: (text: string) => ({ terms: text }),
      },
      '/nda': {
        type: 'NDA',
        parseContext: (text: string) => {
          const parties = text.match(/between\s+([^and]+)\s+and\s+([^\n]+)/i);
          return {
            party1: parties ? parties[1].trim() : 'Party A',
            party2: parties ? parties[2].trim() : 'Party B',
          };
        },
      },
    };

    const pattern = patterns[command];
    if (!pattern) {
      return null;
    }

    return {
      command,
      type: pattern.type,
      context: pattern.parseContext(args),
    };
  }

  /**
   * Helper methods
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Additional workflow features
   */
  async generateComplianceReport(documents: any[]): Promise<string> {
    const totalDocuments = documents.length;
    const highRisk = documents.filter((d) => d.riskLevel === 'HIGH' || d.riskLevel === 'CRITICAL').length;
    
    return `
# Compliance Report

**Generated:** ${new Date().toLocaleDateString()}
**Total Documents Analyzed:** ${totalDocuments}
**High Risk Items:** ${highRisk}

## Summary
${highRisk > 0 ? `⚠️ ${highRisk} document(s) require immediate attention` : '✅ All documents within acceptable risk levels'}

## Recommendations
${highRisk > 0 ? '- Review high-risk documents before processing\n- Contact vendors for clarification\n- Consider additional verification' : '- Continue standard processing\n- Maintain regular monitoring'}
`;
  }
}

export default WorkflowEnhancements;
