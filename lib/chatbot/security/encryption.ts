// ============================================
// CONVERSATION ENCRYPTION - AES-256-GCM
// ============================================

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Algorithme de chiffrement
 */
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // Pour AES, l'IV doit faire 16 bytes
const AUTH_TAG_LENGTH = 16; // Pour GCM, l'auth tag fait 16 bytes
const SALT_LENGTH = 32; // Salt pour dériver la clé

/**
 * Obtenir la clé de chiffrement depuis les variables d'environnement
 * La clé doit être une chaîne base64 de 32 bytes (256 bits)
 */
function getEncryptionKey(): Buffer {
    const key = process.env.CONVERSATION_ENCRYPTION_KEY;

    if (!key) {
        throw new Error(
            "CONVERSATION_ENCRYPTION_KEY is not set. Generate one with: openssl rand -base64 32"
        );
    }

    // Décoder la clé base64 en buffer
    const keyBuffer = Buffer.from(key, "base64");

    if (keyBuffer.length !== 32) {
        throw new Error(
            "Encryption key must be 32 bytes (256 bits). Current length: " +
                keyBuffer.length
        );
    }

    return keyBuffer;
}

/**
 * Chiffrer du texte avec AES-256-GCM
 * @param plaintext Texte en clair à chiffrer
 * @returns Texte chiffré au format: iv:authTag:encryptedData (en base64)
 */
export function encrypt(plaintext: string): string {
    if (!plaintext) {
        return "";
    }

    try {
        const key = getEncryptionKey();

        // Générer un IV aléatoire (Initialization Vector)
        const iv = randomBytes(IV_LENGTH);

        // Créer le cipher
        const cipher = createCipheriv(ALGORITHM, key, iv);

        // Chiffrer le texte
        let encrypted = cipher.update(plaintext, "utf8", "base64");
        encrypted += cipher.final("base64");

        // Récupérer l'auth tag (pour GCM)
        const authTag = cipher.getAuthTag();

        // Retourner: iv:authTag:encryptedData (tout en base64)
        return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
    } catch (error) {
        throw new Error(
            `Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Déchiffrer du texte chiffré avec AES-256-GCM
 * @param ciphertext Texte chiffré au format: iv:authTag:encryptedData
 * @returns Texte en clair
 */
export function decrypt(ciphertext: string): string {
    if (!ciphertext) {
        return "";
    }

    try {
        const key = getEncryptionKey();

        // Séparer iv, authTag et encrypted data
        const parts = ciphertext.split(":");
        if (parts.length !== 3) {
            throw new Error("Invalid ciphertext format");
        }

        const iv = Buffer.from(parts[0], "base64");
        const authTag = Buffer.from(parts[1], "base64");
        const encryptedData = parts[2];

        // Valider les longueurs
        if (iv.length !== IV_LENGTH) {
            throw new Error(`Invalid IV length: ${iv.length}`);
        }
        if (authTag.length !== AUTH_TAG_LENGTH) {
            throw new Error(`Invalid auth tag length: ${authTag.length}`);
        }

        // Créer le decipher
        const decipher = createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        // Déchiffrer
        let decrypted = decipher.update(encryptedData, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        throw new Error(
            `Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Vérifier si le chiffrement est configuré
 */
export function isEncryptionEnabled(): boolean {
    try {
        getEncryptionKey();
        return true;
    } catch {
        return false;
    }
}

/**
 * Chiffrer un objet JSON
 * @param obj Objet à chiffrer
 * @returns Chaîne chiffrée
 */
export function encryptJSON<T>(obj: T): string {
    const jsonString = JSON.stringify(obj);
    return encrypt(jsonString);
}

/**
 * Déchiffrer un objet JSON
 * @param ciphertext Chaîne chiffrée
 * @returns Objet déchiffré
 */
export function decryptJSON<T>(ciphertext: string): T {
    const jsonString = decrypt(ciphertext);
    return JSON.parse(jsonString) as T;
}

/**
 * Masquer partiellement un texte chiffré pour les logs
 * Affiche seulement les 8 premiers caractères
 */
export function maskEncrypted(ciphertext: string): string {
    if (!ciphertext || ciphertext.length < 8) {
        return "***";
    }
    return `${ciphertext.substring(0, 8)}...***`;
}

/**
 * Générer une nouvelle clé de chiffrement (pour migration)
 * ATTENTION: Changer la clé rendra toutes les données chiffrées existantes illisibles
 */
export function generateNewEncryptionKey(): string {
    const key = randomBytes(32);
    return key.toString("base64");
}
