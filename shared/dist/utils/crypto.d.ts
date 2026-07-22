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
export declare function hashDocument(content: string): Promise<string>;
export declare function signDocument(content: string, privateKey: CryptoKey): Promise<CryptographicSignature>;
export declare function verifySignature(content: string, signature: CryptographicSignature, publicKey: CryptoKey): Promise<boolean>;
export declare function generateKeyPair(): Promise<CryptoKeyPair>;
export declare function isSignatureExpired(signature: CryptographicSignature, expirationHours: number): boolean;
//# sourceMappingURL=crypto.d.ts.map