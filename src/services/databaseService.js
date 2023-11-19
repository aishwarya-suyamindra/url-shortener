import Tier from "../models/tier.js";
import User from "../models/userModel.js";
import Url from "../models/urlModel.js";
import mongoose from "mongoose";

/**
 * Connects to the database.
 * 
 * @param {String} MONGO_URI The database url to connect to
 */
const connect = async (MONGO_URI) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to the database', error.message);
  }
};

/**
 * Returns the current tiers
 * 
 * @returns 
 */
const getTiers = async() => {
  return await Tier.find()
}

/**
 * Returns the tier filtered based on the predicate.
 * 
 * @param {Object} predicate 
 * @returns the tier
 */
const getTier = async(predicate) => {
  try {
    return await Tier.findOne(predicate)
  } catch(error) {
    console.log(error)
  }
}

/**
 * Returns the user filtered based on the predicate.
 * 
 * @param {Object} predicate 
 * @returns the user
 */
const getUser = async(predicate) => {
  return await User.findOne(predicate)
}

/**
 * Saves the given user object in the database.
 * 
 * @param {User} user 
 */
const createUser = async(user) => {
  return await User.create(user)
}

/**
 * Finds the user by the given predicate, updates the given values and returns the modified user
 * 
 * @param {Object} predicate the predicate to filter the user document by
 * @param {Object} valuesToUpdate the fields to update to
 * @param {Boolean} upsert boolean value to indicate if the document is to be inserted if there's no match for the filter predicate
 * 
 * @returns 
 */
const findAndModifyUser = async(predicate, valuesToUpdate, upsert) => {
  return await User.findOneAndUpdate(predicate, {$set: valuesToUpdate})
}

/**
 * Returns the URL filtered based on the predicate.
 * 
 * @param {Object} predicate 
 * @returns the url
 */
const getURL = async(predicate) => {
  return await Url.findOne(predicate)
}

/**
 * Creates a URL document with the given data.
 * 
 * @param {obj} data 
 * @returns document
 */
const createURLDocument = (data) => {
  const {code, originalUrl, shortUrl, userId } = data
  const doc = {
    _id: code,
    originalUrl: originalUrl,
    shortUrl: shortUrl,
    users: [userId]
  }
  return doc
}

/**
 * Saves the given url object in the database.
 * 
 * @param {Url} the url document to save 
 */
const saveShortUrl = async(url) => {
  return await Url.create(url)
}

/**
 * Adds the given userId for the url, if not already present.
 * 
 * @param {String} userId 
 * @param {String} code the unique code of the short url
 * @returns 
 */
const addUserForUrl = async(userId, code) => {
  return await Url.findByIdAndUpdate(code, {$addToSet: { users: userId }})//updateOne({_id: code}, { $add: { 'users': userId }})
}

const getUrlsForUser = async(userId) => {
  return await Url.find({users: {$in: [userId]}})
}

// TODO: Remove, for testing purpose only
/**
 * Saves the given tier object in the database.
 * 
 * @param {User} user 
 */
const createTier = async(tier) => {
  return await Tier.create(tier)
}

export {getTier, getTiers, getUser, findAndModifyUser, connect, createUser, createTier, getURL, createURLDocument, saveShortUrl, addUserForUrl, getUrlsForUser};