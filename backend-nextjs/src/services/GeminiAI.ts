/**
 * Google Gemini AI Integration
 * Uses Google's Gemini API for document generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAI {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log(`✨ Gemini AI initialized`);
  }

  async generateDocument(
    type: string,
    context: Record<string, any>
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompts: Record<string, string> = {
      custom: `You are an expert document writer. The user has requested a custom document with the following specifications:

PROMPT: ${context.prompt || context.description || 'Create a professional document'}

${context.additionalDetails ? `ADDITIONAL DETAILS:\n${context.additionalDetails}` : ''}

Create a complete, professional, well-structured document that fulfills this request. Use proper formatting, clear sections, and professional language. Make it comprehensive and detailed.`,

      invoice: `You are a world-class graphic designer and accountant. Create an STUNNING, modern invoice with visual design elements.

COMPANY INFO:
- Name: ${context.companyName || 'Professional Services Inc.'}
- Address: ${context.companyAddress || '123 Business St.'}
- Email: ${context.companyEmail || 'billing@company.com'}
- Phone: ${context.companyPhone || '(555) 123-4567'}

CLIENT INFO:
- Name: ${context.clientName || 'Client Name'}
- Address: ${context.clientAddress || 'Client Address'}
- Email: ${context.clientEmail || 'client@email.com'}

INVOICE ITEMS:
${context.items || 'Professional services'}

QUANTITIES:
${context.quantities || '1'}

PRICES:
${context.prices || '1000'}

PAYMENT METHOD: ${context.paymentMethod || 'Bank Transfer'}
NOTE: ${context.note || 'Thank you for your business!'}

Create an ULTRA-MODERN, VISUALLY STUNNING invoice using Unicode box drawing characters and design elements:

═══════════════════════════════════════════════════════════════════════════════
█                                                                             █
█  [${context.companyLogo || 'YOUR LOGO'}]                                   NO. INV-${Date.now().toString().slice(-6)}
█                                                                             █
█  ████ ███  █ █   ██  ████ ███ ████                                         █
█    ██  █ █ █ █ █ █ █   ██ █   █                                           █
█  ██ ██ █ █ █  ███ █ █ ██  ██  ███                                         █
█  ████  █ ███   █  ███ ████ ███ ████                                       █
█                                                                             █
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│ DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}                                                                    │
│ DUE DATE: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  BILLED TO                       ┃    ┃  FROM                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫    ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                  ┃    ┃                                  ┃
┃  ${(context.clientName || 'Client Name').padEnd(30)}  ┃    ┃  ${(context.companyName || 'Your Company').padEnd(30)}  ┃
┃  ${(context.clientAddress || 'Client Address').padEnd(30)}  ┃    ┃  ${(context.companyAddress || '123 Business St.').padEnd(30)}  ┃
┃  ${(context.clientEmail || 'client@email.com').padEnd(30)}  ┃    ┃  ${(context.companyEmail || 'hello@company.com').padEnd(30)}  ┃
┃                                  ┃    ┃  ${(context.companyPhone || '(555) 123-4567').padEnd(30)}  ┃
┃                                  ┃    ┃                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


╔═════════════════════════════════════════════════════════════════════════════╗
║                            ITEMS & SERVICES                                 ║
╠═══════════════════════════════╤═══════════╤═══════════════╤═════════════════╣
║ DESCRIPTION                   │ QUANTITY  │ UNIT PRICE    │ AMOUNT          ║
╠═══════════════════════════════╪═══════════╪═══════════════╪═════════════════╣
[Create rows for each item with proper alignment]
╠═══════════════════════════════╧═══════════╧═══════════════╪═════════════════╣
║                                              SUBTOTAL      │ $[SUBTOTAL]     ║
║                                              TAX (0%)      │ $0.00           ║
╠════════════════════════════════════════════════════════════╪═════════════════╣
║                                              █ TOTAL █     │ █ $[TOTAL] █    ║
╚════════════════════════════════════════════════════════════╧═════════════════╝


┌─────────────────────────────────────────────────────────────────────────────┐
│ 💳 PAYMENT METHOD                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ ${context.paymentMethod || 'Bank Transfer'}                                                                        │
│                                                                             │
│ 💬 NOTE                                                                     │
│ ${context.note || 'Thank you for choosing us!'}                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

╔═════════════════════════════════════════════════════════════════════════════╗
║  PAYMENT INSTRUCTIONS                                                       ║
╠═════════════════════════════════════════════════════════════════════════════╣
║  • Payment due within 30 days                                               ║
║  • Please reference invoice number in payment                               ║
║  • Late payments subject to 1.5% monthly fee                                ║
║  • Contact us for payment arrangements: ${(context.companyEmail || 'billing@company.com').padEnd(30)}║
╚═════════════════════════════════════════════════════════════════════════════╝


            ╔════════════════════════════════════════════╗
            ║  Thank you for your business! 🙏           ║
            ║  We appreciate your continued partnership  ║
            ╚════════════════════════════════════════════╝


═══════════════════════════════════════════════════════════════════════════════
Questions? Contact us: ${context.companyEmail || 'hello@company.com'} | ${context.companyPhone || '(555) 123-4567'}
═══════════════════════════════════════════════════════════════════════════════

Make it BEAUTIFUL with proper alignment, spacing, and visual hierarchy!`,

      nda: `You are a corporate lawyer. Create a comprehensive NDA.

Parties:
- Party 1: ${context.party1 || 'Company A'}
- Party 2: ${context.party2 || 'Company B'}
- Purpose: ${context.purpose || 'Business collaboration'}
- Term: ${context.term || '2'} years

Create a complete, professional NDA with all standard clauses, definitions, obligations, and signature blocks.`,

      contract: `You are a business contracts specialist. Create a detailed Service Agreement.

Provider: ${context.provider || 'Service Provider'}
Client: ${context.client || 'Client Company'}
Services: ${context.service || 'Professional services'}
Duration: ${context.duration || '6 months'}
Value: ${context.value || '$50,000'}

Create a comprehensive service contract with scope, timeline, payment terms, IP rights, and all standard clauses.`,

      proposal: `You are a business development expert. Create a compelling proposal.

Client: ${context.client || 'Client'}
Project: ${context.project || 'Project'}
Budget: ${context.budget || '$50,000'}
Timeline: ${context.timeline || '3 months'}

Create a persuasive, detailed business proposal with executive summary, approach, pricing, and call to action.`,

      receipt: `You are a finance administrator. Create a detailed payment receipt.

Amount: ${context.amount || '$100'}
Method: ${context.method || 'Credit Card'}
Reference: ${context.reference || 'REF-' + Date.now()}
For: ${context.for || 'Services'}

Create a professional, official payment receipt with all necessary details.`,

      quote: `You are a sales professional. Create a detailed quotation.

Service: ${context.service || 'Professional Services'}
Quantity: ${context.quantity || '1'}
Price: ${context.price || '$5,000'}
Valid Until: ${context.validUntil || '30 days'}

Create a comprehensive, professional price quotation with terms and acceptance instructions.`,
    };

    // Add fraud analysis prompt if needed
    if (type === 'fraud-analysis') {
      const fraudPrompt = context.prompt || `Analyze document for fraud indicators`;
      
      const prompt = fraudPrompt;
      
      try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
      } catch (error) {
        console.error('Gemini AI error:', error);
        throw new Error('Failed to generate fraud analysis');
      }
    }

    const prompt = prompts[type.toLowerCase()] || prompts.invoice;

    try {
      const result = await model.generateContent([
        {
          text: `You are an expert business document writer. Create professional, detailed documents with proper formatting.

${prompt}

IMPORTANT: 
- Use proper spacing and alignment
- Make it look professional and clean
- Include all necessary sections
- Use clear formatting`
        }
      ]);

      const response = await result.response;
      const content = response.text();
      
      console.log(`✅ Generated ${type} document with Gemini (${content.length} chars)`);
      return content;
    } catch (error) {
      console.error('Gemini AI error:', error);
      return this.getFallbackDocument(type, context);
    }
  }

  private getFallbackDocument(type: string, context: any): string {
    const date = new Date().toLocaleDateString();
    const invoiceNum = `INV-${Date.now()}`;
    
    // Parse items, quantities, and prices for invoice
    let itemsTable = '';
    if (type === 'invoice' && context.items && context.quantities && context.prices) {
      const items = context.items.split('\n').filter((s: string) => s.trim());
      const quantities = context.quantities.split('\n').filter((s: string) => s.trim());
      const prices = context.prices.split('\n').filter((s: string) => s.trim());
      
      let total = 0;
      items.forEach((item: string, i: number) => {
        const qty = parseInt(quantities[i] || '1');
        const price = parseFloat(prices[i] || '0');
        const amount = qty * price;
        total += amount;
        
        itemsTable += `${item.padEnd(30)}${qty.toString().padEnd(12)}$${price.toFixed(2).padEnd(12)}$${amount.toFixed(2)}\n`;
      });
      
      itemsTable += `\n${''.padEnd(54)}Total${' '.repeat(6)}$${total.toFixed(2)}`;
    }

    const templates: Record<string, string> = {
      invoice: `╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  ${context.companyLogo || '[YOUR LOGO]'}                           NO. ${invoiceNum}        ║
║                                                                               ║
║  ██ ███  █ █   ██  ████ ███ ████                                            ║
║   ██  █ █ █ █ █ █ █   ██ █   █                                             ║
║  █ █ ██ █ █  ███ █ █ ██  ██  ███                                           ║
║  ████  █ ███   █  ███ ████ ███ ████                                        ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────────┐
│ 📅 DATE: ${date}                                                              │
│ 📆 DUE DATE: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}                                                       │
└───────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📧 BILLED TO                     ┃    ┃  🏢 FROM                          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫    ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                   ┃    ┃                                   ┃
┃  ${(context.clientName || 'Client Name').padEnd(33)}┃    ┃  ${(context.companyName || 'Your Company').padEnd(33)}┃
┃  ${(context.clientAddress || '123 Client St.').padEnd(33)}┃    ┃  ${(context.companyAddress || '123 Business St.').padEnd(33)}┃
┃  ${(context.clientEmail || 'client@email.com').padEnd(33)}┃    ┃  ${(context.companyEmail || 'hello@company.com').padEnd(33)}┃
┃                                   ┃    ┃  ${(context.companyPhone || '(555) 123-4567').padEnd(33)}┃
┃                                   ┃    ┃                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


╔═══════════════════════════════════════════════════════════════════════════════╗
║                         💼 ITEMS & SERVICES                                   ║
╠═══════════════════════════╤═══════════╤════════════════╤══════════════════════╣
║ DESCRIPTION               │ QUANTITY  │ UNIT PRICE     │ AMOUNT               ║
╠═══════════════════════════╪═══════════╪════════════════╪══════════════════════╣
${itemsTable || '║ Professional Services     │     1     │    $1,000.00   │        $1,000.00     ║'}
╠═══════════════════════════╧═══════════╧════════════════╪══════════════════════╣
║                                            SUBTOTAL     │  $${(context.total || '1000.00').padStart(17)}  ║
║                                            TAX (0%)     │  $${('0.00').padStart(17)}  ║
╠════════════════════════════════════════════════════════╪══════════════════════╣
║                                       █ TOTAL DUE █     │ █ $${(context.total || '1000.00').padStart(15)} █  ║
╚════════════════════════════════════════════════════════╧══════════════════════╝


┌───────────────────────────────────────────────────────────────────────────────┐
│ 💳 PAYMENT METHOD: ${(context.paymentMethod || 'Bank Transfer').padEnd(55)}│
│                                                                               │
│ 💬 NOTE: ${(context.note || 'Thank you for your business!').padEnd(63)}│
└───────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════════╗
║  💰 PAYMENT INSTRUCTIONS                                                      ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║  • Payment due within 30 days of invoice date                                 ║
║  • Please reference invoice number with payment                               ║
║  • Late payments subject to 1.5% monthly interest fee                         ║
║  • Contact ${(context.companyEmail || 'billing@company.com').padEnd(40)} for questions        ║
╚═══════════════════════════════════════════════════════════════════════════════╝


              ╔══════════════════════════════════════════════╗
              ║  ✨ Thank you for your business! 🙏         ║
              ║     We appreciate your partnership           ║
              ╚══════════════════════════════════════════════╝


═══════════════════════════════════════════════════════════════════════════════
📧 ${context.companyEmail || 'hello@company.com'}  |  📞 ${context.companyPhone || '(555) 123-4567'}
═══════════════════════════════════════════════════════════════════════════════`,

      nda: `NON-DISCLOSURE AGREEMENT

Date: ${date}

BETWEEN: ${context.party1 || 'Party A'}
AND: ${context.party2 || 'Party B'}

PURPOSE: ${context.purpose || 'Business collaboration'}

This NDA protects confidential information shared between parties for ${context.term || '2'} years.

[Full NDA clauses would be here]

Signatures: _________________    _________________`,
      
      // ... other templates
    };

    return templates[type.toLowerCase()] || `Document: ${type}\nDate: ${date}\n\nGenerated successfully.`;
  }
}

export default GeminiAI;
