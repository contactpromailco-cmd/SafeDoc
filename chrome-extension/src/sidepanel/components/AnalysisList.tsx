/**
 * Analysis List Component
 * Displays detailed analysis results
 */

import React from 'react';
import { type DocumentAnalysis } from '@safedoc/shared';

interface AnalysisListProps {
  analysis: DocumentAnalysis;
}

const AnalysisList: React.FC<AnalysisListProps> = ({ analysis }) => {
  return (
    <div className="px-6 py-4 border-t border-safedoc-border">
      <h3 className="text-sm font-medium mb-4">Detailed Analysis</h3>

      <div className="space-y-4">
        {/* Metadata Forensics */}
        {analysis.metadataForensics && (
          <div className="border border-safedoc-border rounded p-3">
            <h4 className="text-xs font-medium text-safedoc-accent mb-2">
              Metadata Forensics
            </h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Creation:</span>
                <span>{new Date(analysis.metadataForensics.creationTimestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Modified:</span>
                <span>{new Date(analysis.metadataForensics.modificationTimestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Document Date:</span>
                <span>{new Date(analysis.metadataForensics.documentDateClaim).toLocaleString()}</span>
              </div>
              {analysis.metadataForensics.timestampMismatch && (
                <div className="text-red-500 mt-2">
                  ⚠️ Timestamp mismatch detected
                </div>
              )}
            </div>
          </div>
        )}

        {/* Entity Validation */}
        {analysis.entityValidation && (
          <div className="border border-safedoc-border rounded p-3">
            <h4 className="text-xs font-medium text-safedoc-accent mb-2">
              Entity Validation
            </h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Entity:</span>
                <span>{analysis.entityValidation.entityName}</span>
              </div>
              {analysis.entityValidation.registrationAge !== undefined && (
                <div className="flex justify-between">
                  <span className="text-safedoc-muted">Registration Age:</span>
                  <span>{Math.round(analysis.entityValidation.registrationAge / 24)} days</span>
                </div>
              )}
              {analysis.entityValidation.isShellCompany && (
                <div className="text-red-500 mt-2">
                  ⚠️ Potential shell company detected
                </div>
              )}
            </div>
          </div>
        )}

        {/* Behavioral Profile */}
        {analysis.behavioralProfile && (
          <div className="border border-safedoc-border rounded p-3">
            <h4 className="text-xs font-medium text-safedoc-accent mb-2">
              Behavioral Analysis
            </h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Historical Avg:</span>
                <span>${analysis.behavioralProfile.historicalAverage.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Current Amount:</span>
                <span>${analysis.behavioralProfile.currentAmount.toFixed(2)}</span>
              </div>
              {analysis.behavioralProfile.isAnomalous && (
                <div className="text-orange-500 mt-2">
                  ⚠️ Anomalous pattern detected
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compliance Check */}
        {analysis.complianceCheck && (
          <div className="border border-safedoc-border rounded p-3">
            <h4 className="text-xs font-medium text-safedoc-accent mb-2">
              Compliance Check
            </h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Jurisdiction:</span>
                <span>{analysis.complianceCheck.jurisdiction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-safedoc-muted">Tax Type:</span>
                <span>{analysis.complianceCheck.taxType}</span>
              </div>
              {!analysis.complianceCheck.isCompliant && (
                <div className="text-red-500 mt-2">
                  ⚠️ Compliance violations found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisList;
