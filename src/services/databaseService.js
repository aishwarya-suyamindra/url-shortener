import Tier from "../models/tier.js";
import User from "../models/userModel.js";
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
  // return await User.findOne(predicate).populate('usage')
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


// TODO: Remove, for testing purpose only
/**
 * Saves the given tier object in the database.
 * 
 * @param {User} user 
 */
const createTier = async(tier) => {
  return await Tier.create(tier)
}

export {getTier, getTiers, getUser, findAndModifyUser, connect, createUser, createTier};