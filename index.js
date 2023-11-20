import express from "express";
import dotenv from "dotenv";
import {connect} from "./src/services/databaseService.js";
import AppRoutes from "./src/routes/routes.js";
import userService from "./src/services/userService.js";
import urlService from "./src/services/urlService.js";
import authenticateToken from "./src/middleware/auth.js";
import validateLimit from "./src/middleware/rateLimiter.js";
import validateURL from "./src/middleware/urlValidator.js";
import validateEmail from "./src/middleware/emailValidator.js";

const app = express()
app.use(express.json())

const config = dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// connect to the MongoDB database
connect(`${MONGO_URI}`) 

const middleware = {
    validateLimit: validateLimit,
    validateURL: validateURL,
    authenticateToken: authenticateToken,
    validateEmail: validateEmail
}

AppRoutes(app, userService, urlService, middleware)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
