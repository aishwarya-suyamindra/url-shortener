import {URL} from 'url';

/**
 * Middleware to check if the original url is a valid url.
 */
const validateURL = async(req, res, next) => {
    const originalUrl = req.body.url
    if (!originalUrl) {
      res.sendStatus(400).send("Provide the URL to shorten!")
    }
    try {
      validate(originalUrl)
      next();
    } catch(error) {
      res.sendStatus(400).json("Invalid URL!")
    }
  }

const validate = (url) => {
    return new URL(url)
}

export default validateURL