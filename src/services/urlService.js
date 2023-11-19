import { nanoid } from 'nanoid';

/**
 * 
 * Helper functions to shorten and work with shortened urls.
 * 
 * @param {} repository the repository layer to use
 * @returns
 */
function urlService(repository) {
    const baseURL = process.env.BASE_URL
    const functions = {
        /**
         * Returns the shortened url for the given original url.
         * 
         * @param {String} userId userId of the user
         * @param {*} originalUrl the original url to shorten
         * @returns the short url
         */
        shortenURL: async(userId, originalUrl) => {
            const code = nanoid(10);
            try {
                // validate if the original URL has already been shortened, return the shortened one if it has been
                let url = await repository.getURL({ originalUrl: originalUrl })
                if (url) {
                    await repository.addUserForUrl(userId, url._id)
                    return url.shortUrl
                }
                const shortUrl = `${baseURL}/${code}`
                // save
                const urlDoc = repository.createURLDocument({ code, originalUrl, shortUrl, userId })
                await repository.saveShortUrl(urlDoc)
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
                let url = await repository.getURL({ _id: code })
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
            const data = await repository.getUrlsForUser(userId)
            return data.map(x => x.originalUrl)
        }
    }
    return functions
}

export default urlService;