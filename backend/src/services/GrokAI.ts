/**
 * Grok AI Integration
 * Uses xAI's Grok API for document generation
 */

import OpenAI from 'openai';

class GrokAI {
  private clients: OpenAI[];
  private currentKeyIndex = 0;

  constructor() {
    const keys = [
      process.env.GROK_API_KEY_1,
      process.env.GROK_API_KEY_2,
      process.env.GROK_API_KEY_3,
    ].filter(Boolean) as string[];

    this.clients = keys.map(
      (key) =>
        new OpenAI({
          apiKey: key,
          baseURL: 'https://api.x.ai/v1',
        })
    );

    console.log(`✨ Grok AI initialized with ${this.clients.length} API keys`);
  }

  private getClient(): OpenAI {
    const client = this.clients[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.clients.length;
    return client;
  }

  async generateDocument(
    type: string,
    context: Record<string, any>
  ): Promise<string> {
    const client = this.getClient();

    const prompts: Record<string, string> = {
      invoice: `You are a professional accountant. Generate a complete, detailed, and professional invoice document.

Client Details:
- Client Name: ${context.client || 'Valued Customer'}
- Amount: ${context.amount || '$1,000'}
- Services/Items: ${context.items || 'Professional consulting services'}

Requirements:
1. Create a properly formatted invoice with:
   - Professional header with "INVOICE" title
   - Invoice number (format: INV-${Date.now()})
   - Issue date: ${new Date().toLocaleDateString()}
   - Due date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
   
2. Bill From section (use realistic company):
   - Company name
   - Full address
   - Phone and email
   
3. Bill To section with the client name provided

4. Itemized breakdown table with:
   - Description of services (expand on the items provided, be specific and detailed)
   - Quantity or hours
   - Rate per unit
   - Line total
   - Subtotal
   - Tax (if applicable)
   - TOTAL in bold

5. Payment terms and instructions
6. Bank details for payment
7. Professional thank you note

Make it look professional and complete. Use proper formatting with sections, bold text for totals, and clear structure.`,

      nda: `You are a corporate lawyer. Generate a comprehensive Non-Disclosure Agreement.

Parties:
- Party 1: ${context.party1 || 'Company A'}
- Party 2: ${context.party2 || 'Company B'}
- Purpose: ${context.purpose || 'Business collaboration and partnership discussions'}

Create a complete NDA with:
1. Title and preamble with effective date
2. Definitions section (what constitutes confidential information)
3. Obligations of receiving party
4. Exclusions from confidential information
5. Term and termination clauses
6. Return of materials clause
7. No license clause
8. Governing law
9. Signature blocks

Use formal legal language but keep it readable. Make it professionally detailed.`,

      contract: `You are a business contracts specialist. Generate a comprehensive Service Agreement.

Details:
- Service Provider: ${context.party1 || 'Provider Company'}
- Client: ${context.party2 || 'Client Company'}
- Services: ${context.service || 'Professional services'}

Create a complete service contract including:
1. Agreement header and date
2. Parties section with full details
3. Scope of Work (detailed breakdown of services)
4. Timeline and milestones
5. Payment terms (schedule, amounts, late fees)
6. Intellectual property rights
7. Confidentiality clause
8. Warranties and representations
9. Limitation of liability
10. Termination conditions
11. Dispute resolution
12. General provisions
13. Signature blocks

Make it comprehensive and professional.`,

      proposal: `You are a business development expert. Create a compelling business proposal.

Project Details:
- Client: ${context.client || 'Prospective Client'}
- Project: ${context.project || 'Business Initiative'}
- Budget: ${context.budget || 'To be determined'}

Generate a complete proposal with:
1. Cover page with title and date
2. Executive Summary (compelling overview)
3. Company Background (create a realistic company profile)
4. Understanding of Client Needs
5. Proposed Solution (detailed, creative approach)
6. Project Timeline with milestones
7. Team and Resources
8. Pricing breakdown (aligned with budget)
9. Terms and Conditions
10. Call to Action

Be persuasive, professional, and detailed. Make the client want to accept!`,

      receipt: `You are a finance administrator. Generate a detailed payment receipt.

Payment Details:
- Amount: ${context.amount || '$100'}
- Payment Method: ${context.method || 'Credit Card'}
- Reference: ${context.reference || 'REF-' + Date.now()}

Create a professional receipt with:
1. "PAYMENT RECEIPT" header
2. Receipt number and date
3. Received From section
4. Payment details (amount in numbers and words)
5. Payment method and transaction ID
6. What the payment was for (be specific)
7. Balance remaining (if applicable)
8. Thank you message
9. Company contact information

Make it official and complete.`,

      quote: `You are a sales professional. Generate a detailed price quotation.

Quote Details:
- Service/Product: ${context.service || 'Professional Services'}
- Quantity: ${context.quantity || '1'}
- Price: ${context.price || '$500'}

Create a comprehensive quotation with:
1. "PRICE QUOTATION" header
2. Quote number and date
3. Valid until date (30 days from now)
4. Customer details section
5. Detailed description of what's being quoted (be specific about deliverables)
6. Pricing breakdown:
   - Item description
   - Specifications
   - Quantity
   - Unit price
   - Total
7. Terms and conditions
8. Payment terms
9. Validity period
10. Acceptance instructions

Make it detailed and professional to close the deal!`,
    };

    const prompt = prompts[type.toLowerCase()] || prompts.invoice;

    try {
      const completion = await client.chat.completions.create({
        model: 'grok-1',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert business document writer with 20 years of experience. Generate complete, professional, detailed business documents with proper formatting, structure, and professional language. Be thorough and make documents look authentic and ready to use.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      });

      const content = completion.choices[0]?.message?.content || '';
      console.log(`✅ Generated ${type} document (${content.length} chars)`);
      return content;
    } catch (error) {
      console.error('Grok AI error:', error);
      return this.getFallbackDocument(type, context);
    }
  }

  private getFallbackDocument(type: string, context: any): string {
    const date = new Date().toLocaleDateString();
    const invoiceNum = `INV-${Date.now()}`;
    const templates: Record<string, string> = {
      invoice: `═══════════════════════════════════════════════════════
                    INVOICE
═══════════════════════════════════════════════════════

Invoice #: ${invoiceNum}
Date: ${date}
Due Date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}

───────────────────────────────────────────────────────
BILL FROM:
Professional Services Inc.
123 Business Avenue, Suite 500
San Francisco, CA 94105
Phone: (415) 555-0123
Email: billing@professional-services.com
Tax ID: 94-1234567
───────────────────────────────────────────────────────

BILL TO:
${context.client || 'Valued Customer'}
[Client Address]
[Client Email]

───────────────────────────────────────────────────────
DESCRIPTION OF SERVICES
───────────────────────────────────────────────────────

${context.items || 'Professional Consulting Services'}

Hours/Qty: 40 hours
Rate: ${context.amount ? (parseFloat(context.amount.replace(/[^0-9.]/g, '')) / 40).toFixed(2) : '25.00'}/hour
───────────────────────────────────────────────────────

Subtotal:              ${context.amount || '$1,000.00'}
Tax (8.5%):            ${context.amount ? '$' + (parseFloat(context.amount.replace(/[^0-9.]/g, '')) * 0.085).toFixed(2) : '$85.00'}
───────────────────────────────────────────────────────
TOTAL DUE:             ${context.amount ? '$' + (parseFloat(context.amount.replace(/[^0-9.]/g, '')) * 1.085).toFixed(2) : '$1,085.00'}
═══════════════════════════════════════════════════════

PAYMENT TERMS:
• Payment is due within 30 days of invoice date
• Late payments subject to 1.5% monthly interest
• Please include invoice number with payment

PAYMENT METHODS:
Bank Transfer:
  Account: Professional Services Inc.
  Routing: 121000248
  Account #: ****5678
  
Check:
  Make payable to "Professional Services Inc."
  Mail to address above

───────────────────────────────────────────────────────
Thank you for your business!
For questions about this invoice, contact us at:
billing@professional-services.com | (415) 555-0123
═══════════════════════════════════════════════════════`,

      nda: `═══════════════════════════════════════════════════════
        NON-DISCLOSURE AGREEMENT
═══════════════════════════════════════════════════════

This Non-Disclosure Agreement ("Agreement") is entered into
as of ${date} ("Effective Date")

BETWEEN:

Party A: ${context.party1 || 'First Party'}
("Disclosing Party")

AND

Party B: ${context.party2 || 'Second Party'}  
("Receiving Party")

───────────────────────────────────────────────────────
1. PURPOSE
───────────────────────────────────────────────────────
${context.purpose || 'The parties wish to explore a business opportunity of mutual interest and in connection with this opportunity, Disclosing Party may share certain confidential technical and business information.'}

───────────────────────────────────────────────────────
2. CONFIDENTIAL INFORMATION
───────────────────────────────────────────────────────
"Confidential Information" means any data or information
that is proprietary to the Disclosing Party and not
generally known to the public, including but not limited to:

• Technical data, trade secrets, know-how
• Business operations, strategies, and methods
• Customer lists and supplier information
• Financial information
• Product plans and specifications

───────────────────────────────────────────────────────
3. OBLIGATIONS
───────────────────────────────────────────────────────
The Receiving Party agrees to:

a) Hold Confidential Information in strict confidence
b) Not disclose to any third parties
c) Use only for the Purpose stated above
d) Protect with same degree of care as own confidential info
e) Limit access to employees with need-to-know

───────────────────────────────────────────────────────
4. TERM
───────────────────────────────────────────────────────
This Agreement shall remain in effect for a period of
TWO (2) YEARS from the Effective Date.

───────────────────────────────────────────────────────
5. RETURN OF MATERIALS
───────────────────────────────────────────────────────
Upon termination, Receiving Party shall promptly return
or destroy all Confidential Information.

───────────────────────────────────────────────────────
SIGNATURES:
───────────────────────────────────────────────────────

${context.party1 || 'Party A'}          Date: __________
Signature: _____________________


${context.party2 || 'Party B'}          Date: __________
Signature: _____________________

═══════════════════════════════════════════════════════`,

      contract: `═══════════════════════════════════════════════════════
           SERVICE AGREEMENT
═══════════════════════════════════════════════════════

Date: ${date}
Contract Number: CNT-${Date.now()}

This Service Agreement ("Agreement") is entered into between:

SERVICE PROVIDER:
${context.party1 || 'Service Provider Company'}

CLIENT:
${context.party2 || 'Client Company'}

───────────────────────────────────────────────────────
1. SCOPE OF SERVICES
───────────────────────────────────────────────────────
Provider agrees to deliver the following services:

${context.service || 'Professional consulting and advisory services as mutually agreed upon between the parties.'}

───────────────────────────────────────────────────────
2. TIMELINE
───────────────────────────────────────────────────────
• Start Date: ${date}
• Estimated Completion: 90 days from start date
• Milestones to be defined in project plan

───────────────────────────────────────────────────────
3. COMPENSATION
───────────────────────────────────────────────────────
• Payment Structure: Time & Materials
• Hourly Rate: As per rate card
• Invoicing: Monthly in arrears
• Payment Terms: Net 30 days

───────────────────────────────────────────────────────
4. INTELLECTUAL PROPERTY
───────────────────────────────────────────────────────
All work product created under this Agreement shall be
owned by Client upon full payment.

───────────────────────────────────────────────────────
5. CONFIDENTIALITY
───────────────────────────────────────────────────────
Both parties agree to maintain confidentiality of
proprietary information shared during engagement.

───────────────────────────────────────────────────────
6. TERMINATION
───────────────────────────────────────────────────────
Either party may terminate with 30 days written notice.

───────────────────────────────────────────────────────
AGREED AND ACCEPTED:
───────────────────────────────────────────────────────

${context.party1 || 'Service Provider'}    Date: __________
Signature: _____________________


${context.party2 || 'Client'}              Date: __________
Signature: _____________________

═══════════════════════════════════════════════════════`,

      proposal: `═══════════════════════════════════════════════════════
          BUSINESS PROPOSAL
═══════════════════════════════════════════════════════

To: ${context.client || 'Prospective Client'}
From: Professional Services Team
Date: ${date}
Re: ${context.project || 'Business Initiative Proposal'}

───────────────────────────────────────────────────────
EXECUTIVE SUMMARY
───────────────────────────────────────────────────────
We are pleased to submit this proposal for your
consideration. Our team brings extensive experience
and proven expertise to deliver exceptional results
for your organization.

───────────────────────────────────────────────────────
PROJECT OBJECTIVES
───────────────────────────────────────────────────────
• Deliver high-quality, professional results
• Meet all project requirements and deadlines
• Maintain open communication throughout
• Ensure client satisfaction and success

───────────────────────────────────────────────────────
PROPOSED APPROACH
───────────────────────────────────────────────────────
Phase 1: Discovery & Planning (2 weeks)
  - Stakeholder interviews
  - Requirements gathering
  - Project plan development

Phase 2: Execution (6-8 weeks)
  - Implementation of solutions
  - Regular status updates
  - Quality assurance

Phase 3: Delivery & Support (2 weeks)
  - Final delivery
  - Training and handoff
  - Post-launch support

───────────────────────────────────────────────────────
INVESTMENT
───────────────────────────────────────────────────────
Total Project Cost: ${context.budget || '$50,000'}

Payment Schedule:
• 30% upon contract signing
• 40% at project midpoint
• 30% upon final delivery

───────────────────────────────────────────────────────
WHY CHOOSE US
───────────────────────────────────────────────────────
✓ 10+ years of industry experience
✓ Proven track record of success
✓ Dedicated project management
✓ Competitive pricing
✓ Quality guarantee

───────────────────────────────────────────────────────
NEXT STEPS
───────────────────────────────────────────────────────
We look forward to the opportunity to work with you.
Please contact us to discuss this proposal further.

Contact: proposals@professional-services.com
Phone: (415) 555-0123

═══════════════════════════════════════════════════════`,

      receipt: `═══════════════════════════════════════════════════════
              PAYMENT RECEIPT
═══════════════════════════════════════════════════════

Receipt #: REC-${Date.now()}
Date: ${date}
Time: ${new Date().toLocaleTimeString()}

───────────────────────────────────────────────────────
RECEIVED FROM:
[Customer Name/Company]
───────────────────────────────────────────────────────

PAYMENT DETAILS:
───────────────────────────────────────────────────────
Amount Received: ${context.amount || '$100.00'}

Amount in Words: ${context.amount ? this.numberToWords(parseFloat(context.amount.replace(/[^0-9.]/g, ''))) : 'One Hundred'} Dollars

Payment Method: ${context.method || 'Credit Card'}
Transaction ID: ${context.reference || 'TXN-' + Date.now()}
Authorization Code: AUTH-${Math.random().toString(36).substring(7).toUpperCase()}

───────────────────────────────────────────────────────
PAYMENT FOR:
───────────────────────────────────────────────────────
Services rendered as per invoice/agreement

Balance Remaining: $0.00 (PAID IN FULL)

───────────────────────────────────────────────────────
RECEIVED BY:
Professional Services Inc.
123 Business Avenue, Suite 500
San Francisco, CA 94105
Tax ID: 94-1234567

───────────────────────────────────────────────────────
Thank you for your prompt payment!

For questions regarding this receipt, please contact:
accounting@professional-services.com | (415) 555-0123

This receipt is valid without signature.
Please retain for your records.
═══════════════════════════════════════════════════════`,

      quote: `═══════════════════════════════════════════════════════
            PRICE QUOTATION
═══════════════════════════════════════════════════════

Quote #: QUO-${Date.now()}
Date: ${date}
Valid Until: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}

───────────────────────────────────────────────────────
FROM:
Professional Services Inc.
123 Business Avenue, Suite 500
San Francisco, CA 94105
Phone: (415) 555-0123
Email: sales@professional-services.com
───────────────────────────────────────────────────────

PREPARED FOR:
[Client Name]
[Client Company]

───────────────────────────────────────────────────────
QUOTATION DETAILS
───────────────────────────────────────────────────────

Item/Service: ${context.service || 'Professional Services Package'}

Description:
Comprehensive professional services including consultation,
implementation, and ongoing support as specified.

Specifications:
• Full-service delivery
• Dedicated project management
• Quality assurance included
• Documentation provided

───────────────────────────────────────────────────────
PRICING
───────────────────────────────────────────────────────

Quantity:          ${context.quantity || '1'} unit(s)
Unit Price:        ${context.price || '$5,000.00'}
───────────────────────────────────────────────────────
Subtotal:          ${context.price || '$5,000.00'}
Tax (8.5%):        ${context.price ? '$' + (parseFloat(context.price.replace(/[^0-9.]/g, '')) * 0.085).toFixed(2) : '$425.00'}
───────────────────────────────────────────────────────
TOTAL:             ${context.price ? '$' + (parseFloat(context.price.replace(/[^0-9.]/g, '')) * 1.085).toFixed(2) : '$5,425.00'}
═══════════════════════════════════════════════════════

TERMS & CONDITIONS:
───────────────────────────────────────────────────────
• Quote valid for 30 days from date above
• Prices subject to change after validity period
• Payment terms: 50% deposit, 50% on completion
• Delivery timeline: 4-6 weeks from order
• Standard warranty applies

───────────────────────────────────────────────────────
TO ACCEPT THIS QUOTE:
───────────────────────────────────────────────────────
1. Sign and date below
2. Email to sales@professional-services.com
3. Pay deposit to begin work

Client Signature: _____________________  Date: __________

───────────────────────────────────────────────────────
Questions? Contact us anytime:
sales@professional-services.com | (415) 555-0123
═══════════════════════════════════════════════════════`
    };

    return templates[type.toLowerCase()] || `# ${type.toUpperCase()}\n\nDate: ${date}\n\nDocument generated successfully.`;
  }

  private numberToWords(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + this.numberToWords(num % 100) : '');
    return num.toString();
  }
}

export default GrokAI;
