/**
 * AI Document Chain Service
 * Suggests related documents based on context and workflow
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

interface DocumentContext {
  type: string;
  content: string;
  metadata?: {
    client?: string;
    amount?: number;
    date?: string;
    parties?: string[];
  };
}

interface ChainSuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  prefilledData?: Record<string, any>;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

class DocumentChainService {
  private genAI: GoogleGenerativeAI;
  private workflowPatterns: Map<string, string[]> = new Map();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Initialize common workflow patterns
    this.initializeWorkflowPatterns();
    
    console.log('🔗 Document Chain service initialized');
  }

  private initializeWorkflowPatterns() {
    // Define common document workflows
    this.workflowPatterns.set('invoice', [
      'receipt',
      'payment_reminder',
      'delivery_note',
      'contract',
    ]);

    this.workflowPatterns.set('contract', [
      'invoice',
      'nda',
      'amendment',
      'termination_letter',
    ]);

    this.workflowPatterns.set('proposal', [
      'contract',
      'invoice',
      'presentation',
      'follow_up_email',
    ]);

    this.workflowPatterns.set('nda', [
      'contract',
      'data_processing_agreement',
      'consulting_agreement',
    ]);

    this.workflowPatterns.set('quote', [
      'invoice',
      'proposal',
      'order_confirmation',
    ]);

    this.workflowPatterns.set('receipt', [
      'thank_you_email',
      'warranty_document',
      'feedback_request',
    ]);
  }

  /**
   * Get AI-powered document suggestions
   */
  async getSuggestions(context: DocumentContext): Promise<ChainSuggestion[]> {
    try {
      const suggestions: ChainSuggestion[] = [];

      // Get pattern-based suggestions
      const patternSuggestions = this.getPatternBasedSuggestions(context);
      suggestions.push(...patternSuggestions);

      // Get AI-powered contextual suggestions
      const aiSuggestions = await this.getAISuggestions(context);
      suggestions.push(...aiSuggestions);

      // Sort by confidence and remove duplicates
      const uniqueSuggestions = this.deduplicateAndSort(suggestions);

      console.log(`💡 Generated ${uniqueSuggestions.length} suggestions for ${context.type}`);

      return uniqueSuggestions.slice(0, 5); // Return top 5
    } catch (error) {
      console.error('Document chain error:', error);
      return this.getPatternBasedSuggestions(context);
    }
  }

  /**
   * Get pattern-based suggestions (fast, offline)
   */
  private getPatternBasedSuggestions(context: DocumentContext): ChainSuggestion[] {
    const patterns = this.workflowPatterns.get(context.type.toLowerCase()) || [];
    
    return patterns.map((type, index) => ({
      id: `pattern_${type}_${Date.now()}_${index}`,
      type,
      title: this.getDocumentTitle(type),
      description: this.getDocumentDescription(type, context),
      confidence: 0.7 - (index * 0.1),
      prefilledData: this.extractPrefilledData(context, type),
      reason: this.getReasonForSuggestion(context.type, type),
      urgency: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }));
  }

  /**
   * Get AI-powered contextual suggestions
   */
  private async getAISuggestions(context: DocumentContext): Promise<ChainSuggestion[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a business workflow expert. A user just created a ${context.type} document.

Context:
${context.metadata ? JSON.stringify(context.metadata, null, 2) : 'No additional context'}

Content preview:
${context.content.substring(0, 500)}...

Suggest 3 logical next documents this user might need. For each suggestion, provide:
1. Document type (one word, lowercase, e.g., "invoice", "receipt", "contract")
2. Title (short, descriptive)
3. Description (one sentence explaining why)
4. Confidence score (0-1)
5. Reason (one sentence explaining the workflow logic)

Return ONLY valid JSON in this exact format:
[
  {
    "type": "document_type",
    "title": "Document Title",
    "description": "Why they need this",
    "confidence": 0.9,
    "reason": "Workflow logic"
  }
]`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const aiSuggestions = JSON.parse(jsonMatch[0]);

      return aiSuggestions.map((s: any, index: number) => ({
        id: `ai_${s.type}_${Date.now()}_${index}`,
        type: s.type,
        title: s.title,
        description: s.description,
        confidence: s.confidence || 0.8,
        prefilledData: this.extractPrefilledData(context, s.type),
        reason: s.reason,
        urgency: s.confidence > 0.8 ? 'high' : s.confidence > 0.6 ? 'medium' : 'low',
      }));
    } catch (error) {
      console.error('AI suggestion error:', error);
      return [];
    }
  }

  /**
   * Extract data that can be prefilled in the next document
   */
  private extractPrefilledData(context: DocumentContext, targetType: string): Record<string, any> {
    const prefilled: Record<string, any> = {};

    if (context.metadata) {
      // Common fields that transfer between documents
      if (context.metadata.client) {
        prefilled.clientName = context.metadata.client;
      }

      if (context.metadata.amount) {
        prefilled.amount = context.metadata.amount;
      }

      if (context.metadata.date) {
        prefilled.originalDate = context.metadata.date;
      }

      if (context.metadata.parties) {
        prefilled.parties = context.metadata.parties;
      }
    }

    // Type-specific prefilling logic
    if (context.type === 'invoice' && targetType === 'receipt') {
      prefilled.paymentMethod = 'Pending';
      prefilled.invoiceReference = `INV-${Date.now()}`;
    }

    if (context.type === 'proposal' && targetType === 'contract') {
      prefilled.proposalReference = `PROP-${Date.now()}`;
    }

    return prefilled;
  }

  /**
   * Get human-readable document title
   */
  private getDocumentTitle(type: string): string {
    const titles: Record<string, string> = {
      invoice: 'Invoice',
      receipt: 'Payment Receipt',
      contract: 'Service Contract',
      nda: 'Non-Disclosure Agreement',
      proposal: 'Business Proposal',
      quote: 'Price Quotation',
      payment_reminder: 'Payment Reminder',
      delivery_note: 'Delivery Note',
      amendment: 'Contract Amendment',
      termination_letter: 'Termination Letter',
      follow_up_email: 'Follow-up Email',
      thank_you_email: 'Thank You Email',
      order_confirmation: 'Order Confirmation',
    };

    return titles[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get description for document type
   */
  private getDocumentDescription(type: string, context: DocumentContext): string {
    const descriptions: Record<string, string> = {
      receipt: 'Generate payment receipt after invoice is paid',
      payment_reminder: 'Send friendly payment reminder to client',
      delivery_note: 'Create delivery confirmation document',
      contract: 'Draft service contract based on proposal',
      invoice: 'Generate invoice for services rendered',
      follow_up_email: 'Send follow-up email to client',
      thank_you_email: 'Send thank you message after payment',
    };

    return descriptions[type] || `Create ${this.getDocumentTitle(type)} document`;
  }

  /**
   * Explain why this document is suggested
   */
  private getReasonForSuggestion(sourceType: string, targetType: string): string {
    const reasons: Record<string, Record<string, string>> = {
      invoice: {
        receipt: 'Typical next step after payment is received',
        payment_reminder: 'Useful if payment becomes overdue',
        delivery_note: 'Required for physical goods/services',
        contract: 'May need formal contract terms',
      },
      contract: {
        invoice: 'Bill client after contract is signed',
        amendment: 'Modify contract terms if needed',
        termination_letter: 'End contract if necessary',
      },
      proposal: {
        contract: 'Convert accepted proposal to binding contract',
        follow_up_email: 'Follow up on proposal status',
        invoice: 'Bill for proposal acceptance fee',
      },
    };

    return reasons[sourceType]?.[targetType] || 'Common next step in this workflow';
  }

  /**
   * Remove duplicate suggestions and sort by confidence
   */
  private deduplicateAndSort(suggestions: ChainSuggestion[]): ChainSuggestion[] {
    const seen = new Set<string>();
    const unique: ChainSuggestion[] = [];

    for (const suggestion of suggestions) {
      if (!seen.has(suggestion.type)) {
        seen.add(suggestion.type);
        unique.push(suggestion);
      }
    }

    return unique.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Learn from user behavior (stores workflow patterns)
   */
  async learnFromUserBehavior(
    userId: string,
    sourceDoc: string,
    targetDoc: string
  ): Promise<void> {
    // In production, this would store to database
    console.log(`📚 Learning: User ${userId} created ${targetDoc} after ${sourceDoc}`);
    
    // Update workflow patterns based on actual usage
    const existing = this.workflowPatterns.get(sourceDoc) || [];
    if (!existing.includes(targetDoc)) {
      existing.unshift(targetDoc); // Add to front (highest priority)
      this.workflowPatterns.set(sourceDoc, existing.slice(0, 5)); // Keep top 5
    }
  }
}

export default DocumentChainService;
