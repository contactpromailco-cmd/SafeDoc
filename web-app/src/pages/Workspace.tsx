/**
 * Workspace Component - Modern Professional Design
 */

import React, { useState, useEffect } from 'react';
import { useWebSocketStore } from '../store/websocket-pusher';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import PricingModal from '../components/PricingModal';
import { API_URL } from '../config';

type DocumentTemplate = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  gradient: string;
  fields: Array<{
    name: string;
    label: string;
    placeholder: string;
    type?: 'text' | 'textarea' | 'number' | 'email' | 'date';
  }>;
};

const templates: DocumentTemplate[] = [
  {
    id: 'invoice',
    name: 'Invoice',
    icon: '💰',
    color: 'from-blue-200 to-blue-300',
    description: 'Professional invoice with itemized billing',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
    fields: [
      { name: 'clientName', label: 'Client Name', placeholder: 'Studio Shodwe' },
      { name: 'clientAddress', label: 'Client Address', placeholder: '123 Anywhere St., Any City' },
      { name: 'clientEmail', label: 'Client Email', placeholder: 'hello@client.com', type: 'email' },
      { name: 'items', label: 'Items/Services (one per line)', placeholder: 'Logo Design\nBanner (2x6m)\nPoster (1x2m)', type: 'textarea' },
      { name: 'quantities', label: 'Quantities (one per line)', placeholder: '1\n2\n3', type: 'textarea' },
      { name: 'prices', label: 'Unit Prices (one per line)', placeholder: '500\n45\n55', type: 'textarea' },
      { name: 'paymentMethod', label: 'Payment Method', placeholder: 'Cash' },
      { name: 'note', label: 'Note', placeholder: 'Thank you for choosing us!' },
    ]
  },
  {
    id: 'nda',
    name: 'NDA',
    icon: '🔒',
    color: 'from-purple-200 to-purple-300',
    description: 'Non-disclosure agreement',
    gradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
    fields: [
      { name: 'party1', label: 'Party 1 Name', placeholder: 'Company A' },
      { name: 'party2', label: 'Party 2 Name', placeholder: 'Company B' },
      { name: 'purpose', label: 'Purpose', placeholder: 'Business collaboration', type: 'textarea' },
      { name: 'term', label: 'Term (years)', placeholder: '2', type: 'number' },
    ]
  },
  {
    id: 'contract',
    name: 'Contract',
    icon: '📋',
    color: 'from-green-200 to-green-300',
    description: 'Business service agreement',
    gradient: 'bg-gradient-to-br from-green-50 to-green-100',
    fields: [
      { name: 'provider', label: 'Service Provider', placeholder: 'Your Company' },
      { name: 'client', label: 'Client', placeholder: 'Client Company' },
      { name: 'service', label: 'Service Description', placeholder: 'Software development services', type: 'textarea' },
      { name: 'duration', label: 'Contract Duration', placeholder: '6 months' },
      { name: 'value', label: 'Contract Value', placeholder: '$50,000' },
    ]
  },
  {
    id: 'proposal',
    name: 'Proposal',
    icon: '💼',
    color: 'from-pink-200 to-pink-300',
    description: 'Business proposal document',
    gradient: 'bg-gradient-to-br from-pink-50 to-pink-100',
    fields: [
      { name: 'client', label: 'Client Name', placeholder: 'Prospective Client' },
      { name: 'project', label: 'Project Name', placeholder: 'Website Redesign' },
      { name: 'budget', label: 'Budget', placeholder: '$50,000' },
      { name: 'timeline', label: 'Timeline', placeholder: '3 months' },
    ]
  },
  {
    id: 'receipt',
    name: 'Receipt',
    icon: '🧾',
    color: 'from-orange-200 to-orange-300',
    description: 'Payment receipt',
    gradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
    fields: [
      { name: 'amount', label: 'Amount', placeholder: '$250' },
      { name: 'method', label: 'Payment Method', placeholder: 'Credit Card' },
      { name: 'reference', label: 'Reference Number', placeholder: 'REF-12345' },
      { name: 'for', label: 'Payment For', placeholder: 'Services rendered' },
    ]
  },
  {
    id: 'quote',
    name: 'Quote',
    icon: '💭',
    color: 'from-cyan-200 to-cyan-300',
    description: 'Price quotation',
    gradient: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
    fields: [
      { name: 'service', label: 'Service/Product', placeholder: 'Web Development' },
      { name: 'quantity', label: 'Quantity', placeholder: '1', type: 'number' },
      { name: 'price', label: 'Price', placeholder: '$5,000' },
      { name: 'validUntil', label: 'Valid Until', placeholder: '30 days', type: 'date' },
    ]
  },
  {
    id: 'ai-custom',
    name: '🤖 AI Custom',
    icon: '✨',
    color: 'from-violet-200 via-fuchsia-200 to-pink-200',
    description: 'Generate ANY document with AI from your prompt',
    gradient: 'bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50',
    fields: [
      { name: 'prompt', label: 'What document do you want to create?', placeholder: 'Create a partnership agreement between two companies for a joint marketing campaign...', type: 'textarea' },
      { name: 'additionalDetails', label: 'Additional Details (Optional)', placeholder: 'Specific clauses, terms, dates, names, etc.', type: 'textarea' },
    ]
  },
];

const Workspace: React.FC = () => {
  const documents = useWebSocketStore((state) => state.appState.documents);
  const connected = useWebSocketStore((state) => state.connected);
  const { user, token, logout, isAuthenticated } = useAuth();
  
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Auth modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  // Email and customization options
  const [emailTo, setEmailTo] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'professional' | 'modern' | 'creative' | 'minimal'>('modern');
  
  // Company settings
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [companyName, setCompanyName] = useState('Your Company');
  const [companyAddress, setCompanyAddress] = useState('123 Anywhere St., Any City');
  const [companyEmail, setCompanyEmail] = useState('hello@yourcompany.com');
  const [companyPhone, setCompanyPhone] = useState('(555) 123-4567');

  // Fraud detection states
  const [fraudFile, setFraudFile] = useState<File | null>(null);
  const [fraudUrl, setFraudUrl] = useState('');
  const [fraudAnalyzing, setFraudAnalyzing] = useState(false);
  const [fraudResult, setFraudResult] = useState<any>(null);

  // Voice-to-document states
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceProcessing, setVoiceProcessing] = useState(false);

  // Smart memory state
  const [documentHistory, setDocumentHistory] = useState<any[]>([]);

  // Negotiation mode states
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [negotiationDoc, setNegotiationDoc] = useState<any>(null);
  const [negotiationSessionId, setNegotiationSessionId] = useState('');
  const [negotiationParty, setNegotiationParty] = useState<'A' | 'B'>('A');
  const [negotiationSuggestions, setNegotiationSuggestions] = useState<any[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [aiMediatorActive, setAiMediatorActive] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    const savedName = localStorage.getItem('companyName');
    const savedAddress = localStorage.getItem('companyAddress');
    const savedEmail = localStorage.getItem('companyEmail');
    const savedPhone = localStorage.getItem('companyPhone');
    
    if (savedLogo) setCompanyLogo(savedLogo);
    if (savedName) setCompanyName(savedName);
    if (savedAddress) setCompanyAddress(savedAddress);
    if (savedEmail) setCompanyEmail(savedEmail);
    if (savedPhone) setCompanyPhone(savedPhone);
  }, []);

  // Listen for new documents
  useEffect(() => {
    if (documents.length > 0 && generating) {
      const latestDoc = documents[documents.length - 1];
      setPreviewDoc(latestDoc);
      setShowPreview(true);
      setGenerating(false);
    }
  }, [documents]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCompanyLogo(base64);
        localStorage.setItem('companyLogo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyEmail', companyEmail);
    localStorage.setItem('companyPhone', companyPhone);
    setShowSettings(false);
  };

  const handleTemplateClick = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setShowModal(true);
    const initialData: Record<string, string> = {};
    template.fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Check if user is logged in
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setShowModal(false);
      return;
    }

    setGenerating(true);
    setShowModal(false);

    const contextWithCompany = {
      ...formData,
      companyName,
      companyAddress,
      companyEmail,
      companyPhone,
      companyLogo, // Pass actual logo data for image generation
      theme: selectedTheme,
      emailTo: sendEmail ? emailTo : undefined,
    };

    try {
      const response = await fetch(`${API_URL}/api/documents/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: selectedTemplate.id,
          context: contextWithCompany,
        }),
      });

      if (response.status === 403) {
        // Document limit reached
        alert('🚫 Document limit reached! Upgrade to generate more documents.');
        setShowPricingModal(true);
        setGenerating(false);
        return;
      }

      if (response.status === 401) {
        // Token expired
        alert('⏰ Session expired. Please login again.');
        setShowAuthModal(true);
        setGenerating(false);
        return;
      }

      const result = await response.json();
      
      if (result.success && result.document) {
        // Show preview immediately with the response data
        setPreviewDoc(result.document);
        setShowPreview(true);
        setGenerating(false);
        
        // Show overage notification if applicable
        if (result.overage) {
          alert(`✅ Document generated!\n\n💰 ${result.overage.message}\n\nYou can continue generating documents - overages will be billed at the end of the month.`);
        }
        
        // Show email confirmation if sent
        if (result.emailSent) {
          alert(`✅ Document sent to ${emailTo}!`);
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate document. Please try again.');
      setGenerating(false);
    }
  };

  const handleDownloadODF = (doc: any) => {
    // If document has imageData, download as PNG
    if (doc.imageData) {
      const a = document.createElement('a');
      a.href = doc.imageData;
      a.download = `${doc.metadata.title}.png`;
      a.click();
      return;
    }

    // Otherwise download as ODF
    fetch(`${API_URL}/api/documents/export-odf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: doc.metadata.id })
    })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.metadata.title}.odt`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Download failed:', error));
  };

  // Removed unused analyzeDocument function

  const handleFraudFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFraudFile(file);
      analyzeFraudDocument(file);
    }
  };

  // Snap & Generate handler
  const handleSnapGenerate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setGenerating(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;

        const response = await fetch(`${API_URL}/api/documents/snap-generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        });

        const result = await response.json();

        if (result.success) {
          setPreviewDoc(result.document);
          setShowPreview(true);
          alert('📸 Paper document digitized successfully!');
          
          // Add to history
          setDocumentHistory([...documentHistory, result.document]);
        } else {
          alert('Failed to process image. Please try again.');
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Snap generate error:', error);
      alert('Failed to process image.');
    } finally {
      setGenerating(false);
    }
  };

  const analyzeFraudDocument = async (file?: File, url?: string) => {
    if (!file && !url) return;

    setFraudAnalyzing(true);
    setFraudResult(null);

    try {
      let documentData: string;

      if (file) {
        // Convert file to base64
        const reader = new FileReader();
        documentData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        documentData = url!;
      }

      // Call fraud detection API
      const response = await fetch(`${API_URL}/api/documents/analyze-fraud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentData,
          source: file ? 'upload' : 'url',
          analysisTypes: ['metadata', 'font', 'entity', 'behavioral', 'account', 'ai']
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFraudResult(result.analysis);
      } else {
        alert('Analysis failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Fraud analysis error:', error);
      alert('Failed to analyze document. Please try again.');
    } finally {
      setFraudAnalyzing(false);
    }
  };

  const handleUrlAnalysis = () => {
    if (!fraudUrl) {
      alert('Please enter a document URL');
      return;
    }
    analyzeFraudDocument(undefined, fraudUrl);
  };

  // Voice-to-document functionality
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript('Listening...');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setIsListening(false);
      
      // Process voice command
      await processVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      alert('Voice recognition error. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = async (transcript: string) => {
    setVoiceProcessing(true);

    try {
      // Use AI to understand voice command and generate document
      const response = await fetch(`${API_URL}/api/documents/voice-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceCommand: transcript,
          userHistory: documentHistory.slice(-5), // Last 5 documents for context
          companyInfo: {
            name: companyName,
            email: companyEmail,
            phone: companyPhone,
            address: companyAddress,
            logo: companyLogo,
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Show preview
        setPreviewDoc(result.document);
        setShowPreview(true);
        
        // Add to history
        setDocumentHistory([...documentHistory, result.document]);
        
        alert(`✅ Document created from voice: "${transcript}"`);
      } else {
        alert('Failed to generate document from voice. Try being more specific.');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      alert('Failed to process voice command.');
    } finally {
      setVoiceProcessing(false);
      setVoiceTranscript('');
    }
  };

  // Start negotiation session
  const startNegotiationSession = async (document: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const sessionId = `negotiation-${Date.now()}`;
    setNegotiationSessionId(sessionId);
    setNegotiationDoc(document);
    setNegotiationSuggestions([]);
    setShowNegotiation(true);

    // Subscribe to negotiation channel via Pusher
    // Pusher channels are automatically available through our setup
    console.log(`🤝 Started negotiation session: ${sessionId}`);
  };

  // Submit negotiation suggestion
  const submitNegotiationSuggestion = async () => {
    if (!currentSuggestion.trim()) return;

    setAiMediatorActive(true);

    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available (optional for demo)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/negotiation/suggest`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId: negotiationSessionId,
          party: negotiationParty,
          suggestion: currentSuggestion,
          documentId: negotiationDoc?.metadata?.id,
          partyName: user?.name || `Party ${negotiationParty}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API error:', result);
        alert(`Error: ${result.error || 'Failed to submit suggestion'}\nDetails: ${result.details || 'Check console'}`);
        setAiMediatorActive(false);
        return;
      }

      if (result.success) {
        // Add all suggestions (yours + other party + AI mediator)
        setNegotiationSuggestions([...negotiationSuggestions, ...result.suggestions]);
        setCurrentSuggestion('');
      } else {
        alert('Failed to submit suggestion: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Negotiation error:', error);
      alert('Failed to submit suggestion. Check backend console for errors.\n\nError: ' + (error instanceof Error ? error.message : 'Network error'));
    } finally {
      setAiMediatorActive(false);
    }
  };

  // Accept AI mediator's suggestion
  const acceptMediatorSuggestion = async (suggestion: any) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add auth token if available (optional for demo)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/negotiation/accept`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId: negotiationSessionId,
          suggestionId: suggestion.id,
          acceptedBy: negotiationParty,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Accept API error:', result);
        alert(`Error: ${result.error || 'Failed to accept suggestion'}`);
        return;
      }

      if (result.success) {
        alert('✅ Agreement reached! Updated document will be generated.');
        setShowNegotiation(false);
        
        // Generate updated document with accepted terms
        if (result.document) {
          setPreviewDoc(result.document);
          setShowPreview(true);
        }
      }
    } catch (error) {
      console.error('Accept error:', error);
      alert('Failed to accept suggestion: ' + (error instanceof Error ? error.message : 'Network error'));
    }
  };

  // Helper to generate unique IDs
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Floating Header */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-xl rounded-full px-8 py-3 shadow-xl border border-gray-200/50">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SafeDoc AI
            </h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-600">{connected ? 'Live' : 'Offline'}</span>
            </div>

            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
                  <span className="text-xs font-semibold text-purple-600">
                    {user.plan.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">
                    {user.documentsUsed}/{user.documentsLimit === 999999 ? '∞' : user.documentsLimit}
                    {user.overageCount > 0 && (
                      <span className="text-orange-600 ml-1" title={`Overage charges: $${user.overageCost.toFixed(2)}`}>
                        +{user.overageCount} (${user.overageCost.toFixed(2)})
                      </span>
                    )}
                  </span>
                </div>
                
                {user.plan === 'free' && (
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    ⚡ Upgrade
                  </button>
                )}

                <button
                  onClick={() => setShowSettings(true)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ⚙️
                </button>

                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title="Logout"
                >
                  🚪
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                >
                  🔓 Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth & Pricing Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        
        {/* User Welcome - Compact */}
        {isAuthenticated && user && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user.name} · <span className="text-gray-600 font-normal text-lg">{user.documentsLimit - user.documentsUsed} docs left</span>
            </h2>
          </div>
        )}

        {/* Killer Features - Compact 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* Voice-to-Document */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">🎤</div>
              <h3 className="text-lg font-bold text-gray-900">Voice-to-Document</h3>
            </div>
            <button
              onClick={startVoiceRecognition}
              disabled={isListening || voiceProcessing || !isAuthenticated}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                isListening ? 'bg-red-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? '● Recording...' : voiceProcessing ? '⏳ Processing...' : '🎤 Start Recording'}
            </button>
            {voiceTranscript && (
              <p className="text-xs text-gray-600 mt-2 italic truncate">"{voiceTranscript}"</p>
            )}
          </div>

          {/* Snap & Generate */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-xl">📸</div>
              <h3 className="text-lg font-bold text-gray-900">Snap & Generate</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-400 cursor-pointer">
                <input type="file" accept="image/*" capture="environment" className="hidden" id="cameraCapture" onChange={handleSnapGenerate} disabled={!isAuthenticated} />
                <div className="text-2xl">📷</div>
                <p className="text-xs font-semibold text-gray-700 mt-1">Camera</p>
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-400 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" id="imageUpload" onChange={handleSnapGenerate} disabled={!isAuthenticated} />
                <div className="text-2xl">🖼️</div>
                <p className="text-xs font-semibold text-gray-700 mt-1">Upload</p>
              </label>
            </div>
          </div>

          {/* Smart Contract Chains */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-xl">🔗</div>
              <h3 className="text-lg font-bold text-gray-900">Smart Chains</h3>
            </div>
            {documents.length > 0 ? (
              <button
                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all"
                onClick={() => {
                  const lastType = documents[documents.length - 1]?.metadata.type.toLowerCase();
                  const nextType = lastType === 'proposal' ? 'contract' : lastType === 'contract' ? 'invoice' : lastType === 'invoice' ? 'receipt' : 'proposal';
                  const template = templates.find(t => t.id === nextType);
                  if (template) handleTemplateClick(template);
                }}
              >
                ⚡ Create Follow-Up
              </button>
            ) : (
              <p className="text-sm text-gray-500">Create a document to see AI suggestions</p>
            )}
          </div>

          {/* Collaborative Negotiation */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-xl">🤝</div>
              <h3 className="text-lg font-bold text-gray-900">AI Negotiation</h3>
            </div>
            <button
              className="w-full bg-amber-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-all disabled:opacity-50"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                  return;
                }
                const sampleContract = {
                  metadata: { id: generateId(), title: 'Service Agreement - Negotiation Draft', type: 'CONTRACT', createdAt: new Date() },
                  content: 'SERVICE AGREEMENT\n\nPayment Terms: To be negotiated\nDelivery Timeline: To be negotiated',
                };
                startNegotiationSession(sampleContract);
              }}
              disabled={!isAuthenticated}
            >
              🤝 Start Session
            </button>
          </div>
        </div>

        {/* Document Templates - Compact Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Document Templates</h2>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                disabled={generating}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{template.icon}</div>
                  <h3 className="text-base font-bold text-gray-900">{template.name}</h3>
                </div>
                <p className="text-xs text-gray-600">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State - Compact */}
        {generating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
              <div className="animate-spin text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Creating Document</h3>
              <p className="text-sm text-gray-600">Please wait...</p>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Company Settings</h3>
                
                {/* Logo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {companyLogo && (
                      <img src={companyLogo} alt="Logo" className="w-20 h-20 object-contain border rounded-lg" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="text-sm text-gray-600"
                    />
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customization Modal */}
        {showModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedTemplate.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">Fill in the details below</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Theme Selection */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">🎨 Document Theme</label>
                  <div className="grid grid-cols-4 gap-3">
                    {(['professional', 'modern', 'creative', 'minimal'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          selectedTheme === theme
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Options */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <label htmlFor="sendEmail" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      📧 Auto-send via Gmail after generation
                    </label>
                  </div>
                  {sendEmail && (
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                  {sendEmail && !emailTo && (
                    <p className="text-xs text-orange-600 mt-2">⚠️ Note: Email service must be configured in backend</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-105 transition-all"
                  >
                    ✨ Generate with AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && previewDoc && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex">
              {/* Left Side - Document Preview */}
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800">🎉 Document Ready!</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {previewDoc.imageData ? (
                      // Display invoice as image
                      <img 
                        src={previewDoc.imageData} 
                        alt="Invoice" 
                        className="w-full h-auto"
                      />
                    ) : (
                      // Display text documents
                      <div className="p-12">
                        {companyLogo && (
                          <img src={companyLogo} alt="Logo" className="w-24 h-24 object-contain mb-6" />
                        )}
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                          {previewDoc.content}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDownloadODF(previewDoc)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 shadow-lg"
                  >
                    📥 {previewDoc.imageData ? 'Download PNG' : 'Download ODF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Detection Tool */}
        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl p-8 border-2 border-orange-200 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              🛡️
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Document Fraud Detector</h3>
              <p className="text-gray-600">Upload or paste any document to check for fraud indicators</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-800 mb-4">📤 Upload Document</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-all cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  id="fraudUpload"
                  onChange={handleFraudFileUpload}
                  disabled={fraudAnalyzing}
                />
                <label htmlFor="fraudUpload" className="cursor-pointer">
                  <div className="text-5xl mb-3">{fraudAnalyzing ? '⏳' : '📁'}</div>
                  <p className="text-sm font-medium text-gray-700">
                    {fraudAnalyzing ? 'Analyzing...' : fraudFile ? fraudFile.name : 'Click to upload document'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Supports: Images, PDF, Word</p>
                </label>
              </div>
            </div>

            {/* Paste Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-800 mb-4">📋 Paste Document URL</h4>
              <input
                type="url"
                value={fraudUrl}
                onChange={(e) => setFraudUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
                disabled={fraudAnalyzing}
              />
              <button
                onClick={handleUrlAnalysis}
                disabled={fraudAnalyzing || !fraudUrl}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-orange-600 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fraudAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze Document'}
              </button>
            </div>
          </div>

          {/* Analysis Results Placeholder */}
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-semibold text-gray-800 mb-4">
              {fraudResult ? '📊 Analysis Results' : '🔬 Detection Capabilities'}
            </h4>

            {fraudResult ? (
              /* Show AI-Powered Results */
              <div className="space-y-4">
                {/* Header with AI Badge */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🤖</div>
                    <div>
                      <p className="text-xs font-semibold text-purple-600">POWERED BY GEMINI AI</p>
                      <p className="text-lg font-bold text-gray-800">AI Forensic Analysis Complete</p>
                      <p className="text-sm text-gray-600">Confidence: {fraudResult.confidence}%</p>
                    </div>
                  </div>
                </div>

                {/* Overall Risk Score */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border-2 border-blue-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">OVERALL RISK SCORE</p>
                    <div className="flex items-end gap-2">
                      <p className="text-5xl font-bold text-purple-600">{fraudResult.riskScore}</p>
                      <p className="text-2xl text-gray-400 mb-1">/10</p>
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg ${
                    fraudResult.riskLevel === 'low' ? 'bg-green-500 text-white' :
                    fraudResult.riskLevel === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {fraudResult.riskLevel.toUpperCase()} RISK
                  </div>
                </div>

                {/* AI Assessment */}
                {fraudResult.overallAssessment && (
                  <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">💭</div>
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">AI Assessment</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{fraudResult.overallAssessment}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {fraudResult.redFlags && fraudResult.redFlags.length > 0 && (
                  <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">🚨</div>
                      <div className="flex-1">
                        <p className="font-semibold text-red-700 mb-3">Red Flags Detected</p>
                        <ul className="space-y-2">
                          {fraudResult.redFlags.map((flag: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">▸</span>
                              <span className="text-sm text-gray-700">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Forensic Checks */}
                <div className="grid grid-cols-1 gap-3">
                  {fraudResult.checks?.map((check: any, idx: number) => (
                    <div key={idx} className={`p-5 rounded-xl border-2 transition-all hover:shadow-lg ${
                      check.passed 
                        ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                        : check.severity === 'high'
                        ? 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50'
                        : check.severity === 'medium'
                        ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50'
                        : 'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{check.passed ? '✅' : '⚠️'}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-800">{check.name}</p>
                            {check.severity && (
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                check.severity === 'high' ? 'bg-red-200 text-red-700' :
                                check.severity === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                                'bg-blue-200 text-blue-700'
                              }`}>
                                {check.severity.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{check.details}</p>
                          {check.evidence && (
                            <p className="text-xs text-gray-600 bg-white/50 px-3 py-1.5 rounded mb-2">
                              <strong>Evidence:</strong> {check.evidence}
                            </p>
                          )}
                          {check.recommendation && (
                            <p className="text-xs font-semibold text-gray-700 bg-white/70 px-3 py-2 rounded border-l-4 border-purple-400">
                              💡 {check.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insights */}
                {fraudResult.aiInsights && (
                  <div className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-xl border-2 border-purple-300 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">🧠</div>
                      <div className="flex-1">
                        <p className="font-bold text-purple-700 mb-3">Deep AI Analysis</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{fraudResult.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Verdict */}
                {fraudResult.verdict && (
                  <div className={`p-6 rounded-xl border-2 shadow-xl ${
                    fraudResult.riskLevel === 'low' 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
                      : fraudResult.riskLevel === 'medium'
                      ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300'
                      : 'bg-gradient-to-r from-red-100 to-orange-100 border-red-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">⚖️</div>
                      <p className="font-bold text-lg text-gray-800">Final Verdict</p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed ml-12">{fraudResult.verdict}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFraudResult(null);
                      setFraudFile(null);
                      setFraudUrl('');
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    🔄 Analyze Another Document
                  </button>
                  <button
                    onClick={() => {
                      const report = `FRAUD ANALYSIS REPORT\n\nRisk Score: ${fraudResult.riskScore}/10\nRisk Level: ${fraudResult.riskLevel}\nConfidence: ${fraudResult.confidence}%\n\nVerdict: ${fraudResult.verdict}\n\nAnalyzed by: SafeDoc AI Forensics`;
                      navigator.clipboard.writeText(report);
                      alert('📋 Report copied to clipboard!');
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    📋 Copy Report
                  </button>
                </div>
              </div>
            ) : (
              /* Show Capabilities */
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm font-semibold text-gray-800">Metadata Forensics</p>
                  <p className="text-xs text-gray-600 mt-1">Timestamp manipulation, software anomalies</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-2xl mb-2">🔤</div>
                  <p className="text-sm font-semibold text-gray-800">Typography Analysis</p>
                  <p className="text-xs text-gray-600 mt-1">Font inconsistencies, kerning issues</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="text-2xl mb-2">🏢</div>
                  <p className="text-sm font-semibold text-gray-800">Entity Verification</p>
                  <p className="text-xs text-gray-600 mt-1">Company legitimacy, address validation</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm font-semibold text-gray-800">Behavioral Analysis</p>
                  <p className="text-xs text-gray-600 mt-1">Unusual patterns, statistical anomalies</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
                  <div className="text-2xl mb-2">💳</div>
                  <p className="text-sm font-semibold text-gray-800">Financial Validation</p>
                  <p className="text-xs text-gray-600 mt-1">Account numbers, routing codes</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="text-sm font-semibold text-gray-800">AI Detection</p>
                  <p className="text-xs text-gray-600 mt-1">Machine learning fraud patterns</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Negotiation Modal - Compact */}
        {showNegotiation && negotiationDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Negotiation Session</h3>
                  <p className="text-xs text-gray-500">ID: {negotiationSessionId.slice(-8)}</p>
                </div>
                <button onClick={() => setShowNegotiation(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              {/* Party Selector */}
              <div className="px-6 py-3 bg-gray-50 flex gap-2">
                <button
                  onClick={() => setNegotiationParty('A')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                    negotiationParty === 'A' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Party A
                </button>
                <button
                  onClick={() => setNegotiationParty('B')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                    negotiationParty === 'B' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Party B
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {negotiationSuggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🤝</div>
                    <p className="text-sm text-gray-600">Submit proposals below</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {negotiationSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            suggestion.party === 'A' ? 'bg-blue-600' : suggestion.party === 'B' ? 'bg-purple-600' : 'bg-gray-800'
                          }`}
                        >
                          {suggestion.party === 'AI' ? '🤖' : suggestion.party}
                        </div>
                        <div
                          className={`flex-1 p-4 rounded-lg ${
                            suggestion.party === 'A' ? 'bg-blue-50' : suggestion.party === 'B' ? 'bg-purple-50' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <p className="text-xs font-semibold text-gray-900 mb-1">
                            {suggestion.partyName || `Party ${suggestion.party}`}
                          </p>
                          <p className="text-sm text-gray-800">{suggestion.text}</p>
                          {suggestion.party === 'AI' && suggestion.fairnessScore && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-full rounded-full ${
                                      suggestion.fairnessScore >= 85 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${suggestion.fairnessScore}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-gray-900">{suggestion.fairnessScore}%</span>
                              </div>
                              {suggestion.whyWorks && (
                                <p className="text-xs text-gray-600 italic">"{suggestion.whyWorks}"</p>
                              )}
                              <button
                                onClick={() => acceptMediatorSuggestion(suggestion)}
                                className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-700"
                              >
                                ✅ Accept
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSuggestion}
                    onChange={(e) => setCurrentSuggestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitNegotiationSuggestion()}
                    placeholder={`Your proposal as Party ${negotiationParty}...`}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                    disabled={aiMediatorActive}
                  />
                  <button
                    onClick={submitNegotiationSuggestion}
                    disabled={!currentSuggestion.trim() || aiMediatorActive}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Be specific with terms for best results</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Documents */}
        {documents.length > 0 && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Recent Documents</h3>
            <div className="grid grid-cols-1 gap-4">
              {documents.slice(-5).reverse().map((doc) => (
                <div
                  key={doc.metadata.id}
                  className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => { setPreviewDoc(doc); setShowPreview(true); }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {doc.metadata.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.metadata.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownloadODF(doc); }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
