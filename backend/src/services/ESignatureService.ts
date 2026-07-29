/**
 * Smart E-Signature Service
 * Integrated signing workflow with legal compliance
 */

import crypto from 'crypto';

interface SignatureRequest {
  id: string;
  documentId: string;
  documentTitle: string;
  documentContent: string;
  createdBy: string;
  createdAt: Date;
  signers: Signer[];
  status: 'pending' | 'partially_signed' | 'completed' | 'declined' | 'expired';
  expiresAt: Date;
  signatureOrder: 'sequential' | 'parallel';
  reminders: boolean;
  legalCompliance: string[]; // ['ESIGN', 'eIDAS', 'UETA']
  metadata: Record<string, any>;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  order: number;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: Date;
  signature?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  certificate?: string;
}

interface SignatureAuditLog {
  timestamp: Date;
  event: string;
  actor: string;
  ipAddress?: string;
  details: string;
}

class ESignatureService {
  private requests: Map<string, SignatureRequest> = new Map();
  private auditLogs: Map<string, SignatureAuditLog[]> = new Map();

  constructor() {
    console.log('✍️ E-Signature service initialized');
  }

  /**
   * Create signature request
   */
  createSignatureRequest(params: {
    documentId: string;
    documentTitle: string;
    documentContent: string;
    createdBy: string;
    signers: Array<{
      name: string;
      email: string;
      role: string;
      order?: number;
    }>;
    signatureOrder?: 'sequential' | 'parallel';
    expiresInDays?: number;
    reminders?: boolean;
    legalCompliance?: string[];
  }): SignatureRequest {
    const requestId = this.generateId();

    const signers: Signer[] = params.signers.map((signer, index) => ({
      id: this.generateId(),
      name: signer.name,
      email: signer.email,
      role: signer.role,
      order: signer.order || index + 1,
      status: 'pending',
    }));

    const request: SignatureRequest = {
      id: requestId,
      documentId: params.documentId,
      documentTitle: params.documentTitle,
      documentContent: params.documentContent,
      createdBy: params.createdBy,
      createdAt: new Date(),
      signers,
      status: 'pending',
      expiresAt: new Date(Date.now() + (params.expiresInDays || 30) * 24 * 60 * 60 * 1000),
      signatureOrder: params.signatureOrder || 'parallel',
      reminders: params.reminders !== false,
      legalCompliance: params.legalCompliance || ['ESIGN', 'UETA'],
      metadata: {},
    };

    this.requests.set(requestId, request);
    this.auditLogs.set(requestId, []);

    this.logAudit(requestId, 'request_created', params.createdBy, 'Signature request created');

    console.log(`✍️ Signature request created: ${requestId} (${signers.length} signers)`);

    return request;
  }

  /**
   * Sign document
   */
  signDocument(params: {
    requestId: string;
    signerId: string;
    signature: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  }): { success: boolean; error?: string; request?: SignatureRequest } {
    const request = this.requests.get(params.requestId);

    if (!request) {
      return { success: false, error: 'Request not found' };
    }

    if (request.status === 'completed') {
      return { success: false, error: 'Already completed' };
    }

    if (request.status === 'expired') {
      return { success: false, error: 'Request expired' };
    }

    if (new Date() > request.expiresAt) {
      request.status = 'expired';
      return { success: false, error: 'Request expired' };
    }

    const signer = request.signers.find(s => s.id === params.signerId);

    if (!signer) {
      return { success: false, error: 'Signer not found' };
    }

    if (signer.status === 'signed') {
      return { success: false, error: 'Already signed' };
    }

    // Check signing order
    if (request.signatureOrder === 'sequential') {
      const currentOrder = signer.order;
      const previousSignersComplete = request.signers
        .filter(s => s.order < currentOrder)
        .every(s => s.status === 'signed');

      if (!previousSignersComplete) {
        return { success: false, error: 'Wait for previous signers to complete' };
      }
    }

    // Apply signature
    signer.status = 'signed';
    signer.signedAt = new Date();
    signer.signature = params.signature;
    signer.ipAddress = params.ipAddress;
    signer.userAgent = params.userAgent;
    signer.location = params.location;

    // Generate certificate
    signer.certificate = this.generateCertificate(request.id, signer);

    this.logAudit(
      request.id,
      'document_signed',
      signer.email,
      `${signer.name} signed the document`,
      params.ipAddress
    );

    // Check if all signed
    const allSigned = request.signers.every(s => s.status === 'signed');
    if (allSigned) {
      request.status = 'completed';
      this.logAudit(request.id, 'request_completed', 'system', 'All signers completed');
      console.log(`✅ Signature request completed: ${request.id}`);
    } else {
      request.status = 'partially_signed';
    }

    console.log(`✍️ Document signed by ${signer.name} (${signer.email})`);

    return { success: true, request };
  }

  /**
   * Decline signature
   */
  declineSignature(requestId: string, signerId: string, reason?: string): { success: boolean; error?: string } {
    const request = this.requests.get(requestId);

    if (!request) {
      return { success: false, error: 'Request not found' };
    }

    const signer = request.signers.find(s => s.id === signerId);

    if (!signer) {
      return { success: false, error: 'Signer not found' };
    }

    signer.status = 'declined';
    request.status = 'declined';

    this.logAudit(
      requestId,
      'signature_declined',
      signer.email,
      `${signer.name} declined to sign${reason ? `: ${reason}` : ''}`
    );

    console.log(`❌ Signature declined by ${signer.name}: ${reason || 'No reason provided'}`);

    return { success: true };
  }

  /**
   * Get signature request
   */
  getSignatureRequest(requestId: string): SignatureRequest | null {
    return this.requests.get(requestId) || null;
  }

  /**
   * Get signature requests for user
   */
  getSignatureRequestsForUser(userEmail: string): SignatureRequest[] {
    return Array.from(this.requests.values()).filter(
      request => request.signers.some(s => s.email === userEmail)
    );
  }

  /**
   * Get audit log
   */
  getAuditLog(requestId: string): SignatureAuditLog[] {
    return this.auditLogs.get(requestId) || [];
  }

  /**
   * Send reminder
   */
  sendReminder(requestId: string, signerId?: string): { success: boolean; sent: number } {
    const request = this.requests.get(requestId);

    if (!request || request.status === 'completed') {
      return { success: false, sent: 0 };
    }

    const signersToRemind = signerId
      ? request.signers.filter(s => s.id === signerId && s.status === 'pending')
      : request.signers.filter(s => s.status === 'pending');

    signersToRemind.forEach(signer => {
      console.log(`📧 Reminder sent to ${signer.email}`);
      this.logAudit(requestId, 'reminder_sent', 'system', `Reminder sent to ${signer.name}`);
    });

    return { success: true, sent: signersToRemind.length };
  }

  /**
   * Generate signature certificate
   */
  private generateCertificate(requestId: string, signer: Signer): string {
    const certificateData = {
      requestId,
      signerId: signer.id,
      signerName: signer.name,
      signerEmail: signer.email,
      signedAt: signer.signedAt,
      ipAddress: signer.ipAddress,
      signature: signer.signature,
    };

    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(certificateData))
      .digest('hex');

    return `CERT-${hash.substring(0, 32).toUpperCase()}`;
  }

  /**
   * Verify signature certificate
   */
  verifyCertificate(requestId: string, signerId: string, certificate: string): boolean {
    const request = this.requests.get(requestId);
    if (!request) return false;

    const signer = request.signers.find(s => s.id === signerId);
    if (!signer || !signer.certificate) return false;

    return signer.certificate === certificate;
  }

  /**
   * Generate signed document with all signatures
   */
  generateSignedDocument(requestId: string): string | null {
    const request = this.requests.get(requestId);

    if (!request || request.status !== 'completed') {
      return null;
    }

    const signedDoc = `
═══════════════════════════════════════════════════════════════════════════════
                              SIGNED DOCUMENT
═══════════════════════════════════════════════════════════════════════════════

${request.documentTitle}

${request.documentContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              SIGNATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${request.signers
  .sort((a, b) => a.order - b.order)
  .map(
    signer => `
Signer #${signer.order}: ${signer.name} (${signer.role})
Email: ${signer.email}
Signature: ${signer.signature || 'N/A'}
Signed At: ${signer.signedAt ? signer.signedAt.toLocaleString() : 'N/A'}
IP Address: ${signer.ipAddress || 'N/A'}
Certificate: ${signer.certificate || 'N/A'}
`
  )
  .join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          LEGAL COMPLIANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This document is legally binding under:
${request.legalCompliance.map(law => `• ${law}`).join('\n')}

Document ID: ${request.documentId}
Request ID: ${request.id}
Created: ${request.createdAt.toLocaleString()}
Completed: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            AUDIT TRAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.getAuditLog(requestId)
  .map(
    log => `${log.timestamp.toLocaleString()} - ${log.event.toUpperCase()}
Actor: ${log.actor}
${log.ipAddress ? `IP: ${log.ipAddress}` : ''}
Details: ${log.details}
`
  )
  .join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                    This document is electronically signed and legally binding
═══════════════════════════════════════════════════════════════════════════════
`;

    return signedDoc;
  }

  /**
   * Get signing statistics
   */
  getStatistics(): {
    total: number;
    pending: number;
    completed: number;
    declined: number;
    expired: number;
    avgSigningTime: number;
  } {
    const requests = Array.from(this.requests.values());

    const completed = requests.filter(r => r.status === 'completed');
    const avgSigningTime =
      completed.length > 0
        ? completed.reduce((sum, r) => {
            const firstSigned = r.signers.find(s => s.signedAt);
            const lastSigned = r.signers.filter(s => s.signedAt).sort((a, b) => 
              (b.signedAt?.getTime() || 0) - (a.signedAt?.getTime() || 0)
            )[0];
            
            if (firstSigned?.signedAt && lastSigned?.signedAt) {
              return sum + (lastSigned.signedAt.getTime() - r.createdAt.getTime());
            }
            return sum;
          }, 0) / completed.length
        : 0;

    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending' || r.status === 'partially_signed').length,
      completed: completed.length,
      declined: requests.filter(r => r.status === 'declined').length,
      expired: requests.filter(r => r.status === 'expired').length,
      avgSigningTime: avgSigningTime / 1000 / 60, // in minutes
    };
  }

  /**
   * Log audit event
   */
  private logAudit(
    requestId: string,
    event: string,
    actor: string,
    details: string,
    ipAddress?: string
  ): void {
    const logs = this.auditLogs.get(requestId) || [];
    logs.push({
      timestamp: new Date(),
      event,
      actor,
      ipAddress,
      details,
    });
    this.auditLogs.set(requestId, logs);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check and expire old requests
   */
  expireOldRequests(): number {
    let expired = 0;
    const now = new Date();

    for (const [id, request] of this.requests.entries()) {
      if (request.status === 'pending' || request.status === 'partially_signed') {
        if (now > request.expiresAt) {
          request.status = 'expired';
          this.logAudit(id, 'request_expired', 'system', 'Request expired due to timeout');
          expired++;
        }
      }
    }

    if (expired > 0) {
      console.log(`⏰ Expired ${expired} signature requests`);
    }

    return expired;
  }
}

export default ESignatureService;
