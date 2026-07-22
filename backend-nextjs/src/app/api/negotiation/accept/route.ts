import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
});

// Shared session storage (in production, use database)
// This should be shared with the suggest route
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
    const { sessionId, suggestionId, acceptedBy } = await request.json();

    console.log(`✅ Party ${acceptedBy} accepted suggestion ${suggestionId}`);

    const session = negotiationSessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const acceptedSuggestion = session.suggestions.find((s: any) => s.id === suggestionId);
    if (!acceptedSuggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    // Generate updated document with agreed terms
    const updatedContent = `NEGOTIATED AGREEMENT

Reached on: ${new Date().toLocaleString()}

AGREED TERMS:
${acceptedSuggestion.text}

NEGOTIATION HISTORY:
${session.suggestions
  .filter((s: any) => s.party !== 'AI')
  .map((s: any, i: number) => `${i + 1}. Party ${s.party}: ${s.text}`)
  .join('\n')}

AI MEDIATOR ANALYSIS:
Fairness Score: ${acceptedSuggestion.fairnessScore}%
Recommendation: ${acceptedSuggestion.text}

STATUS: ✅ ACCEPTED by Party ${acceptedBy}

This agreement reflects a fair compromise reached through AI-mediated negotiation.

Signatures:
Party A: _________________
Party B: _________________

Date: ${new Date().toLocaleDateString()}`;

    // Create document
    const document = {
      metadata: {
        id: generateId(),
        title: `Negotiated Agreement - ${new Date().toLocaleDateString()}`,
        type: 'CONTRACT',
        createdAt: new Date(),
        modifiedAt: new Date(),
        source: 'negotiation',
      },
      content: updatedContent,
    };

    // Clean up session
    negotiationSessions.delete(sessionId);

    // Broadcast completion
    await broadcastToChannel(`negotiation-${sessionId}`, 'negotiation-complete', {
      document,
      acceptedBy,
    });

    return NextResponse.json({
      success: true,
      document,
      message: 'Agreement reached!',
    });
  } catch (error) {
    console.error('Accept error:', error);
    return NextResponse.json(
      { error: 'Failed to accept suggestion' },
      { status: 500 }
    );
  }
}
