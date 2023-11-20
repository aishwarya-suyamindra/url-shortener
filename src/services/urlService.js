// import { nanoid } from 'nanoid';
import shortid from "shortid";
import database from "../services/databaseService.js"

/**
 * 
 * Helper functions to shorten and work with shortened urls.
 */
function urlService() {
    const functions = {
        /**
         * Returns the shortened url for the given original url.
         * 
         * @param {String} userId userId of the user
         * @param {String} originalUrl the original url to shorten
         * @returns the short url
         */
        shortenURL: async(userId, originalUrl) => {
            const baseURL = process.env.BASE_URL
            const code = shortid.generate()
            try {
                // validate if the original URL has already been shortened, return the shortened one if it has been
                let url = await database.getURL({ originalUrl: originalUrl })
                if (url) {
                    await database.addUserForUrl(userId, url._id)
                    return url.shortUrl
                }
                const shortUrl = `${baseURL}/${code}`
                // save
                const urlDoc = database.createURLDocument({ code, originalUrl, shortUrl, userId })
                await database.saveShortUrl(urlDoc)
                return urlDoc.shortUrl
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        },

        /**
         * 
         * Returns the original url for the given short url code.
         * 
         * @param {String} code 
         * @returns the original url if the code is found, error otherwise
         */
        redirect: async(code) => {
            try {
                let url = await database.getURL({ _id: code })
                if (url) {
                    return url.originalUrl
                } else {
                    console.log(error);
                    throw new Error('URL not found!');
                }
            } catch (error) {
                console.log(error);
                throw new Error('URL not found!');
            }
        },

        /**
         * Returns a list of urls shortened by the user via the /shortenUrl endpoint.
         * 
         * @param {String} userId
         * @returns the list of urls shortened by the user
         */
        getHistory: async(userId) => {
            const data = await database.getUrlsForUser(userId)
            return data.map(x => x.originalUrl)
        }
    }
    return functions
}

export default urlService();