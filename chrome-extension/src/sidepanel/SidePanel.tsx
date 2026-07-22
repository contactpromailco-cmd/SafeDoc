/**
 * Side Panel Main Component
 * Displays security analysis and command interface
 */

import React, { useState, useEffect } from 'react';
import { MessageType, type Message, type RiskScoreUpdateMessage, type DocumentAnalysisCompleteMessage } from '@safedoc/shared';
import { type Document, type RiskScore } from '@safedoc/shared';
import SecurityDashboard from './components/SecurityDashboard';
import CommandInput from './components/CommandInput';
import AnalysisList from './components/AnalysisList';

interface SidePanelState {
  currentDocument: Document | null;
  riskScore: RiskScore | null;
  isAnalyzing: boolean;
  commandHistory: string[];
}

const SidePanel: React.FC = () => {
  const [state, setState] = useState<SidePanelState>({
    currentDocument: null,
    riskScore: null,
    isAnalyzing: false,
    commandHistory: [],
  });

  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Listen for messages from background script
    const messageListener = (message: Message) => {
      handleMessage(message);
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Request current state
    chrome.runtime.sendMessage({
      type: MessageType.STATE_REQUEST,
      timestamp: Date.now(),
      id: generateId(),
      source: 'extension',
    });

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleMessage = (message: Message): void => {
    console.log('Side panel received message:', message.type);

    switch (message.type) {
      case MessageType.DOCUMENT_DETECTED:
        handleDocumentDetected(message);
        break;
      case MessageType.DOCUMENT_ANALYSIS_COMPLETE:
        handleAnalysisComplete(message as DocumentAnalysisCompleteMessage);
        break;
      case MessageType.RISK_SCORE_UPDATE:
        handleRiskScoreUpdate(message as RiskScoreUpdateMessage);
        break;
    }
  };

  const handleDocumentDetected = (message: any): void => {
    setState(prev => ({
      ...prev,
      isAnalyzing: true,
    }));

    // Request analysis
    chrome.runtime.sendMessage({
      type: MessageType.DOCUMENT_ANALYZE,
      timestamp: Date.now(),
      id: generateId(),
      source: 'extension',
      documentId: message.id,
      analysisTypes: ['metadata', 'font', 'entity', 'behavioral', 'account'],
    });
  };

  const handleAnalysisComplete = (message: DocumentAnalysisCompleteMessage): void => {
    setState(prev => ({
      ...prev,
      riskScore: message.riskScore,
      isAnalyzing: false,
    }));
  };

  const handleRiskScoreUpdate = (message: RiskScoreUpdateMessage): void => {
    setState(prev => ({
      ...prev,
      riskScore: message.riskScore,
    }));
  };

  const handleCommand = async (command: string): Promise<void> => {
    setState(prev => ({
      ...prev,
      commandHistory: [...prev.commandHistory, command],
    }));

    // Parse and execute command
    if (command.startsWith('/generate')) {
      const context = command.substring(10).trim();
      await handleGenerateCommand(context);
    } else if (command.startsWith('/analyze')) {
      await handleAnalyzeCommand();
    }
  };

  const handleGenerateCommand = async (context: string): Promise<void> => {
    chrome.runtime.sendMessage({
      type: MessageType.DOCUMENT_GENERATE,
      timestamp: Date.now(),
      id: generateId(),
      source: 'extension',
      documentType: 'INVOICE',
      context: { prompt: context },
    });
  };

  const handleAnalyzeCommand = async (): Promise<void> => {
    if (!state.currentDocument) return;

    setState(prev => ({ ...prev, isAnalyzing: true }));

    chrome.runtime.sendMessage({
      type: MessageType.DOCUMENT_ANALYZE,
      timestamp: Date.now(),
      id: generateId(),
      source: 'extension',
      documentId: state.currentDocument.metadata.id,
      analysisTypes: ['metadata', 'font', 'entity', 'behavioral', 'account'],
    });
  };

  const toggleFactor = (factorId: string): void => {
    setExpandedFactors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(factorId)) {
        newSet.delete(factorId);
      } else {
        newSet.add(factorId);
      }
      return newSet;
    });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-safedoc-bg text-safedoc-text">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-safedoc-border px-6 py-4">
        <h1 className="text-lg font-medium tracking-tight">SafeDoc</h1>
        <p className="text-xs text-safedoc-muted mt-1">Document Security Analysis</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {state.riskScore ? (
          <>
            <SecurityDashboard
              riskScore={state.riskScore}
              isAnalyzing={state.isAnalyzing}
              expandedFactors={expandedFactors}
              onToggleFactor={toggleFactor}
            />
            {state.currentDocument?.analysis && (
              <AnalysisList analysis={state.currentDocument.analysis} />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full px-6">
            <div className="text-center">
              {state.isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-safedoc-accent mx-auto mb-4"></div>
                  <p className="text-sm text-safedoc-muted">Analyzing document...</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-sm text-safedoc-muted">
                    Waiting for document detection
                  </p>
                  <p className="text-xs text-safedoc-muted mt-2">
                    View an invoice or contract to begin analysis
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Command Input */}
      <div className="flex-shrink-0 border-t border-safedoc-border">
        <CommandInput onCommand={handleCommand} />
      </div>
    </div>
  );
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default SidePanel;
