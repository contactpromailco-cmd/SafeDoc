import { NextRequest, NextResponse } from 'next/server';
import GeminiAI from '@/services/GeminiAI';
import Pusher from 'pusher';

// Initialize services
const geminiAI = new GeminiAI();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
});

// In-memory negotiation sessions (in production, use database)
const negotiationSessions = new Map<string, any>();

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function broadcastToChannel(channel: string, event: string, data: any) {
  try {
    await pusher.trigger(channel, event, data);
  } catch (error) {
    console.error('Pusher broadcast error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, party, suggestion, documentId, partyName } = await request.json();

    console.log(`🤝 Negotiation suggestion from Party ${party}: "${suggestion}"`);

    if (!sessionId || !party || !suggestion) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create session
    if (!negotiationSessions.has(sessionId)) {
      negotiationSessions.set(sessionId, {
        id: sessionId,
        documentId,
        suggestions: [],
        createdAt: new Date(),
      });
    }

    const session = negotiationSessions.get(sessionId);

    // Add party's suggestion
    const partySuggestion = {
      id: generateId(),
      party,
      partyName,
      text: suggestion,
      timestamp: new Date(),
    };

    session.suggestions.push(partySuggestion);

    // Use AI to analyze and suggest compromise
    const previousSuggestions = session.suggestions.slice(0, -1);
    const hasMultipleSuggestions = previousSuggestions.length > 0;
    
    const aiPrompt = `You are a world-class contract negotiator with expertise in game theory, behavioral economics, and win-win deal structuring. You've closed billion-dollar deals and understand the psychology of negotiation.

CURRENT SITUATION:
Party ${party} proposes: "${suggestion}"

${hasMultipleSuggestions ? `NEGOTIATION HISTORY:
${previousSuggestions.map((s: any, i: number) => `Round ${i + 1} - Party ${s.party}: "${s.text}"`).join('\n')}

PATTERN ANALYSIS: ${previousSuggestions.length > 1 ? 'Multiple rounds indicate resistance. Need creative breakthrough.' : 'Counter-offer received. Parties are actively negotiating.'}` : 'FIRST PROPOSAL - Establish fair baseline for negotiation.'}

YOUR MISSION:
Create a compromise that BOTH parties will genuinely want to accept. Use advanced negotiation techniques:

1. **ANCHORING**: Use the middle ground as anchor, add value on both sides
2. **FRAMING**: Present the deal in a way that highlights benefits for BOTH parties
3. **VALUE CREATION**: Don't just split the difference - ADD new value (bonuses, terms, flexibility)
4. **CONTINGENT CONTRACTS**: Use if/then scenarios to reduce risk
5. **POST-SETTLEMENT SETTLEMENTS**: Suggest room for future improvements

OUTPUT EXACTLY IN THIS FORMAT:
FAIRNESS_SCORE: [70-95 based on true balance]
COMPROMISE: [Your brilliant, specific, value-adding compromise in one clear sentence]
WHY_THIS_WORKS: [One sentence explaining the psychology/strategy]
ALTERNATIVE: [A second creative option if they want choices]

BE BOLD. BE SPECIFIC. CREATE VALUE. MAKE BOTH PARTIES EXCITED TO ACCEPT.`;

    let aiResponse: string;
    try {
      aiResponse = await geminiAI.generateDocument('custom', { prompt: aiPrompt });
    } catch (aiError) {
      console.error('AI generation failed:', aiError);
      aiResponse = `FAIRNESS_SCORE: 85\nCOMPROMISE: How about finding a middle ground: ${suggestion.toLowerCase()} with additional flexibility to accommodate both parties' needs?`;
    }

    // Parse AI response
    const fairnessMatch = aiResponse.match(/FAIRNESS[_\s]*SCORE[:\s]*(\d+)/i);
    const compromiseMatch = aiResponse.match(/COMPROMISE[:\s]*(.+?)(?=WHY_THIS_WORKS|ALTERNATIVE|$)/is);
    const whyWorksMatch = aiResponse.match(/WHY_THIS_WORKS[:\s]*(.+?)(?=ALTERNATIVE|$)/is);
    const alternativeMatch = aiResponse.match(/ALTERNATIVE[:\s]*(.+?)$/is);

    let fairnessScore = fairnessMatch ? parseInt(fairnessMatch[1]) : 75;
    let compromise = compromiseMatch ? compromiseMatch[1].trim() : '';
    let whyWorks = whyWorksMatch ? whyWorksMatch[1].trim() : '';
    let alternative = alternativeMatch ? alternativeMatch[1].trim() : '';

    // Clean up extracted text
    [compromise, whyWorks, alternative].forEach((text, idx) => {
      if (text) {
        const cleaned = text.split('\n')[0].trim().replace(/^["']|["']$/g, '');
        if (idx === 0) compromise = cleaned;
        else if (idx === 1) whyWorks = cleaned;
        else alternative = cleaned;
      }
    });

    // Fallback logic if AI response not specific enough
    if (!compromise || compromise.length < 10) {
      compromise = `Let's find middle ground with additional flexibility for both parties`;
      fairnessScore = 75;
    }

    // Ensure fairness score is reasonable
    if (fairnessScore < 65) fairnessScore = 72;
    if (fairnessScore > 95) fairnessScore = 90;

    // Add AI mediator suggestion
    const aiSuggestion = {
      id: generateId(),
      party: 'AI',
      partyName: 'AI Mediator',
      text: compromise,
      fairnessScore,
      whyWorks: whyWorks || 'This compromise balances both parties\' core interests effectively',
      alternative: alternative || null,
      timestamp: new Date(),
    };

    session.suggestions.push(aiSuggestion);

    // Broadcast to all parties via Pusher
    try {
      await broadcastToChannel(`negotiation-${sessionId}`, 'suggestion-added', {
        suggestions: [partySuggestion, aiSuggestion],
      });
    } catch (pusherError) {
      console.warn('Pusher broadcast failed:', pusherError);
    }

    console.log(`🤖 AI Mediator: "${compromise.substring(0, 60)}..." (${fairnessScore}% fair)`);
    if (whyWorks) console.log(`💡 Strategy: ${whyWorks.substring(0, 80)}...`);

    return NextResponse.json({
      success: true,
      suggestions: [partySuggestion, aiSuggestion],
      session,
    });
  } catch (error) {
    console.error('Negotiation suggestion error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process suggestion',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
