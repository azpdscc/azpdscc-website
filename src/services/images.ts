/**
 * @fileoverview This file contains helper functions for optimizing images.
 */

/**
 * Appends query parameters to an S3 image URL to request a resized version.
 * This is useful for optimizing images for different parts of the site.
 * @param {string} url - The original S3 image URL.
 * @param {{ width?: number; height?: number }} options - The desired dimensions.
 * @returns {string} The new URL with resizing parameters.
 */
export function getOptimizedSponsorLogo(url: string, { width = 300 }: { width?: number }): string {
    // This is a basic implementation assuming the image host supports URL-based transformations.
    // For services like Cloudinary, Imgix, or even some S3 setups (with Lambda@Edge),
    // you can append query params like `?w=300` to get a resized image.
    // This prevents downloading unnecessarily large source images.
    
    // We'll check if the URL already has query params.
    if (url.includes('?')) {
        return `${url}&w=${width}`;
    }
    return `${url}?w=${width}`;
}
