/**
 * Smart Templates Marketplace Service
 * Curated templates with AI customization and monetization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  price: number; // 0 for free templates
  authorId: string;
  authorName: string;
  downloads: number;
  rating: number;
  reviews: number;
  content: string;
  variables: string[]; // Fields that can be customized
  thumbnail: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface TemplateCustomization {
  templateId: string;
  variables: Record<string, any>;
  aiEnhancements?: string;
}

class TemplateMarketplaceService {
  private genAI: GoogleGenerativeAI;
  private templates: Map<string, Template> = new Map();
  private categories: TemplateCategory[] = [];
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    this.initializeTemplates();
    this.initializeCategories();
    
    console.log('📚 Template Marketplace initialized');
  }

  /**
   * Initialize featured templates
   */
  private initializeTemplates(): void {
    const templates: Template[] = [
      // Legal Templates
      {
        id: 'tpl_nda_tech',
        name: 'Tech Company NDA',
        description: 'Comprehensive NDA for technology companies with IP protection clauses',
        category: 'legal',
        industry: 'technology',
        price: 0,
        authorId: 'safedoc',
        authorName: 'SafeDoc AI',
        downloads: 1247,
        rating: 4.8,
        reviews: 89,
        content: 'NDA_TEMPLATE_CONTENT',
        variables: ['companyName', 'recipientName', 'effectiveDate', 'jurisdiction'],
        thumbnail: 'nda-tech.png',
        featured: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-29'),
        tags: ['nda', 'technology', 'ip-protection', 'confidentiality'],
      },
      {
        id: 'tpl_contract_freelance',
        name: 'Freelance Service Contract',
        description: 'Professional contract for freelance consultants and contractors',
        category: 'contracts',
        industry: 'services',
        price: 9.99,
        authorId: 'legal_pro_123',
        authorName: 'Legal Pro Templates',
        downloads: 2156,
        rating: 4.9,
        reviews: 178,
        content: 'FREELANCE_CONTRACT_CONTENT',
        variables: ['clientName', 'contractorName', 'services', 'rate', 'paymentTerms'],
        thumbnail: 'freelance-contract.png',
        featured: true,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-28'),
        tags: ['freelance', 'contract', 'services', 'payment'],
      },
      
      // Business Templates
      {
        id: 'tpl_proposal_saas',
        name: 'SaaS Sales Proposal',
        description: 'Winning proposal template for SaaS companies',
        category: 'proposals',
        industry: 'saas',
        price: 14.99,
        authorId: 'sales_guru_456',
        authorName: 'Sales Guru',
        downloads: 892,
        rating: 4.7,
        reviews: 64,
        content: 'SAAS_PROPOSAL_CONTENT',
        variables: ['companyName', 'clientName', 'solution', 'pricing', 'timeline'],
        thumbnail: 'saas-proposal.png',
        featured: true,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-27'),
        tags: ['proposal', 'saas', 'sales', 'b2b'],
      },
      {
        id: 'tpl_invoice_creative',
        name: 'Creative Agency Invoice',
        description: 'Beautiful invoice template for creative agencies',
        category: 'invoices',
        industry: 'creative',
        price: 0,
        authorId: 'safedoc',
        authorName: 'SafeDoc AI',
        downloads: 3421,
        rating: 4.9,
        reviews: 234,
        content: 'CREATIVE_INVOICE_CONTENT',
        variables: ['agencyName', 'clientName', 'projectName', 'items', 'total'],
        thumbnail: 'creative-invoice.png',
        featured: true,
        createdAt: new Date('2025-01-08'),
        updatedAt: new Date('2025-01-29'),
        tags: ['invoice', 'creative', 'design', 'agency'],
      },
      
      // HR Templates
      {
        id: 'tpl_offer_letter',
        name: 'Job Offer Letter',
        description: 'Professional offer letter template with benefits details',
        category: 'hr',
        industry: 'general',
        price: 4.99,
        authorId: 'hr_expert_789',
        authorName: 'HR Expert',
        downloads: 1534,
        rating: 4.8,
        reviews: 112,
        content: 'OFFER_LETTER_CONTENT',
        variables: ['candidateName', 'position', 'salary', 'startDate', 'benefits'],
        thumbnail: 'offer-letter.png',
        featured: false,
        createdAt: new Date('2025-01-12'),
        updatedAt: new Date('2025-01-26'),
        tags: ['hr', 'hiring', 'offer', 'employment'],
      },
      
      // Real Estate Templates
      {
        id: 'tpl_lease_residential',
        name: 'Residential Lease Agreement',
        description: 'Comprehensive lease agreement for residential properties',
        category: 'real-estate',
        industry: 'real-estate',
        price: 19.99,
        authorId: 'realestate_pro',
        authorName: 'Real Estate Pro',
        downloads: 678,
        rating: 4.6,
        reviews: 45,
        content: 'LEASE_AGREEMENT_CONTENT',
        variables: ['landlordName', 'tenantName', 'propertyAddress', 'rent', 'leaseTerm'],
        thumbnail: 'lease-agreement.png',
        featured: false,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-25'),
        tags: ['lease', 'rental', 'real-estate', 'property'],
      },
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Initialize template categories
   */
  private initializeCategories(): void {
    this.categories = [
      { id: 'legal', name: 'Legal Documents', icon: '⚖️', count: 234 },
      { id: 'contracts', name: 'Contracts', icon: '📝', count: 156 },
      { id: 'proposals', name: 'Proposals', icon: '💼', count: 89 },
      { id: 'invoices', name: 'Invoices', icon: '💰', count: 312 },
      { id: 'hr', name: 'HR Documents', icon: '👥', count: 127 },
      { id: 'real-estate', name: 'Real Estate', icon: '🏠', count: 67 },
      { id: 'marketing', name: 'Marketing', icon: '📈', count: 93 },
      { id: 'agreements', name: 'Agreements', icon: '🤝', count: 178 },
    ];
  }

  /**
   * Get all templates
   */
  getAllTemplates(filters?: {
    category?: string;
    industry?: string;
    priceRange?: { min: number; max: number };
    featured?: boolean;
    search?: string;
  }): Template[] {
    let templates = Array.from(this.templates.values());

    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.industry) {
        templates = templates.filter(t => t.industry === filters.industry);
      }
      if (filters.priceRange) {
        templates = templates.filter(
          t => t.price >= filters.priceRange!.min && t.price <= filters.priceRange!.max
        );
      }
      if (filters.featured !== undefined) {
        templates = templates.filter(t => t.featured === filters.featured);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        templates = templates.filter(
          t =>
            t.name.toLowerCase().includes(search) ||
            t.description.toLowerCase().includes(search) ||
            t.tags.some(tag => tag.includes(search))
        );
      }
    }

    return templates.sort((a, b) => b.rating * b.downloads - a.rating * a.downloads);
  }

  /**
   * Get template by ID
   */
  getTemplateById(id: string): Template | null {
    return this.templates.get(id) || null;
  }

  /**
   * Get featured templates
   */
  getFeaturedTemplates(limit: number = 6): Template[] {
    return this.getAllTemplates({ featured: true }).slice(0, limit);
  }

  /**
   * Get categories
   */
  getCategories(): TemplateCategory[] {
    return this.categories;
  }

  /**
   * Customize template with AI
   */
  async customizeTemplate(params: TemplateCustomization): Promise<string> {
    const template = this.templates.get(params.templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a professional document customization expert. Customize this ${template.name} template with the provided variables.

TEMPLATE: ${template.name}
CATEGORY: ${template.category}
INDUSTRY: ${template.industry}

VARIABLES PROVIDED:
${JSON.stringify(params.variables, null, 2)}

${params.aiEnhancements ? `ADDITIONAL CUSTOMIZATION REQUESTS:\n${params.aiEnhancements}` : ''}

TASK:
1. Generate a complete, professional ${template.name}
2. Use all provided variables naturally
3. Maintain professional tone and formatting
4. Include all necessary legal/business language
5. Make it ready-to-use

${params.aiEnhancements ? 'Apply the requested customizations while maintaining document integrity.' : ''}

Generate the complete, customized document now:`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const customizedContent = response.text();

      console.log(`✅ Template customized: ${template.name}`);

      return customizedContent;
    } catch (error) {
      console.error('Template customization error:', error);
      throw new Error('Failed to customize template');
    }
  }

  /**
   * Search templates
   */
  searchTemplates(query: string, limit: number = 10): Template[] {
    return this.getAllTemplates({ search: query }).slice(0, limit);
  }

  /**
   * Get trending templates
   */
  getTrendingTemplates(limit: number = 10): Template[] {
    return Array.from(this.templates.values())
      .sort((a, b) => {
        // Calculate trend score based on recent downloads and rating
        const aScore = (a.downloads / 100) + (a.rating * 10);
        const bScore = (b.downloads / 100) + (b.rating * 10);
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  /**
   * Track template download
   */
  trackDownload(templateId: string, userId: string): void {
    const template = this.templates.get(templateId);
    
    if (template) {
      template.downloads += 1;
      console.log(`📥 Template downloaded: ${template.name} (${template.downloads} total)`);
    }
  }

  /**
   * Add review
   */
  addReview(templateId: string, rating: number, userId: string): void {
    const template = this.templates.get(templateId);
    
    if (template) {
      // Calculate new average rating
      const totalRating = template.rating * template.reviews + rating;
      template.reviews += 1;
      template.rating = totalRating / template.reviews;
      
      console.log(`⭐ Review added: ${template.name} - ${rating}/5 (new avg: ${template.rating.toFixed(1)})`);
    }
  }

  /**
   * Get recommended templates based on user history
   */
  async getRecommendations(userHistory: string[], limit: number = 5): Promise<Template[]> {
    if (userHistory.length === 0) {
      return this.getFeaturedTemplates(limit);
    }

    // Simple recommendation: find templates in similar categories
    const templates = Array.from(this.templates.values());
    const userCategories = new Set<string>(
      userHistory
        .map(docType => {
          // Map document types to categories
          if (docType.includes('nda') || docType.includes('contract')) return 'legal';
          if (docType.includes('invoice') || docType.includes('receipt')) return 'invoices';
          if (docType.includes('proposal') || docType.includes('quote')) return 'proposals';
          return 'general';
        })
    );

    const recommended = templates
      .filter(t => userCategories.has(t.category))
      .sort((a, b) => b.rating * b.downloads - a.rating * a.downloads)
      .slice(0, limit);

    return recommended.length > 0 ? recommended : this.getFeaturedTemplates(limit);
  }

  /**
   * Calculate revenue share (70/30 split)
   */
  calculateRevenue(price: number): { author: number; platform: number } {
    const authorShare = price * 0.7;
    const platformShare = price * 0.3;
    
    return {
      author: Number(authorShare.toFixed(2)),
      platform: Number(platformShare.toFixed(2)),
    };
  }

  /**
   * Get marketplace stats
   */
  getMarketplaceStats(): {
    totalTemplates: number;
    totalDownloads: number;
    totalAuthors: number;
    avgRating: number;
    topCategory: string;
  } {
    const templates = Array.from(this.templates.values());
    const totalDownloads = templates.reduce((sum, t) => sum + t.downloads, 0);
    const totalRating = templates.reduce((sum, t) => sum + t.rating, 0);
    const authors = new Set(templates.map(t => t.authorId));
    
    // Find top category
    const categoryCounts = templates.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'legal';

    return {
      totalTemplates: templates.length,
      totalDownloads,
      totalAuthors: authors.size,
      avgRating: totalRating / templates.length,
      topCategory,
    };
  }
}

export default TemplateMarketplaceService;
