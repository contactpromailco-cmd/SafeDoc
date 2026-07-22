import { NextRequest, NextResponse } from 'next/server';
import GeminiAI from '@/services/GeminiAI';

const geminiAI = new GeminiAI();

export async function POST(request: NextRequest) {
  try {
    const { documentText } = await request.json();

    if (!documentText) {
      return NextResponse.json(
        { error: 'Document text required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Analyzing document for fraud (${documentText.length} chars)...`);

    const analysisPrompt = `You are a forensic document analyst and fraud detection expert. Analyze this document for potential fraud indicators:

DOCUMENT:
${documentText}

Analyze for:
1. Suspicious language patterns
2. Inconsistent information
3. Missing required details
4. Unusual formatting
5. Potential red flags

Provide a detailed fraud risk assessment with:
- RISK LEVEL: Low/Medium/High
- CONFIDENCE: percentage
- KEY FINDINGS: bullet points of specific concerns
- RECOMMENDATIONS: what to verify

Be thorough but fair.`;

    const analysis = await geminiAI.generateDocument('fraud-analysis', { 
      prompt: analysisPrompt 
    });

    console.log(`✅ Fraud analysis complete`);

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Fraud analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
