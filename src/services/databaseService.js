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

function database() {
  const functions = {
    /**
    * Returns the tier filtered based on the predicate.
    * 
    * @param {Object} predicate 
    * @returns the tier
    */
    getTier: async (predicate) => {
      try {
        return await Tier.findOne(predicate)
      } catch (error) {
        console.log(error)
      }
    },

    /**
    * Returns the user filtered based on the predicate.
    * 
    * @param {Object} predicate 
    * @returns the user
    */
    getUser: async (predicate) => {
      try {
        const val = await User.findOne(predicate)
        return val
      } catch(error) {
        console.log(error)
      }
    },

    /**
    * Saves the given user object in the database.
    * 
    * @param {User} user 
    */
    saveUser: async (user) => {
      return await User.create(user)
    },

    /**
    * Finds the user by the given predicate, updates the given values and returns the modified user
    * 
    * @param {Object} predicate the predicate to filter the user document by
    * @param {Object} valuesToUpdate the fields to update to
    * @param {Boolean} upsert boolean value to indicate if the document is to be inserted if there's no match for the filter predicate
    * 
    * @returns the user document 
    */
    findAndModifyUser: async (predicate, valuesToUpdate, upsert) => {
      return await User.findOneAndUpdate(predicate, { $set: valuesToUpdate })
    },

    /**
    * Returns the URL filtered based on the predicate.
    * 
    * @param {Object} predicate 
    * @returns the url
    */
    getURL: async (predicate) => {
      return await Url.findOne(predicate)
    },

    /**
     * Returns a url document with the given data
     * 
     * @param {Object} data 
     * @returns a document
     */
    createURLDocument: (data) => {
      const { code, originalUrl, shortUrl, userId } = data
      const doc = {
        _id: code,
        originalUrl: originalUrl,
        shortUrl: shortUrl,
        users: [userId]
      }
      return doc
    },

    /**
     * Returns a user document with the given data
     * 
     * @param {Object} data 
     * @returns a document
     */
    createUserDocument: (data) => {
      const { id, email, tierID, usage } = data
      const doc = {
        _id: id,
        email: email,
        tier: tierID,
        usage: usage
      }
      return doc
    },
    
    /**
    * Saves the given url object in the database.
    * 
    * @param {Url} the url document to save 
    */
    saveShortUrl: async (url) => {
      return await Url.create(url)
    },

    /**
    * Adds the given userId for the url, if not already present.
    * 
    * @param {String} userId 
    * @param {String} code the unique code of the short url
    * @returns 
    */
    addUserForUrl: async (userId, code) => {
      return await Url.findByIdAndUpdate(code, { $addToSet: { users: userId } })//updateOne({_id: code}, { $add: { 'users': userId }})
    },

    /**
     * Returns the url requests made by the given user id
     * 
     * @param {String} userId 
     * @returns a list of url requests
     */
    getUrlsForUser: async (userId) => {
      return await Url.find({ users: { $in: [userId] } })
    }
  }
  return functions
}

// TODO: Remove, for testing purpose only
/**
 * Saves the given tier object in the database.
 * 
 * @param {User} user 
 */
const createTier = async (tier) => {
  return await Tier.create(tier)
}

export { connect, database }