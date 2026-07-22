/**
 * Document Canvas Component
 * Text-Driven "Zen Mode" Canvas for document creation
 */

import React, { useState, useEffect, useRef } from 'react';
import { useWebSocketStore } from '../store/websocket-pusher';
import { MessageType, DocumentType } from '@safedoc/shared';

const COMMAND_PATTERNS = [
  { command: '/invoice', type: DocumentType.INVOICE, description: 'Create an invoice' },
  { command: '/contract', type: DocumentType.CONTRACT, description: 'Create a contract' },
  { command: '/nda', type: DocumentType.NDA, description: 'Create an NDA' },
  { command: '/sow', type: DocumentType.STATEMENT_OF_WORK, description: 'Create a Statement of Work' },
  { command: '/dpa', type: DocumentType.DPA_RIDER, description: 'Create a Data Protection Rider' },
];

const DocumentCanvas: React.FC = () => {
  const activeDocument = useWebSocketStore((state) => state.activeDocument);
  const sendMessage = useWebSocketStore((state) => state.sendMessage);
  const [content, setContent] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeDocument) {
      setContent(activeDocument.content);
    } else {
      setContent('');
    }
  }, [activeDocument]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newContent = e.target.value;
    setContent(newContent);

    // Check for commands
    const lastLine = newContent.split('\n').pop()?.trim() || '';
    setShowCommands(lastLine.startsWith('/'));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1].trim();

    // Check for command execution
    if (e.key === 'Enter' && lastLine.startsWith('/')) {
      e.preventDefault();
      executeCommand(lastLine);
    }
  };

  const executeCommand = (command: string): void => {
    const pattern = COMMAND_PATTERNS.find((p) => command.startsWith(p.command));

    if (pattern) {
      const context = command.substring(pattern.command.length).trim();

      sendMessage({
        type: MessageType.DOCUMENT_GENERATE,
        timestamp: Date.now(),
        id: generateId(),
        source: 'web-app',
        documentType: pattern.type,
        context: { prompt: context },
      });

      // Clear command line
      const lines = content.split('\n');
      lines[lines.length - 1] = '';
      setContent(lines.join('\n'));
      setShowCommands(false);
    }
  };

  const insertCommand = (command: string): void => {
    setContent((prev) => {
      const lines = prev.split('\n');
      lines[lines.length - 1] = command + ' ';
      return lines.join('\n');
    });
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  const filteredCommands = showCommands
    ? COMMAND_PATTERNS.filter((p) => {
        const lastLine = content.split('\n').pop()?.trim() || '';
        return p.command.startsWith(lastLine.toLowerCase());
      })
    : [];

  return (
    <div className="h-full flex flex-col relative">
      {/* Command Suggestions */}
      {showCommands && filteredCommands.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-safedoc-bg border border-safedoc-border rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-safedoc-border">
            <p className="text-xs text-safedoc-muted">Available Commands</p>
          </div>
          {filteredCommands.map((pattern) => (
            <button
              key={pattern.command}
              className="w-full px-4 py-3 text-left hover:bg-safedoc-border transition-colors"
              onClick={() => insertCommand(pattern.command)}
            >
              <p className="text-sm font-medium text-safedoc-accent">{pattern.command}</p>
              <p className="text-xs text-safedoc-muted mt-1">{pattern.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 p-8">
        {activeDocument ? (
          <div className="max-w-4xl mx-auto h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-medium mb-2">{activeDocument.metadata.title}</h2>
              <p className="text-sm text-safedoc-muted">
                {activeDocument.metadata.type.replace(/_/g, ' ')} •{' '}
                {new Date(activeDocument.metadata.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="prose prose-invert max-w-none markdown-content">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {activeDocument.content}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-medium mb-2">Zen Mode Canvas</h2>
              <p className="text-sm text-safedoc-muted">
                Type <span className="text-safedoc-accent">/</span> for commands
              </p>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none resize-none focus:outline-none text-base leading-relaxed"
              placeholder="Start typing or use / commands to generate documents..."
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Helper Text */}
      {!activeDocument && (
        <div className="px-8 py-4 border-t border-safedoc-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-safedoc-muted">
              Available commands:{' '}
              {COMMAND_PATTERNS.map((p) => (
                <span key={p.command} className="text-safedoc-accent mr-2">
                  {p.command}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default DocumentCanvas;
