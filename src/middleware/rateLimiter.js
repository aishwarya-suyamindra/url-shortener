import { Error } from "mongoose";
import database from "../services/databaseService.js"

/**
 * Middleware to check if the user can make a request based on the user's tier.
 * 
 * @param {String} param the user id
 */

const validateLimit = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    res.status(403).send("Forbidden")
  }
  try {
    await checkLimit(userId)
    next();
  } catch (error) {
    // TODO: Add http headers
    res.status(429).send("Too many requests. Please try again in some time or upgrade your tier.")
  }
}

/**
 * Returns a limit object based on the given tier.
 * 
 * @param {String} tier 
 * @returns 
 */
const setLimit = (tier) => {
  const winStart = new Date()
  const limit = {
    windowStart: winStart,
    windowEnd: new Date(new Date(winStart).setSeconds(winStart.getSeconds() + tier.windowPeriodInSeconds)),
    tokenCount: 1
  }
  return limit
}

// Validate if the request window is a valid one, based on current time
const isValidRequestWindow = (windowStart, windowEnd) => {
  const currentTime = new Date();
  return currentTime >= windowStart && currentTime <= windowEnd;
}

/**
* Helper function to validate if the user can make a request based on the user's tier and request window.
* 
* @param {String} param the user id
*/
const checkLimit = async function (userId) {
  // a query to check in the db for an existing rate limit
  let user = await database.getUser({ _id: userId })

  if (user) {
    user = user._doc
    let userTier = user.tier
    let tier = await database.getTier({ _id: userTier })
    let limit = user.usage

    // If the request is made within a valid request window, validate the number of tokens left based on the user tier
    if (isValidRequestWindow(limit.windowStart, limit.windowEnd)) {
      // if there are no tokens left then the rate limit has been reached
      if (limit.tokenCount >= tier.limit) {
        throw new Error('Too Many Requests');
      }
      // Consume a token for the user
      const valueToUpdate = limit.tokenCount + 1
      await database.findAndModifyUser({ _id: user._id }, { 'usage.tokenCount': valueToUpdate }, false)
    } else {
      // Else, reset request window based on current time
      let limit = setLimit(tier)
      await database.findAndModifyUser({ _id: user._id }, { 'usage': limit }, false)
    }
  }
}

export default validateLimit;