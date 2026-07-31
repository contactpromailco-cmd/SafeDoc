/**
 * Risk Visualizer Component
 * Before-and-After split-screen risk mapping
 */

import React, { useState } from 'react';
import { Document, RiskLevel } from '../types/shared';

interface RiskVisualizerProps {
  document: Document | null;
}

const RiskVisualizer: React.FC<RiskVisualizerProps> = ({ document }) => {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-sm text-safedoc-muted">Select a document to visualize risks</p>
        </div>
      </div>
    );
  }

  const hasVersions = document.versions && document.versions.length > 0;
  const currentVersion = document.content;
  const previousVersion = selectedVersion !== null && document.versions?.[selectedVersion]?.content;

  const getRiskColor = (level?: RiskLevel): string => {
    if (!level) return 'text-safedoc-muted';
    switch (level) {
      case RiskLevel.SAFE:
        return 'text-green-500';
      case RiskLevel.LOW:
        return 'text-blue-500';
      case RiskLevel.MEDIUM:
        return 'text-safedoc-accent';
      case RiskLevel.HIGH:
        return 'text-orange-500';
      case RiskLevel.CRITICAL:
        return 'text-red-500';
      default:
        return 'text-safedoc-muted';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-safedoc-border">
        <h2 className="text-lg font-medium mb-2">Risk Visualization</h2>
        <div className="flex items-center gap-4">
          {document.riskScore && (
            <>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-medium ${getRiskColor(document.riskScore.level)}`}>
                  {Math.round(document.riskScore.overall)}%
                </span>
                <span className="text-sm text-safedoc-muted">Safety Score</span>
              </div>
              <div className="h-6 w-px bg-safedoc-border" />
              <div className="text-sm text-safedoc-muted">
                {document.riskScore.factors.length} risk factors identified
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {hasVersions ? (
          // Split-screen comparison view
          <div className="h-full flex">
            {/* Left: Previous Version */}
            <div className="flex-1 border-r border-safedoc-border">
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 bg-safedoc-border">
                  <select
                    className="w-full bg-safedoc-bg border border-safedoc-border rounded px-2 py-1 text-sm"
                    value={selectedVersion ?? ''}
                    onChange={(e) => setSelectedVersion(Number(e.target.value))}
                  >
                    <option value="">Select version to compare</option>
                    {document.versions?.map((version, idx) => (
                      <option key={version.id} value={idx}>
                        Version {idx + 1} - {new Date(version.timestamp).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {previousVersion ? (
                    <pre className="text-sm whitespace-pre-wrap">{previousVersion}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-safedoc-muted">Select a version to compare</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Current Version */}
            <div className="flex-1">
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 bg-safedoc-border">
                  <p className="text-sm font-medium">Current Version</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <pre className="text-sm whitespace-pre-wrap">{currentVersion}</pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Single document view with risk highlights
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {/* Risk Factors */}
              {document.riskScore && document.riskScore.factors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Risk Factors</h3>
                  <div className="space-y-2">
                    {document.riskScore.factors.map((factor) => (
                      <div
                        key={factor.id}
                        className="border border-safedoc-border rounded p-4"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className={`text-xs font-medium ${getRiskColor(factor.severity)}`}>
                              {factor.severity}
                            </span>
                            <span className="text-xs text-safedoc-muted ml-2">
                              {factor.category.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{factor.description}</p>
                        {factor.evidence.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-safedoc-border">
                            <p className="text-xs text-safedoc-muted mb-1">Evidence:</p>
                            <ul className="text-xs space-y-1">
                              {factor.evidence.map((item, idx) => (
                                <li key={idx} className="text-safedoc-text/80">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {factor.recommendation && (
                          <div className="mt-2 p-2 bg-safedoc-border rounded">
                            <p className="text-xs text-safedoc-accent">{factor.recommendation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Content */}
              <div className="border-t border-safedoc-border pt-6">
                <h3 className="text-sm font-medium mb-3">Document Content</h3>
                <pre className="text-sm whitespace-pre-wrap bg-safedoc-border/30 p-4 rounded">
                  {currentVersion}
                </pre>
              </div>

              {/* Analysis Details */}
              {document.analysis && (
                <div className="border-t border-safedoc-border pt-6 mt-6">
                  <h3 className="text-sm font-medium mb-3">Detailed Analysis</h3>
                  
                  {/* Metadata Forensics */}
                  {document.analysis.metadataForensics && (
                    <div className="mb-4 border border-safedoc-border rounded p-4">
                      <h4 className="text-xs font-medium text-safedoc-accent mb-2">
                        Metadata Forensics
                      </h4>
                      <div className="text-xs space-y-1">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-safedoc-muted">File Created:</span>
                          <span>{new Date(document.analysis.metadataForensics.creationTimestamp).toLocaleString()}</span>
                          <span className="text-safedoc-muted">Last Modified:</span>
                          <span>{new Date(document.analysis.metadataForensics.modificationTimestamp).toLocaleString()}</span>
                          <span className="text-safedoc-muted">Document Date:</span>
                          <span>{new Date(document.analysis.metadataForensics.documentDateClaim).toLocaleString()}</span>
                        </div>
                        {document.analysis.metadataForensics.timestampMismatch && (
                          <div className="text-red-500 mt-2">⚠️ Timestamp anomaly detected</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Entity Validation */}
                  {document.analysis.entityValidation && (
                    <div className="mb-4 border border-safedoc-border rounded p-4">
                      <h4 className="text-xs font-medium text-safedoc-accent mb-2">
                        Entity Validation
                      </h4>
                      <div className="text-xs space-y-1">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-safedoc-muted">Entity:</span>
                          <span>{document.analysis.entityValidation.entityName}</span>
                          {document.analysis.entityValidation.registrationAge !== undefined && (
                            <>
                              <span className="text-safedoc-muted">Age:</span>
                              <span>{Math.round(document.analysis.entityValidation.registrationAge / 24)} days</span>
                            </>
                          )}
                          <span className="text-safedoc-muted">Confidence:</span>
                          <span>{Math.round(document.analysis.entityValidation.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Behavioral Profile */}
                  {document.analysis.behavioralProfile && (
                    <div className="mb-4 border border-safedoc-border rounded p-4">
                      <h4 className="text-xs font-medium text-safedoc-accent mb-2">
                        Behavioral Analysis
                      </h4>
                      <div className="text-xs space-y-1">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-safedoc-muted">Historical Avg:</span>
                          <span>${document.analysis.behavioralProfile.historicalAverage.toFixed(2)}</span>
                          <span className="text-safedoc-muted">Current Amount:</span>
                          <span>${document.analysis.behavioralProfile.currentAmount.toFixed(2)}</span>
                          <span className="text-safedoc-muted">Deviation:</span>
                          <span>{(document.analysis.behavioralProfile.amountDeviation * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskVisualizer;
