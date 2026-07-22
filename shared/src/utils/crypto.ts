/**
 * Cryptographic utilities for document signatures and verification
 */

export interface CryptographicSignature {
  signature: string;
  algorithm: string;
  timestamp: number;
  documentHash: string;
  publicKey?: string;
}

export async function hashDocument(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signDocument(
  content: string,
  privateKey: CryptoKey
): Promise<CryptographicSignature> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  const signature = await crypto.subtle.sign(
    {
      name: 'RSASSA-PKCS1-v1_5',
    },
    privateKey,
    data
  );
  
  const documentHash = await hashDocument(content);
  
  return {
    signature: arrayBufferToBase64(signature),
    algorithm: 'RSASSA-PKCS1-v1_5',
    timestamp: Date.now(),
    documentHash
  };
}

export async function verifySignature(
  content: string,
  signature: CryptographicSignature,
  publicKey: CryptoKey
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const signatureBuffer = base64ToArrayBuffer(signature.signature);
    
    const isValid = await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      publicKey,
      signatureBuffer,
      data
    );
    
    // Also verify document hash hasn't changed
    const currentHash = await hashDocument(content);
    const hashMatches = currentHash === signature.documentHash;
    
    return isValid && hashMatches;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function isSignatureExpired(
  signature: CryptographicSignature,
  expirationHours: number
): boolean {
  const now = Date.now();
  const expirationMs = expirationHours * 60 * 60 * 1000;
  return now - signature.timestamp > expirationMs;
}
