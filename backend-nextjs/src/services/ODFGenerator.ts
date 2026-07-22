/**
 * ODF (Open Document Format) Generator
 * Converts documents to .odt format
 */

import JSZip from 'jszip';

class ODFGenerator {
  async generateODT(title: string, content: string): Promise<Buffer> {
    const zip = new JSZip();

    // Add mimetype (must be first and uncompressed)
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text', {
      compression: 'STORE',
    });

    // Add META-INF/manifest.xml
    zip.folder('META-INF');
    zip.file('META-INF/manifest.xml', this.getManifestXML());

    // Add content.xml
    zip.file('content.xml', this.getContentXML(content));

    // Add meta.xml
    zip.file('meta.xml', this.getMetaXML(title));

    // Add styles.xml
    zip.file('styles.xml', this.getStylesXML());

    // Generate the zip file
    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return buffer;
  }

  private getManifestXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
  }

  private getContentXML(content: string): string {
    // Convert markdown-style content to ODF paragraphs
    const paragraphs = content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        // Handle headers
        if (line.startsWith('# ')) {
          return `<text:h text:style-name="Heading_20_1" text:outline-level="1">${this.escapeXML(
            line.substring(2)
          )}</text:h>`;
        }
        if (line.startsWith('## ')) {
          return `<text:h text:style-name="Heading_20_2" text:outline-level="2">${this.escapeXML(
            line.substring(3)
          )}</text:h>`;
        }
        // Regular paragraph
        return `<text:p text:style-name="Standard">${this.escapeXML(
          line
        )}</text:p>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content 
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
  office:version="1.2">
  <office:automatic-styles>
    <style:style style:name="Standard" style:family="paragraph">
      <style:paragraph-properties fo:margin-top="0.1in" fo:margin-bottom="0.1in"/>
      <style:text-properties style:font-name="Arial" fo:font-size="12pt"/>
    </style:style>
    <style:style style:name="Heading_20_1" style:family="paragraph">
      <style:text-properties fo:font-size="18pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Heading_20_2" style:family="paragraph">
      <style:text-properties fo:font-size="14pt" fo:font-weight="bold"/>
    </style:style>
  </office:automatic-styles>
  <office:body>
    <office:text>
${paragraphs}
    </office:text>
  </office:body>
</office:document-content>`;
  }

  private getMetaXML(title: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta 
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  office:version="1.2">
  <office:meta>
    <meta:generator>SafeDoc Workspace</meta:generator>
    <dc:title>${this.escapeXML(title)}</dc:title>
    <dc:creator>SafeDoc AI</dc:creator>
    <dc:date>${new Date().toISOString()}</dc:date>
  </office:meta>
</office:document-meta>`;
  }

  private getStylesXML(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles 
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
  office:version="1.2">
  <office:font-face-decls>
    <style:font-face style:name="Arial" svg:font-family="Arial"/>
  </office:font-face-decls>
  <office:styles>
    <style:default-style style:family="paragraph">
      <style:paragraph-properties fo:margin-top="0.1in" fo:margin-bottom="0.1in"/>
    </style:default-style>
  </office:styles>
</office:document-styles>`;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export default ODFGenerator;
