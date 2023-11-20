import { URL } from 'url';

/**
 * Middleware to check if the original url is a valid url.
 */

const validate = (url) => {
  return new URL(url)
}

const validateURL = async (req, res, next) => {
  const originalUrl = req.body.url
  if (!originalUrl) {
    res.status(400).send("Provide the URL to shorten!")
  }
  try {
    validate(originalUrl)
    next();
  } catch (error) {
    res.status(400).send("Invalid URL!")
  }
}

export default validateURL