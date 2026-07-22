import { NextRequest, NextResponse } from 'next/server';
import { GeminiAI } from '@/services/GeminiAI';
import { InvoiceImageGenerator } from '@/services/InvoiceImageGenerator';
import { AuthService } from '@/services/AuthService';

const geminiAI = new GeminiAI();
const imageGenerator = new InvoiceImageGenerator();
const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token and check limits
    const user = authService.verifyToken(token);
    const canGenerate = await authService.canGenerateDocument(user.email);
    
    if (!canGenerate.allowed) {
      return NextResponse.json({ 
        error: canGenerate.reason,
        upgradeRequired: true 
      }, { status: 403 });
    }

    const body = await request.json();
    const { documentType, context } = body;

    // Generate document with AI
    let content = '';
    if (documentType === 'ai-custom') {
      content = await geminiAI.generateCustomDocument(context.prompt, context.additionalDetails);
    } else {
      content = await geminiAI.generateDocument(documentType, context);
    }

    // Generate image for invoice
    let imageData;
    if (documentType === 'invoice' && context.companyLogo) {
      imageData = await imageGenerator.generateInvoiceImage({
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        companyName: context.companyName,
        companyAddress: context.companyAddress,
        companyEmail: context.companyEmail,
        companyPhone: context.companyPhone,
        companyLogo: context.companyLogo,
        clientName: context.clientName,
        clientAddress: context.clientAddress,
        clientEmail: context.clientEmail,
        items: context.items?.split('\n') || [],
        quantities: context.quantities?.split('\n').map(Number) || [],
        prices: context.prices?.split('\n').map(Number) || [],
        note: context.note || ''
      });
    }

    // Track usage
    await authService.trackDocumentGeneration(user.email);

    const document = {
      metadata: {
        id: `doc-${Date.now()}`,
        title: `${documentType.toUpperCase()} - ${new Date().toLocaleDateString()}`,
        type: documentType.toUpperCase(),
        createdAt: new Date()
      },
      content,
      imageData
    };

    // Check if overage
    const overage = canGenerate.isOverage ? {
      message: canGenerate.overageMessage,
      cost: canGenerate.overageCost
    } : undefined;

    return NextResponse.json({
      success: true,
      document,
      overage
    });

  } catch (error: any) {
    console.error('Document generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate document',
      details: error.message 
    }, { status: 500 });
  }
}
