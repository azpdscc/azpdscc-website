
/**
 * @fileoverview Centralized configuration for AI flows and services.
 *
 * This file provides a robust way to access external services like Resend
 * by ensuring that API keys are loaded correctly from the server environment.
 */
import { Resend } from 'resend';

class AppConfig {
    private static instance: AppConfig;
    public resend: Resend | null = null;
    public resendApiKey: string | undefined = process.env.RESEND_API_KEY;

    private constructor() {
        if (this.resendApiKey) {
            this.resend = new Resend(this.resendApiKey);
        }
    }

    public static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig();
        }
        return AppConfig.instance;
    }
}

/**
 * Gets a configured Resend client instance.
 * Throws an error if the RESEND_API_KEY is not configured in the environment.
 * @returns {Resend} A configured Resend client.
 */
export function getResend(): Resend {
    const config = AppConfig.getInstance();
    if (!config.resend) {
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set in the server environment.");
        throw new Error("Server configuration error for sending emails.");
    }
    return config.resend;
}
