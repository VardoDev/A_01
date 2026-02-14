import { PublicKey } from '@solana/web3.js';

/**
 * Validates if a string is a valid Solana address
 * @param address - The address string to validate
 * @returns true if valid, false otherwise
 */
export const isValidSolanaAddress = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address string to validate
 * @returns true if valid, false otherwise
 */
export const isValidEthereumAddress = (address: string): boolean => {
    // Basic Ethereum address validation (0x followed by 40 hex characters)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
};

/**
 * Validates if a string is a valid ENS name
 * @param name - The ENS name to validate
 * @returns true if valid, false otherwise
 */
export const isValidENSName = (name: string): boolean => {
    // Basic ENS validation (ends with .eth)
    const ensRegex = /^[a-z0-9-]+\.eth$/i;
    return ensRegex.test(name);
};

/**
 * Validates if a string is a valid Solana domain (.sol)
 * @param name - The Solana domain name to validate
 * @returns true if valid, false otherwise
 */
export const isValidSolanaDomain = (name: string): boolean => {
    // Basic .sol domain validation
    const solDomainRegex = /^[a-z0-9-]+\.sol$/i;
    return solDomainRegex.test(name);
};

/**
 * Truncates an address for display purposes
 * @param address - The full address
 * @param startChars - Number of characters to show at start (default: 4)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated address with ellipsis
 */
export const truncateAddress = (
    address: string,
    startChars: number = 4,
    endChars: number = 4
): string => {
    if (address.length <= startChars + endChars) {
        return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Safely copies text to clipboard with error handling
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const safeClipboardCopy = async (text: string): Promise<boolean> => {
    try {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }

        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - User input string
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

/**
 * Validates URL to prevent open redirect vulnerabilities
 * @param url - URL to validate
 * @param allowedDomains - Array of allowed domains (optional)
 * @returns true if URL is safe, false otherwise
 */
export const isValidURL = (url: string, allowedDomains?: string[]): boolean => {
    try {
        const urlObj = new URL(url);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }

        // If allowed domains are specified, check against them
        if (allowedDomains && allowedDomains.length > 0) {
            return allowedDomains.some(domain =>
                urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
            );
        }

        return true;
    } catch {
        return false;
    }
};

/**
 * Rate limiter utility to prevent spam
 */
export class RateLimiter {
    private timestamps: Map<string, number[]> = new Map();

    constructor(
        private maxRequests: number = 5,
        private windowMs: number = 60000 // 1 minute
    ) { }

    /**
     * Checks if an action is allowed based on rate limiting
     * @param key - Unique identifier for the action
     * @returns true if action is allowed, false if rate limited
     */
    isAllowed(key: string): boolean {
        const now = Date.now();
        const timestamps = this.timestamps.get(key) || [];

        // Remove timestamps outside the window
        const validTimestamps = timestamps.filter(
            timestamp => now - timestamp < this.windowMs
        );

        if (validTimestamps.length >= this.maxRequests) {
            return false;
        }

        validTimestamps.push(now);
        this.timestamps.set(key, validTimestamps);
        return true;
    }

    /**
     * Clears rate limit for a specific key
     * @param key - Unique identifier to clear
     */
    clear(key: string): void {
        this.timestamps.delete(key);
    }

    /**
     * Clears all rate limits
     */
    clearAll(): void {
        this.timestamps.clear();
    }
}
