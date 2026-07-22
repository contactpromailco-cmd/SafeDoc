/**
 * History Panel Component
 * Ultra-narrow scannable log of recent actions
 */

import React from 'react';
import { useWebSocketStore } from '../store/websocket-pusher';
import { DocumentType } from '@safedoc/shared';

const HistoryPanel: React.FC = () => {
  const documents = useWebSocketStore((state) => state.appState.documents);
  const activeDocument = useWebSocketStore((state) => state.activeDocument);
  const setActiveDocument = useWebSocketStore((state) => state.setActiveDocument);

  const getDocumentIcon = (type: DocumentType): string => {
    switch (type) {
      case DocumentType.INVOICE:
        return '📄';
      case DocumentType.CONTRACT:
        return '📋';
      case DocumentType.NDA:
        return '🔒';
      case DocumentType.RISK_REPORT:
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getRiskColor = (score?: number): string => {
    if (!score) return 'text-safedoc-muted';
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-safedoc-accent';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-safedoc-border">
        <h2 className="text-xs font-medium text-safedoc-muted">Recent Documents</h2>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-safedoc-muted">No documents yet</p>
          </div>
        ) : (
          <div className="py-2">
            {documents.map((doc) => (
              <button
                key={doc.metadata.id}
                className={`w-full px-4 py-3 text-left hover:bg-safedoc-border/50 transition-colors border-b border-safedoc-border/50 ${
                  activeDocument?.metadata.id === doc.metadata.id
                    ? 'bg-safedoc-border/50'
                    : ''
                }`}
                onClick={() => setActiveDocument(doc)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{getDocumentIcon(doc.metadata.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{doc.metadata.title}</p>
                    <p className="text-xs text-safedoc-muted mt-1">
                      {new Date(doc.metadata.createdAt).toLocaleDateString()}
                    </p>
                    {doc.riskScore && (
                      <div
                        className={`text-xs font-medium mt-1 ${getRiskColor(
                          doc.riskScore.overall
                        )}`}
                      >
                        {Math.round(doc.riskScore.overall)}% Safe
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-safedoc-border">
        <p className="text-xs text-safedoc-muted">{documents.length} documents</p>
      </div>
    </div>
  );
};

export default HistoryPanel;
