/**
 * Content Script
 * Monitors page for documents and triggers side panel
 */

import { MessageType, type DocumentDetectedMessage } from '@safedoc/shared';

interface DocumentPattern {
  selector: string;
  type: string;
  urlPattern?: RegExp;
}

const DOCUMENT_PATTERNS: DocumentPattern[] = [
  // Gmail attachments
  {
    selector: '.aQy[download*=".pdf"], .aQy[download*=".docx"], .aQy[download*="invoice"]',
    type: 'attachment',
    urlPattern: /mail\.google\.com/,
  },
  // Outlook attachments
  {
    selector: '[data-extension="pdf"], [data-extension="docx"], [aria-label*="invoice"]',
    type: 'attachment',
    urlPattern: /outlook\.(live|office365)\.com/,
  },
  // Stripe invoices
  {
    selector: '.InvoiceTitle, [data-testid="invoice-pdf"]',
    type: 'invoice',
    urlPattern: /dashboard\.stripe\.com/,
  },
];

let detectedDocuments = new Set<string>();
let observer: MutationObserver | null = null;

function init(): void {
  console.log('SafeDoc content script initialized');
  startObserver();
  scanPage();
}

function startObserver(): void {
  observer = new MutationObserver((mutations) => {
    let shouldScan = false;

    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }

    if (shouldScan) {
      scanPage();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function scanPage(): void {
  const currentUrl = window.location.href;

  for (const pattern of DOCUMENT_PATTERNS) {
    // Check if URL matches
    if (pattern.urlPattern && !pattern.urlPattern.test(currentUrl)) {
      continue;
    }

    // Find matching elements
    const elements = document.querySelectorAll(pattern.selector);

    elements.forEach((element) => {
      const documentId = getDocumentId(element, pattern.type);

      if (documentId && !detectedDocuments.has(documentId)) {
        detectedDocuments.add(documentId);
        notifyDocumentDetected(documentId, pattern.type, element);
      }
    });
  }
}

function getDocumentId(element: Element, type: string): string | null {
  // Try to extract unique identifier
  const downloadAttr = element.getAttribute('download');
  const href = element.getAttribute('href');
  const dataId = element.getAttribute('data-id');

  if (downloadAttr) return `${type}-${downloadAttr}`;
  if (dataId) return `${type}-${dataId}`;
  if (href) return `${type}-${href.substring(0, 50)}`;

  // Fallback to text content
  const text = element.textContent?.trim().substring(0, 50);
  return text ? `${type}-${text}` : null;
}

function notifyDocumentDetected(
  documentId: string,
  type: string,
  element: Element
): void {
  const preview = extractPreview(element);

  const message: DocumentDetectedMessage = {
    type: MessageType.DOCUMENT_DETECTED,
    timestamp: Date.now(),
    id: generateId(),
    source: 'extension',
    url: window.location.href,
    documentType: type,
    preview,
  };

  // Send to background script
  chrome.runtime.sendMessage(message).catch((error) => {
    console.error('Failed to send message:', error);
  });

  console.log('Document detected:', documentId);
}

function extractPreview(element: Element): string | undefined {
  const text = element.textContent?.trim();
  if (text && text.length > 0) {
    return text.substring(0, 100);
  }

  const alt = element.getAttribute('alt');
  if (alt) return alt;

  const title = element.getAttribute('title');
  if (title) return title;

  return undefined;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (observer) {
    observer.disconnect();
  }
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message.type);
  sendResponse({ received: true });
  return true;
});
