/**
 * Universal Document Image Generator
 * Creates beautiful images for ANY document type
 */

import { createCanvas, loadImage, CanvasRenderingContext2D, registerFont } from 'canvas';

interface DocumentData {
  type: string;
  title: string;
  content: string;
  companyName?: string;
  companyLogo?: string;
  theme?: 'professional' | 'modern' | 'creative' | 'minimal';
  accentColor?: string;
}

class UniversalDocumentGenerator {
  private readonly WIDTH = 1200;
  private readonly HEIGHT = 1600;

  // Theme configurations
  private readonly THEMES = {
    professional: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    modern: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FAFAFA',
      text: '#111827',
    },
    creative: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#10B981',
      background: '#FFFBEB',
      text: '#92400E',
    },
    minimal: {
      primary: '#374151',
      secondary: '#6B7280',
      accent: '#9CA3AF',
      background: '#FFFFFF',
      text: '#111827',
    },
  };

  async generateDocument(data: DocumentData): Promise<Buffer> {
    const canvas = createCanvas(this.WIDTH, this.HEIGHT);
    const ctx = canvas.getContext('2d');

    const theme = this.THEMES[data.theme || 'modern'];

    // Background
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Header with gradient
    this.drawHeader(ctx, data, theme);

    // Logo if provided
    if (data.companyLogo && data.companyLogo.startsWith('data:image')) {
      await this.drawLogo(ctx, data.companyLogo);
    }

    // Document content
    await this.drawContent(ctx, data, theme);

    // Footer
    this.drawFooter(ctx, data, theme);

    return canvas.toBuffer('image/png');
  }

  private drawHeader(ctx: CanvasRenderingContext2D, data: DocumentData, theme: any) {
    // Gradient header bar - DISTINCT per theme
    const gradient = ctx.createLinearGradient(0, 0, this.WIDTH, 0);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(0.5, theme.secondary);
    gradient.addColorStop(1, theme.accent);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.WIDTH, 140);

    // Document type badge with theme color
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.2;
    this.roundRect(ctx, 60, 35, 250, 70, 15);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Text color based on theme
    const textColor = data.theme === 'minimal' ? '#FFFFFF' : '#FFFFFF';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 38px Arial';
    ctx.fillText(data.type.toUpperCase(), 85, 85);

    // Title
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(data.title, this.WIDTH - 60, 85);
    ctx.textAlign = 'left';

    // Theme indicator line
    ctx.fillStyle = theme.accent;
    ctx.fillRect(0, 138, this.WIDTH, 4);
  }

  private async drawLogo(ctx: CanvasRenderingContext2D, logoBase64: string) {
    try {
      const img = await loadImage(logoBase64);
      const maxWidth = 120;
      const maxHeight = 80;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      ctx.drawImage(img, this.WIDTH - 180, 160, width, height);
    } catch (error) {
      console.log('Logo load error:', error);
    }
  }

  private async drawContent(ctx: CanvasRenderingContext2D, data: DocumentData, theme: any) {
    const startY = 280;
    const padding = 80;
    const contentWidth = this.WIDTH - 2 * padding;

    // Content card background with theme-based subtle tint
    ctx.fillStyle = theme.background;
    ctx.shadowColor = `${theme.primary}40`;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    this.roundRect(ctx, padding, startY, contentWidth, 1000, 20);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Accent border for creative theme
    if (data.theme === 'creative') {
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 3;
      this.roundRect(ctx, padding, startY, contentWidth, 1000, 20);
      ctx.stroke();
    }

    // Left accent bar
    ctx.fillStyle = theme.primary;
    ctx.fillRect(padding + 20, startY + 30, 6, 940);

    // Draw content text
    ctx.fillStyle = theme.text;
    ctx.font = '18px Arial';

    const lines = this.wrapText(ctx, data.content, contentWidth - 120);
    let currentY = startY + 60;
    const lineHeight = 32;

    for (let i = 0; i < Math.min(lines.length, 25); i++) {
      ctx.fillText(lines[i], padding + 60, currentY);
      currentY += lineHeight;
    }

    // "Continued..." if text is too long
    if (lines.length > 25) {
      ctx.font = 'italic 16px Arial';
      ctx.fillStyle = theme.accent;
      ctx.fillText('[Content continues...]', padding + 60, currentY);
    }
  }

  private drawFooter(ctx: CanvasRenderingContext2D, data: DocumentData, theme: any) {
    const footerY = this.HEIGHT - 100;

    // Footer background with theme gradient
    const gradient = ctx.createLinearGradient(0, footerY, this.WIDTH, footerY);
    gradient.addColorStop(0, theme.primary);
    gradient.addColorStop(1, theme.secondary);
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(0, footerY, this.WIDTH, 100);
    ctx.globalAlpha = 1;

    // Decorative accent line
    ctx.fillStyle = theme.accent;
    ctx.fillRect(0, footerY, this.WIDTH, 3);

    // Company name
    if (data.companyName) {
      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data.companyName, this.WIDTH / 2, footerY + 40);

      ctx.font = '16px Arial';
      ctx.fillStyle = theme.secondary;
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, this.WIDTH / 2, footerY + 70);
    }

    ctx.textAlign = 'left';
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    if (radius === 0) {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.closePath();
      return;
    }

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
}

export default UniversalDocumentGenerator;
