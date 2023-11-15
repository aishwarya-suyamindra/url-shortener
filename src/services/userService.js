import createToken from "../util/authUtil.js";
import { v4 as uuidv4 } from 'uuid';

const userService = (userRepository) => {    
    /**
     * Registers the user, if the user is not an existing user and returns the token for the user.
     * If the user is an existing user, returns a new token for the user.
     * 
     * @param {String} email The email of the user
     * @returns the token for the user
     */

    const functions = {
        isRegisteredUser: async(email) => {
            const user = await userRepository.getUser({email: email})
            return user ? true : false
        },

        signUp: async(email) => {
            try {
                const user = await userRepository.getUser({email: email})
                if (!user) {
                    // The new user is registered under tier 4 by default
                    // TODO: Make the tier configurable
                    const tier = await userRepository.getTier({name: "Tier 4"})
                    const date = new Date()
                    user = await userRepository.createUser({
                        _id: uuidv4(),
                        email: email,
                        tier: "Tier 4",
                        usage: {
                            windowStart: date,
                            windowEnd: new Date(new Date(date).setSeconds(date.getSeconds() + tier._doc.windowPeriodInSeconds)), //date.getSeconds() + tier._doc.windowPeriodInSeconds,
                            tokenCount: 0
                        }
                    });
                }
                const userId = user._doc._id
                const token = createToken(userId, process.env.TOKEN_SECRET)
                return token
            } catch(error) {
                throw new Error(error);
            }
        }
    }
    return functions
}

export default userService;