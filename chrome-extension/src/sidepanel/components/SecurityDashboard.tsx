/**
 * Security Dashboard Component
 * Displays risk score and analysis factors
 */

import React from 'react';
import { RiskLevel, type RiskScore } from '@safedoc/shared';

interface SecurityDashboardProps {
  riskScore: RiskScore;
  isAnalyzing: boolean;
  expandedFactors: Set<string>;
  onToggleFactor: (factorId: string) => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  riskScore,
  isAnalyzing,
  expandedFactors,
  onToggleFactor,
}) => {
  const getRiskColor = (level: RiskLevel): string => {
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

  const getRiskLabel = (level: RiskLevel): string => {
    switch (level) {
      case RiskLevel.SAFE:
        return 'Safe';
      case RiskLevel.LOW:
        return 'Low Risk';
      case RiskLevel.MEDIUM:
        return 'Medium Risk';
      case RiskLevel.HIGH:
        return 'High Risk';
      case RiskLevel.CRITICAL:
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="px-6 py-6">
      {/* Risk Score Display */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <div className={`text-5xl font-medium ${getRiskColor(riskScore.level)}`}>
            {Math.round(riskScore.overall)}%
          </div>
          <div className="text-sm text-safedoc-muted">
            {getRiskLabel(riskScore.level)}
          </div>
        </div>
        <div className="w-full bg-safedoc-border rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getRiskColor(riskScore.level)} bg-current`}
            style={{ width: `${riskScore.overall}%` }}
          />
        </div>
        <div className="text-xs text-safedoc-muted mt-2">
          Confidence: {Math.round(riskScore.confidence * 100)}%
        </div>
      </div>

      {/* Risk Factors */}
      {riskScore.factors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Analysis Factors</h3>
          <div className="space-y-2">
            {riskScore.factors.map((factor) => (
              <div
                key={factor.id}
                className="border border-safedoc-border rounded p-3 cursor-pointer hover:bg-safedoc-border/50 transition-colors"
                onClick={() => onToggleFactor(factor.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${getRiskColor(factor.severity)}`}>
                        {getRiskLabel(factor.severity)}
                      </span>
                      <span className="text-xs text-safedoc-muted">
                        {factor.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm">{factor.description}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedFactors.has(factor.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Expanded Evidence */}
                {expandedFactors.has(factor.id) && (
                  <div className="mt-3 pt-3 border-t border-safedoc-border">
                    {factor.evidence.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-safedoc-muted mb-1">Evidence:</p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          {factor.evidence.map((item, idx) => (
                            <li key={idx} className="text-safedoc-text/80">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {factor.recommendation && (
                      <div>
                        <p className="text-xs text-safedoc-muted mb-1">Recommendation:</p>
                        <p className="text-xs text-safedoc-accent">{factor.recommendation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyzing Indicator */}
      {isAnalyzing && (
        <div className="mt-4 flex items-center gap-2 text-xs text-safedoc-muted">
          <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-safedoc-accent"></div>
          <span>Running additional checks...</span>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
