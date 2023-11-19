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
// export const validateURL = (url) => {
//     var pattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
//     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
//     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
//     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
//     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
//     '(\\#[-a-z\\d_]*)?$','i');

//   return !!urlPattern.test(value);
// }