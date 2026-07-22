/**
 * Command Input Component
 * Handles user commands like /generate
 */

import React, { useState, useRef, useEffect } from 'react';

interface CommandInputProps {
  onCommand: (command: string) => void;
}

const COMMAND_SUGGESTIONS = [
  { command: '/generate', description: 'Generate a document from context' },
  { command: '/analyze', description: 'Re-analyze current document' },
  { command: '/invoice', description: 'Generate an invoice' },
  { command: '/contract', description: 'Generate a contract' },
];

const CommandInput: React.FC<CommandInputProps> = ({ onCommand }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filteredSuggestions = COMMAND_SUGGESTIONS.filter((s) =>
    s.command.startsWith(input.toLowerCase()) && input.startsWith('/')
  );

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!input.trim()) return;

    onCommand(input.trim());
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const selectSuggestion = (command: string): void => {
    setInput(command + ' ');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    setShowSuggestions(filteredSuggestions.length > 0 && input.startsWith('/'));
  }, [input, filteredSuggestions.length]);

  return (
    <div className="relative">
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 right-0 bg-safedoc-bg border border-safedoc-border rounded-t-lg overflow-hidden">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.command}
              className="w-full px-4 py-2 text-left hover:bg-safedoc-border transition-colors"
              onClick={() => selectSuggestion(suggestion.command)}
            >
              <div className="text-sm font-medium text-safedoc-accent">
                {suggestion.command}
              </div>
              <div className="text-xs text-safedoc-muted">{suggestion.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type / for commands..."
            className="flex-1 bg-transparent border border-safedoc-border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-safedoc-accent"
            rows={1}
            style={{
              minHeight: '36px',
              maxHeight: '120px',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-safedoc-accent text-safedoc-bg rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-safedoc-muted mt-2">
          Use <span className="text-safedoc-accent">/generate</span> to create documents,{' '}
          <span className="text-safedoc-accent">/analyze</span> to review
        </div>
      </form>
    </div>
  );
};

export default CommandInput;
