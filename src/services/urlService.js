import { nanoid } from 'nanoid';

/**
 * 
 * Functions to shorten and work with shortened urls.
 * 
 * @param {} repository 
 * @returns 
 */
function urlService(repository) {
    const baseURL = process.env.BASE_URL
    const functions = {
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

        getHistory: async(userId) => {
            const data = await repository.getUrlsForUser(userId)
            return data.map(x => x.originalUrl)
        }
    }

    return functions
}

export default urlService;