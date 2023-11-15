import { Error } from "mongoose";
import { getUser, getTier, findAndModifyUser } from "../services/databaseService.js";

/**
 * Middleware to check if the user can make a request based on the user's tier.
 * 
 * @param {String} param the user id
 */
const validateLimit = async(req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    throw new Error("User Id not available!")
  }
  try {
    await checkLimit(userId)
    next();
  } catch(error) {
    // TODO: Add http headers
    res.sendStatus(429)
  }
}

/**
 * Validates if the user can make a request based on the user's tier and request window.
 * 
 * @param {String} param the user id
 */
const checkLimit = async function (userId) {
  // a query to check in the db for an existing rate limit
  let user = await getUser({ _id: userId })

  if (user) {
    user = user._doc
    let userTier = user.tier.type
    let tier = getTier({ type: userTier })
    let limit = user.usage

    // If the request is made within a valid request window, validate the number of tokens left based on the user tier
    if (isValidRequestWindow) {
      // if there are no tokens left then the rate limit has been reached
      if (limit.tokenCount > tier.limit) {
        throw new Error('Too Many Requests');
      }
      // Consume a token for the user
      const valueToUpdate = limit.tokenCount
      findAndModifyUser({ _id: user._id }, { valueToUpdate: valueToUpdate + 1 }, false)
    } else {
      // Else, reset request window based on current time
      let limit = setLimit(tier)
      findAndModifyUser({ _id: user._id }, { limit }, false)
    }
  }
};

// Validate if the request window is a valid one, based on current time
const isValidRequestWindow = (windowStart, windowEnd) => {
  const currentTime = new Date();
  return currentTime >= windowStart && currentTime <= windowEnd;
}

/**
 * Returns a limit object based on the given tier.
 * 
 * @param {String} tier 
 * @returns 
 */
const setLimit = (tier) => {
  const windowStart = Date().now
  const limit = {
    windowStart: windowStart,
    windowEnd: new Date(windowStart).getSeconds() + tier.windowPeriodInSeconds,
    limit: tier.limit
  }
  return limit
}

export default validateLimit;