/**
 * Specialized Document Generators
 * Each document type has its own unique, optimized layout
 */

import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

// Base class with common utilities
class BaseDocumentGenerator {
  protected readonly WIDTH = 1200;
  protected readonly HEIGHT = 1600;

  protected roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  protected wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const paragraphs = text.split('\n');
    const lines: string[] = [];

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  }

  protected async drawLogo(ctx: CanvasRenderingContext2D, logoBase64: string, x: number, y: number, maxWidth: number, maxHeight: number) {
    try {
      const img = await loadImage(logoBase64);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      ctx.drawImage(img, x, y, width, height);
    } catch (error) {
      console.log('Logo load error:', error);
    }
  }
}

// NDA Generator - Legal Document Style
export class NDAGenerator extends BaseDocumentGenerator {
  async generate(content: string, theme: any, companyName?: string, companyLogo?: string): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Legal document seal/stamp design in corner
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    ctx.arc(1050, 150, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Header - Professional legal style
    ctx.fillStyle = theme.primary;
    ctx.fillRect(0, 0, this.WIDTH, 8);

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = theme.primary;
    ctx.textAlign = 'center';
    ctx.fillText('NON-DISCLOSURE AGREEMENT', this.WIDTH / 2, 120);

    ctx.font = '18px Arial';
    ctx.fillStyle = theme.secondary;
    ctx.fillText('CONFIDENTIAL LEGAL DOCUMENT', this.WIDTH / 2, 160);
    ctx.textAlign = 'left';

    // Document ID box
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.1;
    this.roundRect(ctx, 80, 200, 300, 60, 10);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = theme.text;
    ctx.fillText(`Document ID: NDA-${Date.now().toString().slice(-8)}`, 100, 230);
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 100, 250);

    // Logo if provided
    if (companyLogo) {
      await this.drawLogo(ctx, companyLogo, this.WIDTH - 250, 200, 150, 60);
    }

    // Content in formal legal layout
    const contentY = 320;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 20;
    this.roundRect(ctx, 80, contentY, this.WIDTH - 160, 1050, 15);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Vertical line for legal document feel
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(110, contentY + 30);
    ctx.lineTo(110, contentY + 1020);
    ctx.stroke();

    // Content text
    ctx.fillStyle = theme.text;
    ctx.font = '16px Arial';
    const lines = this.wrapText(ctx, content, this.WIDTH - 260);
    let currentY = contentY + 60;

    for (let i = 0; i < Math.min(lines.length, 52); i++) {
      ctx.fillText(lines[i], 140, currentY);
      currentY += 19;
    }

    // Signature lines at bottom
    const sigY = this.HEIGHT - 180;
    ctx.strokeStyle = theme.text;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    
    ctx.beginPath();
    ctx.moveTo(120, sigY);
    ctx.lineTo(500, sigY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(700, sigY);
    ctx.lineTo(1080, sigY);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.font = '12px Arial';
    ctx.fillStyle = theme.secondary;
    ctx.fillText('Party A Signature', 120, sigY + 20);
    ctx.fillText('Party B Signature', 700, sigY + 20);
    ctx.fillText('Date: _______________', 120, sigY + 40);
    ctx.fillText('Date: _______________', 700, sigY + 40);

    return canvas.toBuffer('image/png');
  }
}

// Contract Generator - Modern Business Style
export class ContractGenerator extends BaseDocumentGenerator {
  async generate(content: string, theme: any, companyName?: string, companyLogo?: string): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    // Background with subtle pattern
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Diagonal accent lines background
    ctx.strokeStyle = theme.primary;
    ctx.globalAlpha = 0.02;
    ctx.lineWidth = 2;
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 80, 0);
      ctx.lineTo(i * 80 + 400, this.HEIGHT);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Modern header bar
    const gradient = ctx.createLinearGradient(0, 0, this.WIDTH, 0);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(1, theme.secondary);
    ctx.fillStyle = gradient;
    this.roundRect(ctx, 0, 0, this.WIDTH, 180, 0);
    ctx.fill();

    ctx.font = 'bold 56px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SERVICE AGREEMENT', 80, 100);

    ctx.font = '20px Arial';
    ctx.fillText(`Contract No. ${Date.now().toString().slice(-10)}`, 80, 140);

    // Logo
    if (companyLogo) {
      await this.drawLogo(ctx, companyLogo, this.WIDTH - 220, 50, 160, 80);
    }

    // Content with side tabs
    const tabColors = [theme.primary, theme.secondary, theme.accent];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = tabColors[i];
      this.roundRect(ctx, 40, 240 + i * 380, 15, 330, 7);
      ctx.fill();
    }

    // Main content area
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    this.roundRect(ctx, 80, 240, this.WIDTH - 160, 1100, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Content
    ctx.fillStyle = theme.text;
    ctx.font = '17px Arial';
    const lines = this.wrapText(ctx, content, this.WIDTH - 240);
    let currentY = 300;

    for (let i = 0; i < Math.min(lines.length, 50); i++) {
      ctx.fillText(lines[i], 120, currentY);
      currentY += 21;
    }

    // Footer badge
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.15;
    this.roundRect(ctx, this.WIDTH / 2 - 150, this.HEIGHT - 80, 300, 60, 30);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = theme.primary;
    ctx.textAlign = 'center';
    ctx.fillText('LEGALLY BINDING AGREEMENT', this.WIDTH / 2, this.HEIGHT - 45);
    ctx.textAlign = 'left';

    return canvas.toBuffer('image/png');
  }
}

// Proposal Generator - Sales/Marketing Style
export class ProposalGenerator extends BaseDocumentGenerator {
  async generate(content: string, theme: any, companyName?: string, companyLogo?: string): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Large curved accent shape
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(-200, 200, 500, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.WIDTH + 200, this.HEIGHT - 300, 600, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Diagonal header design
    const headerGradient = ctx.createLinearGradient(0, 0, this.WIDTH, 300);
    headerGradient.addColorStop(0, theme.primary);
    headerGradient.addColorStop(0.7, theme.secondary);
    headerGradient.addColorStop(1, theme.accent);
    
    ctx.fillStyle = headerGradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.WIDTH, 0);
    ctx.lineTo(this.WIDTH, 250);
    ctx.lineTo(0, 200);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('PROPOSAL', 80, 120);

    ctx.font = '24px Arial';
    ctx.fillText('Your Success, Our Priority', 80, 160);

    // Logo
    if (companyLogo) {
      await this.drawLogo(ctx, companyLogo, this.WIDTH - 250, 60, 180, 90);
    }

    // Content cards with offset design
    const cards = [
      { y: 320, color: theme.primary },
      { y: 690, color: theme.secondary },
      { y: 1060, color: theme.accent }
    ];

    for (const card of cards) {
      ctx.fillStyle = card.color;
      ctx.globalAlpha = 0.1;
      this.roundRect(ctx, 60, card.y - 20, this.WIDTH - 120, 340, 25);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 25;
      this.roundRect(ctx, 80, card.y, this.WIDTH - 160, 300, 20);
      ctx.fill();
      ctx.shadowColor = 'transparent';
    }

    // Content
    ctx.fillStyle = theme.text;
    ctx.font = '18px Arial';
    const lines = this.wrapText(ctx, content, this.WIDTH - 240);
    let currentY = 370;

    for (let i = 0; i < Math.min(lines.length, 50); i++) {
      ctx.fillText(lines[i], 120, currentY);
      currentY += 22;
    }

    return canvas.toBuffer('image/png');
  }
}

// Receipt Generator - Transaction Style
export class ReceiptGenerator extends BaseDocumentGenerator {
  async generate(content: string, theme: any, companyName?: string, companyLogo?: string): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    // Receipt paper style background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Perforated edge effect at top
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(i * 30 + 15, 20, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Receipt header
    ctx.fillStyle = theme.primary;
    this.roundRect(ctx, 80, 60, this.WIDTH - 160, 200, 15);
    ctx.fill();

    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('RECEIPT', this.WIDTH / 2, 140);

    ctx.font = '20px Arial';
    ctx.fillText(`#${Date.now().toString().slice(-10)}`, this.WIDTH / 2, 180);

    ctx.font = '16px Arial';
    ctx.fillText(new Date().toLocaleString(), this.WIDTH / 2, 220);
    ctx.textAlign = 'left';

    // Logo
    if (companyLogo) {
      await this.drawLogo(ctx, companyLogo, this.WIDTH / 2 - 75, 240, 150, 60);
    }

    // Receipt body
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    this.roundRect(ctx, 80, 340, this.WIDTH - 160, 900, 15);
    ctx.stroke();
    ctx.fill();
    ctx.setLineDash([]);

    // Dotted lines for receipt feel
    ctx.strokeStyle = theme.secondary;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.moveTo(100, 360 + i * 22);
      ctx.lineTo(this.WIDTH - 100, 360 + i * 22);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Content
    ctx.fillStyle = theme.text;
    ctx.font = '17px monospace';
    const lines = this.wrapText(ctx, content, this.WIDTH - 240);
    let currentY = 390;

    for (let i = 0; i < Math.min(lines.length, 40); i++) {
      ctx.fillText(lines[i], 120, currentY);
      currentY += 22;
    }

    // Barcode effect at bottom
    ctx.fillStyle = theme.text;
    for (let i = 0; i < 60; i++) {
      const height = 40 + Math.random() * 20;
      const width = 8 + Math.random() * 6;
      ctx.fillRect(120 + i * 16, this.HEIGHT - 120, width, height);
    }

    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`*${Date.now().toString()}*`, this.WIDTH / 2, this.HEIGHT - 60);
    ctx.textAlign = 'left';

    return canvas.toBuffer('image/png');
  }
}

// Quote Generator - Sales Quotation Style  
export class QuoteGenerator extends BaseDocumentGenerator {
  async generate(content: string, theme: any, companyName?: string, companyLogo?: string): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Corner accent triangles
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(300, 0);
    ctx.lineTo(0, 300);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.WIDTH, this.HEIGHT);
    ctx.lineTo(this.WIDTH - 300, this.HEIGHT);
    ctx.lineTo(this.WIDTH, this.HEIGHT - 300);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Header box
    ctx.fillStyle = theme.primary;
    this.roundRect(ctx, 60, 60, this.WIDTH - 120, 180, 20);
    ctx.fill();

    ctx.font = 'bold 52px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('QUOTATION', 100, 140);

    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Quote #${Date.now().toString().slice(-8)}`, 100, 190);

    // Validity badge
    ctx.fillStyle = theme.accent;
    this.roundRect(ctx, this.WIDTH - 320, 100, 240, 60, 30);
    ctx.fill();

    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('Valid for 30 Days', this.WIDTH - 200, 135);
    ctx.textAlign = 'left';

    // Logo
    if (companyLogo) {
      await this.drawLogo(ctx, companyLogo, 100, 240, 150, 70);
    }

    // Content area
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 25;
    this.roundRect(ctx, 80, 350, this.WIDTH - 160, 1000, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Accent stripes
    const stripes = [theme.primary, theme.secondary, theme.accent];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = stripes[i];
      ctx.globalAlpha = 0.15;
      ctx.fillRect(90, 360 + i * 320, this.WIDTH - 180, 8);
    }
    ctx.globalAlpha = 1;

    // Content
    ctx.fillStyle = theme.text;
    ctx.font = '18px Arial';
    const lines = this.wrapText(ctx, content, this.WIDTH - 240);
    let currentY = 400;

    for (let i = 0; i < Math.min(lines.length, 42); i++) {
      ctx.fillText(lines[i], 120, currentY);
      currentY += 22;
    }

    // Action box at bottom
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.1;
    this.roundRect(ctx, 80, this.HEIGHT - 140, this.WIDTH - 160, 100, 20);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = theme.primary;
    ctx.textAlign = 'center';
    ctx.fillText('ACCEPT QUOTE →', this.WIDTH / 2, this.HEIGHT - 75);
    ctx.textAlign = 'left';

    return canvas.toBuffer('image/png');
  }
}

export default {
  NDAGenerator,
  ContractGenerator,
  ProposalGenerator,
  ReceiptGenerator,
  QuoteGenerator
};
