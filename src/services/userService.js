import createToken from "../util/authUtil.js"
import { v4 as uuidv4 } from 'uuid';
import database from "../services/databaseService.js"

/**
 * Helper functions to register the user.
 */
const userService = () => {
    const functions = {
        /**
         * Validates if the user is a registered user.
         * 
         * @param {String} userId the userId of the user
         * @returns true if the user is registered, false otherwise
         */
        isRegisteredUser: async (userId) => {
            const user = await database.getUser({ _id: userId })
            return user ? true : false
        },

        /**
        * Registers the user, if the user is not an existing user and returns the token for the user.
        * If the user is an existing user, returns a new token for the user.
        * 
        * @param {String} email The email of the user
        * @returns the token for the user
        */
        signUp: async (email) => {
            try {
                var user = await database.getUser({ email: email })
                if (!user) {
                    // A new user is registered under tier 4 by default
                    // TODO: Make the tier configurable
                    const tier = await database.getTier({ name: "Tier 4" })
                    const tierID = tier._id
                    const date = new Date()
                    const id = uuidv4()
                    const usage = {
                        windowStart: date,
                        windowEnd: new Date(new Date(date).setSeconds(date.getSeconds() + tier._doc.windowPeriodInSeconds))
                    }
                    const userDoc = database.createUserDocument({ id, email, tierID, usage })
                    user = await database.saveUser(userDoc)
                }
                const userId = user._doc._id
                const token = createToken(userId, process.env.TOKEN_SECRET)
                return token
            } catch (error) {
                throw new Error(error);
            }
        },

        upgradeTier: async (userId, tier) => {
            const user = await database.getUser({ _id: userId })
            const userTier = await database.getTier({ name: tier })
            if (!userTier) {
                throw new Error("Not a valid tier. Please specify one of 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'")
            }
            const winStart = new Date()
            const limit = {
                windowStart: winStart,
                windowEnd: new Date(new Date(winStart).setSeconds(winStart.getSeconds() + userTier.windowPeriodInSeconds)),
                tokenCount: 0
            }
            await database.findAndModifyUser({ _id: user._id }, { 'usage': limit, 'tier': userTier._id}, false)
        }
    }
    return functions
}

export default userService();