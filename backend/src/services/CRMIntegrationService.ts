/**
 * CRM Integration Service
 * Integrates with HubSpot, Salesforce, Pipedrive
 */

interface CRMConnection {
  id: string;
  userId: string;
  platform: 'hubspot' | 'salesforce' | 'pipedrive' | 'zoho';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  connected: boolean;
  lastSync?: Date;
  metadata: Record<string, any>;
}

interface CRMContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  customFields?: Record<string, any>;
}

interface CRMDeal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  contactId: string;
  closeDate?: Date;
  probability?: number;
  customFields?: Record<string, any>;
}

interface DocumentSync {
  documentId: string;
  crmPlatform: string;
  crmDealId?: string;
  crmContactId?: string;
  syncedAt: Date;
  status: 'synced' | 'failed';
}

class CRMIntegrationService {
  private connections: Map<string, CRMConnection> = new Map();
  private syncs: Map<string, DocumentSync> = new Map();

  constructor() {
    console.log('🔗 CRM Integration service initialized');
  }

  /**
   * Connect CRM account
   */
  connectCRM(params: {
    userId: string;
    platform: 'hubspot' | 'salesforce' | 'pipedrive' | 'zoho';
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }): CRMConnection {
    const connectionId = this.generateId();

    const connection: CRMConnection = {
      id: connectionId,
      userId: params.userId,
      platform: params.platform,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      expiresAt: params.expiresAt,
      connected: true,
      lastSync: new Date(),
      metadata: {},
    };

    this.connections.set(connectionId, connection);

    console.log(`🔗 CRM connected: ${params.platform} for user ${params.userId}`);

    return connection;
  }

  /**
   * Get user's CRM connections
   */
  getUserConnections(userId: string): CRMConnection[] {
    return Array.from(this.connections.values()).filter(c => c.userId === userId);
  }

  /**
   * Disconnect CRM
   */
  disconnectCRM(connectionId: string): boolean {
    const connection = this.connections.get(connectionId);
    
    if (connection) {
      connection.connected = false;
      console.log(`🔌 CRM disconnected: ${connection.platform}`);
      return true;
    }

    return false;
  }

  /**
   * Sync document to CRM
   */
  async syncDocumentToCRM(params: {
    documentId: string;
    documentTitle: string;
    documentType: string;
    amount?: number;
    contactEmail?: string;
    connectionId: string;
  }): Promise<{ success: boolean; error?: string; dealId?: string }> {
    const connection = this.connections.get(params.connectionId);

    if (!connection || !connection.connected) {
      return { success: false, error: 'CRM not connected' };
    }

    try {
      // Simulate API call to CRM
      console.log(`🔄 Syncing document to ${connection.platform}...`);

      let dealId: string;

      switch (connection.platform) {
        case 'hubspot':
          dealId = await this.syncToHubSpot(connection, params);
          break;
        case 'salesforce':
          dealId = await this.syncToSalesforce(connection, params);
          break;
        case 'pipedrive':
          dealId = await this.syncToPipedrive(connection, params);
          break;
        case 'zoho':
          dealId = await this.syncToZoho(connection, params);
          break;
        default:
          return { success: false, error: 'Unsupported CRM platform' };
      }

      // Track sync
      const sync: DocumentSync = {
        documentId: params.documentId,
        crmPlatform: connection.platform,
        crmDealId: dealId,
        crmContactId: params.contactEmail,
        syncedAt: new Date(),
        status: 'synced',
      };

      this.syncs.set(params.documentId, sync);

      connection.lastSync = new Date();

      console.log(`✅ Document synced to ${connection.platform}: ${dealId}`);

      return { success: true, dealId };
    } catch (error) {
      console.error('CRM sync error:', error);
      return { success: false, error: 'Sync failed' };
    }
  }

  /**
   * Sync to HubSpot
   */
  private async syncToHubSpot(
    connection: CRMConnection,
    params: any
  ): Promise<string> {
    // Simulated HubSpot API integration
    // In production, use @hubspot/api-client

    const dealId = `HS-${Date.now()}`;

    console.log(`📊 HubSpot: Creating deal "${params.documentTitle}"`);

    // Would make actual API call:
    // const hubspotClient = new hubspot.Client({ accessToken: connection.accessToken });
    // const deal = await hubspotClient.crm.deals.basicApi.create({
    //   properties: {
    //     dealname: params.documentTitle,
    //     amount: params.amount,
    //     dealstage: 'contractsent',
    //   }
    // });

    return dealId;
  }

  /**
   * Sync to Salesforce
   */
  private async syncToSalesforce(
    connection: CRMConnection,
    params: any
  ): Promise<string> {
    // Simulated Salesforce API integration
    // In production, use jsforce

    const dealId = `SF-${Date.now()}`;

    console.log(`☁️ Salesforce: Creating opportunity "${params.documentTitle}"`);

    // Would make actual API call:
    // const conn = new jsforce.Connection({ accessToken: connection.accessToken });
    // const result = await conn.sobject('Opportunity').create({
    //   Name: params.documentTitle,
    //   Amount: params.amount,
    //   StageName: 'Contract Sent',
    // });

    return dealId;
  }

  /**
   * Sync to Pipedrive
   */
  private async syncToPipedrive(
    connection: CRMConnection,
    params: any
  ): Promise<string> {
    // Simulated Pipedrive API integration
    // In production, use pipedrive npm package

    const dealId = `PD-${Date.now()}`;

    console.log(`📋 Pipedrive: Creating deal "${params.documentTitle}"`);

    // Would make actual API call:
    // const pipedrive = new Pipedrive.Client(connection.accessToken);
    // const deal = await pipedrive.Deals.add({
    //   title: params.documentTitle,
    //   value: params.amount,
    //   stage_id: 2, // Contract stage
    // });

    return dealId;
  }

  /**
   * Sync to Zoho
   */
  private async syncToZoho(
    connection: CRMConnection,
    params: any
  ): Promise<string> {
    // Simulated Zoho API integration

    const dealId = `ZH-${Date.now()}`;

    console.log(`📈 Zoho: Creating deal "${params.documentTitle}"`);

    return dealId;
  }

  /**
   * Get CRM contacts
   */
  async getCRMContacts(connectionId: string): Promise<CRMContact[]> {
    const connection = this.connections.get(connectionId);

    if (!connection || !connection.connected) {
      return [];
    }

    // Simulated contact fetch
    const mockContacts: CRMContact[] = [
      {
        id: 'contact_1',
        email: 'john@acme.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
        phone: '+1234567890',
      },
      {
        id: 'contact_2',
        email: 'sarah@techco.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        company: 'TechCo',
        phone: '+1987654321',
      },
    ];

    console.log(`📇 Fetched ${mockContacts.length} contacts from ${connection.platform}`);

    return mockContacts;
  }

  /**
   * Get CRM deals
   */
  async getCRMDeals(connectionId: string): Promise<CRMDeal[]> {
    const connection = this.connections.get(connectionId);

    if (!connection || !connection.connected) {
      return [];
    }

    // Simulated deal fetch
    const mockDeals: CRMDeal[] = [
      {
        id: 'deal_1',
        name: 'Q1 2025 Contract',
        amount: 50000,
        stage: 'negotiation',
        contactId: 'contact_1',
        closeDate: new Date('2025-03-31'),
        probability: 75,
      },
      {
        id: 'deal_2',
        name: 'Annual Service Agreement',
        amount: 120000,
        stage: 'proposal',
        contactId: 'contact_2',
        closeDate: new Date('2025-04-15'),
        probability: 60,
      },
    ];

    console.log(`💼 Fetched ${mockDeals.length} deals from ${connection.platform}`);

    return mockDeals;
  }

  /**
   * Auto-sync on document events
   */
  async autoSync(params: {
    userId: string;
    documentId: string;
    documentTitle: string;
    documentType: string;
    contactEmail?: string;
    amount?: number;
    event: 'created' | 'signed' | 'paid';
  }): Promise<void> {
    const connections = this.getUserConnections(params.userId);

    for (const connection of connections) {
      if (connection.connected && connection.metadata.autoSync) {
        await this.syncDocumentToCRM({
          documentId: params.documentId,
          documentTitle: params.documentTitle,
          documentType: params.documentType,
          amount: params.amount,
          contactEmail: params.contactEmail,
          connectionId: connection.id,
        });
      }
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(documentId: string): DocumentSync | null {
    return this.syncs.get(documentId) || null;
  }

  /**
   * Get integration statistics
   */
  getStatistics(userId: string): {
    connectedPlatforms: string[];
    totalSyncs: number;
    recentSyncs: DocumentSync[];
    lastSyncDate?: Date;
  } {
    const connections = this.getUserConnections(userId);
    const userSyncs = Array.from(this.syncs.values()).filter(
      sync => connections.some(c => c.platform === sync.crmPlatform)
    );

    return {
      connectedPlatforms: connections.filter(c => c.connected).map(c => c.platform),
      totalSyncs: userSyncs.length,
      recentSyncs: userSyncs.slice(-10),
      lastSyncDate: connections[0]?.lastSync,
    };
  }

  /**
   * Supported CRM platforms
   */
  getSupportedPlatforms(): Array<{
    id: string;
    name: string;
    description: string;
    features: string[];
  }> {
    return [
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Popular CRM for inbound marketing and sales',
        features: ['Deals', 'Contacts', 'Pipeline', 'Email Integration'],
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Enterprise CRM platform',
        features: ['Opportunities', 'Accounts', 'Leads', 'Custom Objects'],
      },
      {
        id: 'pipedrive',
        name: 'Pipedrive',
        description: 'Sales-focused CRM',
        features: ['Deals', 'Contacts', 'Pipeline', 'Activities'],
      },
      {
        id: 'zoho',
        name: 'Zoho CRM',
        description: 'Affordable CRM for small businesses',
        features: ['Deals', 'Contacts', 'Workflow', 'Analytics'],
      },
    ];
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default CRMIntegrationService;
