import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

/**
 * Authenticates a bearer token in the header of the request object and adds the user information to the request object, before passing it down to the next handler.
 * 
 * @param {Object} req The HTTP request object
 * @param {Object} res The HTTP response object
 * @param {} next The callback function to the next handler 
 * @returns 
 */
const authenticateToken = async (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) {
        return res.sendStatus(401)
    }
    const token = header.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(403).send("Your token has expired, please generate a new token using the /token endpoint.")
            }
            return res.sendStatus(403)
        }
        userService.isRegisteredUser(user.id).then((isRegistered) => {
            if (!isRegistered) {
                return res.status(403).send("Please register first!")
            }
            req.user = user
            next()
        })
    })
}

export default authenticateToken;