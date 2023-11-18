import jwt from "jsonwebtoken";
import * as repository from "../services/databaseService.js";
import userService from "../services/userService.js";

/**
 * Authenticates a bearer token in the header of the request object and adds the user information to the request object, before passing it down to the next handler.
 * 
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 * @param {*} next The callback function to the next handler 
 * @returns 
 */
const authenticateToken = (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) {
        return res.sendStatus(401)
    } 
    const token = header.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.sendStatus(403).send("Looks like your token has expired, please generate a new token using the /token endpoint")
            }
            return res.sendStatus(403)
        }

        if (!userService(repository).isRegisteredUser(user.id)) {
            return res.sendStatus(403).send("Please register first!")
        }
        req.user = user
        next()
      })
}

export default authenticateToken;