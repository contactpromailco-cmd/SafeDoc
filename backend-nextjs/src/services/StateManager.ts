/**
 * State Manager Service
 * Manages shared application state across clients
 */

import { type AppState, type Document } from '@safedoc/shared';

class StateManager {
  private state: AppState;

  constructor() {
    this.state = {
      documents: [],
      analysisQueue: [],
      alerts: [],
      lastSync: Date.now(),
    };
  }

  async getState(): Promise<AppState> {
    return { ...this.state };
  }

  async updateState(updates: Partial<AppState>): Promise<void> {
    this.state = {
      ...this.state,
      ...updates,
      lastSync: Date.now(),
    };
  }

  async addDocument(document: Document): Promise<void> {
    this.state.documents.push(document);
    this.state.lastSync = Date.now();
  }

  async updateDocument(documentId: string, updates: Partial<Document>): Promise<void> {
    const index = this.state.documents.findIndex(
      (doc) => doc.metadata.id === documentId
    );

    if (index !== -1) {
      this.state.documents[index] = {
        ...this.state.documents[index],
        ...updates,
      };
      this.state.lastSync = Date.now();
    }
  }

  async removeDocument(documentId: string): Promise<void> {
    this.state.documents = this.state.documents.filter(
      (doc) => doc.metadata.id !== documentId
    );
    this.state.lastSync = Date.now();
  }

  async addToAnalysisQueue(documentId: string): Promise<void> {
    if (!this.state.analysisQueue.includes(documentId)) {
      this.state.analysisQueue.push(documentId);
      this.state.lastSync = Date.now();
    }
  }

  async removeFromAnalysisQueue(documentId: string): Promise<void> {
    this.state.analysisQueue = this.state.analysisQueue.filter(
      (id) => id !== documentId
    );
    this.state.lastSync = Date.now();
  }

  async updateDocumentRiskScore(documentId: string, riskScore: any): Promise<void> {
    const index = this.state.documents.findIndex(
      (doc) => doc.metadata.id === documentId
    );

    if (index !== -1) {
      this.state.documents[index].riskScore = riskScore;
      this.state.lastSync = Date.now();
    }
  }
}

export default StateManager;
