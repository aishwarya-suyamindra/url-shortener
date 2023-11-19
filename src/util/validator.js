import {URL} from 'url';

/**
 * Validates the given url.
 * 
 * @param {The URL to validate} url 
 * @returns true if the url is valid, false otherwise
 */
export const validateURL = (url) => {
    try {
        const parsedURL = new URL(url)
        return true
    } catch {
        return false
    }
}