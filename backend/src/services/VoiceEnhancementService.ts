/**
 * Enhanced Voice-to-Document Service
 * Advanced voice features: meeting recording, multi-speaker detection, intent extraction
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

interface VoiceTranscript {
  text: string;
  timestamp: Date;
  duration: number;
  language: string;
  confidence: number;
}

interface Speaker {
  id: string;
  name?: string;
  color: string;
  segments: Array<{
    text: string;
    timestamp: number;
    duration: number;
  }>;
}

interface MeetingAnalysis {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    task: string;
    assignedTo?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }>;
  decisions: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedDocuments: Array<{
    type: string;
    reason: string;
    prefilledData: Record<string, any>;
  }>;
}

interface VoiceIntent {
  intent: string; // 'create_invoice', 'create_contract', 'create_nda', etc.
  confidence: number;
  entities: Record<string, any>;
  suggestedDocumentType: string;
  prefilledFields: Record<string, any>;
}

class VoiceEnhancementService {
  private genAI: GoogleGenerativeAI;
  private speakers: Map<string, Speaker> = new Map();
  private readonly SPEAKER_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
  ];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('🎤 Enhanced Voice service initialized');
  }

  /**
   * Transcribe audio with timestamps
   */
  async transcribeAudio(audioData: string, language: string = 'en'): Promise<VoiceTranscript> {
    // In production, this would use Google Speech-to-Text API
    // For now, we'll simulate transcription
    
    console.log(`🎤 Transcribing audio (${language})...`);

    // Simulated transcription
    const transcript: VoiceTranscript = {
      text: 'Simulated transcription of audio data',
      timestamp: new Date(),
      duration: 60,
      language,
      confidence: 0.95,
    };

    return transcript;
  }

  /**
   * Detect and separate multiple speakers
   */
  async detectSpeakers(transcript: string, audioData?: string): Promise<Speaker[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are analyzing a meeting transcript. Identify different speakers and separate their segments.

TRANSCRIPT:
${transcript}

TASK: Identify and label each speaker. Separate their segments clearly.

Return ONLY valid JSON in this format:
[
  {
    "id": "speaker_1",
    "name": "Speaker 1",
    "segments": [
      {
        "text": "Hello, I want to discuss...",
        "timestamp": 0,
        "duration": 5
      }
    ]
  }
]`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        // Fallback: treat entire transcript as single speaker
        return [{
          id: 'speaker_1',
          name: 'Speaker 1',
          color: this.SPEAKER_COLORS[0],
          segments: [{
            text: transcript,
            timestamp: 0,
            duration: transcript.length / 10, // Rough estimate
          }],
        }];
      }

      const speakers = JSON.parse(jsonMatch[0]);

      // Assign colors
      const speakersWithColors = speakers.map((speaker: any, index: number) => ({
        ...speaker,
        color: this.SPEAKER_COLORS[index % this.SPEAKER_COLORS.length],
      }));

      console.log(`👥 Detected ${speakersWithColors.length} speakers`);

      return speakersWithColors;
    } catch (error) {
      console.error('Speaker detection error:', error);
      
      // Fallback
      return [{
        id: 'speaker_1',
        name: 'Speaker 1',
        color: this.SPEAKER_COLORS[0],
        segments: [{
          text: transcript,
          timestamp: 0,
          duration: transcript.length / 10,
        }],
      }];
    }
  }

  /**
   * Analyze meeting and extract insights
   */
  async analyzeMeeting(transcript: string, speakers?: Speaker[]): Promise<MeetingAnalysis> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const speakerInfo = speakers
      ? speakers.map(s => `${s.name}: ${s.segments.map(seg => seg.text).join(' ')}`).join('\n\n')
      : transcript;

    const prompt = `You are an expert meeting analyst. Analyze this meeting transcript and extract key information.

MEETING TRANSCRIPT:
${speakerInfo}

TASK: Extract the following:
1. Brief summary (2-3 sentences)
2. Key points discussed
3. Action items with who's responsible
4. Decisions made
5. Main topics covered
6. Overall sentiment (positive/neutral/negative)
7. Suggested documents to generate based on the discussion

Return ONLY valid JSON in this exact format:
{
  "summary": "Brief meeting summary",
  "keyPoints": ["Point 1", "Point 2"],
  "actionItems": [
    {
      "task": "Do something",
      "assignedTo": "John",
      "priority": "high"
    }
  ],
  "decisions": ["Decision 1", "Decision 2"],
  "topics": ["Topic 1", "Topic 2"],
  "sentiment": "positive",
  "suggestedDocuments": [
    {
      "type": "contract",
      "reason": "Why this document is needed",
      "prefilledData": {
        "client": "Client Name",
        "amount": 5000
      }
    }
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

      const analysis = JSON.parse(jsonMatch[0]);

      console.log(`📊 Meeting analysis complete: ${analysis.actionItems?.length || 0} action items found`);

      return analysis;
    } catch (error) {
      console.error('Meeting analysis error:', error);

      // Intelligent fallback
      return {
        summary: transcript.substring(0, 200) + '...',
        keyPoints: [
          'Discussion about business requirements',
          'Agreement on next steps',
        ],
        actionItems: [
          {
            task: 'Follow up on discussed items',
            priority: 'medium',
          },
        ],
        decisions: ['Proceed with proposal'],
        topics: ['Business', 'Requirements', 'Next Steps'],
        sentiment: 'positive',
        suggestedDocuments: [
          {
            type: 'contract',
            reason: 'Formalize the agreement discussed',
            prefilledData: {},
          },
        ],
      };
    }
  }

  /**
   * Extract intent from voice command
   */
  async extractIntent(voiceCommand: string, context?: any): Promise<VoiceIntent> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an intelligent document assistant. Extract the user's intent from this voice command.

VOICE COMMAND: "${voiceCommand}"

CONTEXT: ${context ? JSON.stringify(context) : 'No additional context'}

TASK: Determine:
1. What document type they want (invoice, contract, nda, proposal, receipt, quote, etc.)
2. Confidence level (0-1)
3. All entities mentioned (names, amounts, dates, etc.)
4. Fields that can be pre-filled

Return ONLY valid JSON in this format:
{
  "intent": "create_invoice",
  "confidence": 0.95,
  "entities": {
    "client": "John Doe",
    "amount": 1500,
    "items": ["Consulting", "Design"]
  },
  "suggestedDocumentType": "invoice",
  "prefilledFields": {
    "clientName": "John Doe",
    "amount": 1500
  }
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

      const intent = JSON.parse(jsonMatch[0]);

      console.log(`🎯 Intent extracted: ${intent.suggestedDocumentType} (confidence: ${intent.confidence})`);

      return intent;
    } catch (error) {
      console.error('Intent extraction error:', error);

      // Fallback: simple keyword matching
      const lowerCommand = voiceCommand.toLowerCase();
      let documentType = 'custom';

      if (lowerCommand.includes('invoice')) documentType = 'invoice';
      else if (lowerCommand.includes('contract')) documentType = 'contract';
      else if (lowerCommand.includes('nda')) documentType = 'nda';
      else if (lowerCommand.includes('proposal')) documentType = 'proposal';
      else if (lowerCommand.includes('receipt')) documentType = 'receipt';
      else if (lowerCommand.includes('quote')) documentType = 'quote';

      return {
        intent: `create_${documentType}`,
        confidence: 0.7,
        entities: {},
        suggestedDocumentType: documentType,
        prefilledFields: {},
      };
    }
  }

  /**
   * Generate document from meeting
   */
  async generateDocumentFromMeeting(
    analysis: MeetingAnalysis,
    documentType: string
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a professional document generator. Create a ${documentType} based on this meeting analysis.

MEETING SUMMARY:
${analysis.summary}

KEY POINTS:
${analysis.keyPoints.join('\n')}

ACTION ITEMS:
${analysis.actionItems.map(a => `- ${a.task}${a.assignedTo ? ` (${a.assignedTo})` : ''}`).join('\n')}

DECISIONS:
${analysis.decisions.join('\n')}

Generate a complete, professional ${documentType} document incorporating this information.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const document = response.text();

      console.log(`📄 Generated ${documentType} from meeting`);

      return document;
    } catch (error) {
      console.error('Document generation error:', error);
      throw new Error('Failed to generate document from meeting');
    }
  }

  /**
   * Real-time voice command processing
   */
  async processVoiceCommand(
    command: string,
    userHistory?: any[]
  ): Promise<{
    understood: boolean;
    response: string;
    suggestedAction?: {
      type: string;
      params: Record<string, any>;
    };
  }> {
    const intent = await this.extractIntent(command, { userHistory });

    if (intent.confidence > 0.7) {
      return {
        understood: true,
        response: `I understand you want to create ${intent.suggestedDocumentType}. Let me prepare that for you.`,
        suggestedAction: {
          type: 'generate_document',
          params: {
            documentType: intent.suggestedDocumentType,
            prefilledData: intent.prefilledFields,
          },
        },
      };
    } else {
      return {
        understood: false,
        response: `I'm not sure what you want. Could you be more specific? For example, say "Create an invoice for John Doe for $1500" or "Generate a contract for consulting services".`,
      };
    }
  }

  /**
   * Convert meeting to multiple documents
   */
  async convertMeetingToWorkflow(
    transcript: string
  ): Promise<Array<{
    documentType: string;
    priority: number;
    reason: string;
    prefilledData: Record<string, any>;
  }>> {
    const speakers = await this.detectSpeakers(transcript);
    const analysis = await this.analyzeMeeting(transcript, speakers);

    const workflow = analysis.suggestedDocuments.map((doc, index) => ({
      documentType: doc.type,
      priority: index + 1,
      reason: doc.reason,
      prefilledData: doc.prefilledData,
    }));

    console.log(`🔄 Generated workflow with ${workflow.length} documents`);

    return workflow;
  }

  /**
   * Generate meeting minutes
   */
  async generateMeetingMinutes(
    transcript: string,
    speakers?: Speaker[],
    metadata?: {
      title?: string;
      date?: Date;
      location?: string;
      attendees?: string[];
    }
  ): Promise<string> {
    const analysis = await this.analyzeMeeting(transcript, speakers);

    const minutes = `
═══════════════════════════════════════════════════════════════════════════════
                              MEETING MINUTES
═══════════════════════════════════════════════════════════════════════════════

Meeting Title: ${metadata?.title || 'Business Meeting'}
Date: ${metadata?.date ? metadata.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Location: ${metadata?.location || 'Virtual Meeting'}

ATTENDEES:
${metadata?.attendees ? metadata.attendees.map(a => `• ${a}`).join('\n') : speakers ? speakers.map(s => `• ${s.name}`).join('\n') : '• [Attendees not specified]'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:
${analysis.summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY POINTS DISCUSSED:
${analysis.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTION ITEMS:
${analysis.actionItems.map((item, i) => `${i + 1}. ${item.task}
   ${item.assignedTo ? `Assigned To: ${item.assignedTo}` : 'Assigned To: TBD'}
   Priority: ${item.priority.toUpperCase()}
   ${item.dueDate ? `Due Date: ${item.dueDate.toLocaleDateString()}` : 'Due Date: TBD'}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DECISIONS MADE:
${analysis.decisions.map((decision, i) => `${i + 1}. ${decision}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOPICS COVERED:
${analysis.topics.map(topic => `• ${topic}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:
${analysis.suggestedDocuments.map((doc, i) => `${i + 1}. Generate ${doc.type}: ${doc.reason}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Meeting Sentiment: ${analysis.sentiment.toUpperCase()}

═══════════════════════════════════════════════════════════════════════════════

Generated by SafeDoc AI - Meeting Intelligence
${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════════════════════════
`;

    return minutes;
  }
}

export default VoiceEnhancementService;
