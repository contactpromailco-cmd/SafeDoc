/**
 * Invoice Image Generator
 * Creates beautiful PNG invoices with professional design
 */

import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyLogo?: string; // base64 or URL
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  note: string;
}

class InvoiceImageGenerator {
  private readonly WIDTH = 1200;
  private readonly HEIGHT = 1600;
  
  // Color palette - Modern professional theme
  private readonly COLORS = {
    primary: '#6366F1',      // Indigo
    secondary: '#8B5CF6',    // Purple
    accent: '#EC4899',       // Pink
    dark: '#1F2937',         // Dark gray
    medium: '#6B7280',       // Medium gray
    light: '#F3F4F6',        // Light gray
    white: '#FFFFFF',
    success: '#10B981',      // Green
    background: '#FAFAFA'
  };

  async generateInvoice(data: InvoiceData): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    // Background
    this.drawBackground(ctx);

    // Header with gradient
    this.drawHeader(ctx, data);

    // Company logo if provided
    if (data.companyLogo && data.companyLogo.startsWith('data:image')) {
      await this.drawLogo(ctx, data.companyLogo);
    }

    // Invoice details section
    this.drawInvoiceDetails(ctx, data);

    // Client and company info side by side
    this.drawContactInfo(ctx, data);

    // Items table
    this.drawItemsTable(ctx, data);

    // Payment info
    this.drawPaymentInfo(ctx, data);

    // Footer
    this.drawFooter(ctx, data);

    return canvas.toBuffer('image/png');
  }

  private drawBackground(ctx: CanvasRenderingContext2D) {
    // Subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.HEIGHT);
    gradient.addColorStop(0, '#FEFEFE');
    gradient.addColorStop(1, '#F8F9FA');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  private drawHeader(ctx: CanvasRenderingContext2D, data: InvoiceData) {
    // Top gradient bar
    const gradient = ctx.createLinearGradient(0, 0, this.WIDTH, 0);
    gradient.addColorStop(0, this.COLORS.primary);
    gradient.addColorStop(0.5, this.COLORS.secondary);
    gradient.addColorStop(1, this.COLORS.accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.WIDTH, 120);

    // INVOICE text
    ctx.fillStyle = this.COLORS.white;
    ctx.font = 'bold 56px Arial';
    ctx.fillText('INVOICE', 60, 80);

    // Invoice number
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`#${data.invoiceNumber}`, this.WIDTH - 60, 80);
    ctx.textAlign = 'left';
  }

  private async drawLogo(ctx: CanvasRenderingContext2D, logoBase64: string) {
    try {
      const img = await loadImage(logoBase64);
      const maxWidth = 150;
      const maxHeight = 80;
      
      let width = img.width;
      let height = img.height;
      
      // Scale down if needed
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      ctx.drawImage(img, this.WIDTH - 220, 140, width, height);
    } catch (error) {
      console.log('Logo load error:', error);
    }
  }

  private drawInvoiceDetails(ctx: CanvasRenderingContext2D, data: InvoiceData) {
    const startY = 160;
    
    // White card background
    ctx.fillStyle = this.COLORS.white;
    this.roundRect(ctx, 60, startY, 500, 120, 12);
    ctx.fill();
    
    // Shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    
    ctx.fillStyle = this.COLORS.white;
    this.roundRect(ctx, 60, startY, 500, 120, 12);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Date labels
    ctx.fillStyle = this.COLORS.medium;
    ctx.font = '16px Arial';
    ctx.fillText('Issue Date', 90, startY + 40);
    ctx.fillText('Due Date', 90, startY + 85);

    // Date values
    ctx.fillStyle = this.COLORS.dark;
    ctx.font = 'bold 18px Arial';
    ctx.fillText(data.date, 280, startY + 40);
    ctx.fillText(data.dueDate, 280, startY + 85);
  }

  private drawContactInfo(ctx: CanvasRenderingContext2D, data: InvoiceData) {
    const startY = 320;
    const cardWidth = 500;
    const gap = 40;

    // Billed To card
    ctx.fillStyle = this.COLORS.white;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    this.roundRect(ctx, 60, startY, cardWidth, 200, 12);
    ctx.fill();

    // From card
    this.roundRect(ctx, 60 + cardWidth + gap, startY, cardWidth, 200, 12);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Billed To content
    ctx.fillStyle = this.COLORS.primary;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('BILLED TO', 90, startY + 45);

    ctx.fillStyle = this.COLORS.dark;
    ctx.font = 'bold 22px Arial';
    ctx.fillText(data.clientName, 90, startY + 85);

    ctx.fillStyle = this.COLORS.medium;
    ctx.font = '16px Arial';
    ctx.fillText(data.clientAddress, 90, startY + 115);
    ctx.fillText(data.clientEmail, 90, startY + 145);

    // From content
    const fromX = 60 + cardWidth + gap + 30;
    ctx.fillStyle = this.COLORS.secondary;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('FROM', fromX, startY + 45);

    ctx.fillStyle = this.COLORS.dark;
    ctx.font = 'bold 22px Arial';
    ctx.fillText(data.companyName, fromX, startY + 85);

    ctx.fillStyle = this.COLORS.medium;
    ctx.font = '16px Arial';
    ctx.fillText(data.companyAddress, fromX, startY + 115);
    ctx.fillText(data.companyEmail, fromX, startY + 145);
    ctx.fillText(data.companyPhone, fromX, startY + 170);
  }

  private drawItemsTable(ctx: CanvasRenderingContext2D, data: InvoiceData) {
    const startY = 570;
    const tableWidth = this.WIDTH - 120;
    const rowHeight = 50;
    
    // Table header background
    const gradient = ctx.createLinearGradient(0, startY, this.WIDTH, startY);
    gradient.addColorStop(0, this.COLORS.primary);
    gradient.addColorStop(1, this.COLORS.secondary);
    
    ctx.fillStyle = gradient;
    this.roundRect(ctx, 60, startY, tableWidth, rowHeight, 12, true, false);
    ctx.fill();

    // Header text
    ctx.fillStyle = this.COLORS.white;
    ctx.font = 'bold 18px Arial';
    ctx.fillText('DESCRIPTION', 90, startY + 32);
    ctx.fillText('QTY', 650, startY + 32);
    ctx.fillText('UNIT PRICE', 780, startY + 32);
    ctx.fillText('AMOUNT', 1000, startY + 32);

    // Table rows
    let currentY = startY + rowHeight;
    
    data.items.forEach((item, index) => {
      // Alternating row colors
      ctx.fillStyle = index % 2 === 0 ? '#FAFBFC' : this.COLORS.white;
      ctx.fillRect(60, currentY, tableWidth, rowHeight);

      // Row content
      ctx.fillStyle = this.COLORS.dark;
      ctx.font = '17px Arial';
      ctx.fillText(item.description, 90, currentY + 32);
      
      ctx.font = '16px Arial';
      ctx.fillText(item.quantity.toString(), 670, currentY + 32);
      ctx.fillText(`$${item.unitPrice.toFixed(2)}`, 780, currentY + 32);
      
      ctx.font = 'bold 17px Arial';
      ctx.fillText(`$${item.amount.toFixed(2)}`, 1000, currentY + 32);

      currentY += rowHeight;
    });

    // Bottom border of table
    ctx.strokeStyle = this.COLORS.light;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, currentY);
    ctx.lineTo(60 + tableWidth, currentY);
    ctx.stroke();

    // Totals section
    currentY += 30;
    
    ctx.fillStyle = this.COLORS.medium;
    ctx.font = '18px Arial';
    ctx.fillText('Subtotal', 800, currentY);
    ctx.fillStyle = this.COLORS.dark;
    ctx.fillText(`$${data.subtotal.toFixed(2)}`, 1000, currentY);

    currentY += 40;
    ctx.fillStyle = this.COLORS.medium;
    ctx.fillText(`Tax (${data.tax > 0 ? '10' : '0'}%)`, 800, currentY);
    ctx.fillStyle = this.COLORS.dark;
    ctx.fillText(`$${data.tax.toFixed(2)}`, 1000, currentY);

    // Total with highlight
    currentY += 50;
    ctx.fillStyle = this.COLORS.primary;
    this.roundRect(ctx, 740, currentY - 35, 400, 55, 10);
    ctx.fill();

    ctx.fillStyle = this.COLORS.white;
    ctx.font = 'bold 24px Arial';
    ctx.fillText('TOTAL', 800, currentY);
    ctx.fillText(`$${data.total.toFixed(2)}`, 1000, currentY);
  }

  private drawPaymentInfo(ctx: CanvasRenderingContext2D, data: InvoiceData) {
    const startY = 1220;
    
    ctx.fillStyle = this.COLORS.white;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    this.roundRect(ctx, 60, startY, this.WIDTH - 120, 180, 12);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Payment method
    ctx.fillStyle = this.COLORS.primary;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('💳 PAYMENT METHOD', 90, startY + 50);

    ctx.fillStyle = this.COLORS.dark;
    ctx.font = '18px Arial';
    ctx.fillText(data.paymentMethod, 90, startY + 85);

    // Note
    ctx.fillStyle = this.COLORS.secondary;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('💬 NOTE', 90, startY + 125);

    ctx.fillStyle = this.COLORS.medium;
    ctx.font = '18px Arial';
    ctx.fillText(data.note, 90, startY + 160);
  }

  private drawFooter(ctx: CanvasRenderingContext2D, data: InvoiceData) {
    const startY = 1450;
    
    // Thank you message
    ctx.fillStyle = this.COLORS.primary;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for your business! 🙏', this.WIDTH / 2, startY);

    ctx.fillStyle = this.COLORS.medium;
    ctx.font = '16px Arial';
    ctx.fillText('We appreciate your continued partnership', this.WIDTH / 2, startY + 35);

    // Contact bar
    ctx.fillStyle = this.COLORS.light;
    ctx.fillRect(0, startY + 70, this.WIDTH, 80);

    ctx.fillStyle = this.COLORS.dark;
    ctx.font = '18px Arial';
    ctx.fillText(`📧 ${data.companyEmail}  |  📞 ${data.companyPhone}`, this.WIDTH / 2, startY + 115);
    
    ctx.textAlign = 'left';
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    topOnly = false,
    bottomOnly = false
  ) {
    ctx.beginPath();
    
    if (topOnly) {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    } else if (bottomOnly) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    
    ctx.closePath();
  }
}

export default InvoiceImageGenerator;
