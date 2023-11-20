import express from "express";
import dotenv from "dotenv";
import { connect } from "./src/services/databaseService.js";
import AppRoutes from "./src/routes/routes.js";
import userService from "./src/services/userService.js";
import urlService from "./src/services/urlService.js";
import authenticateToken from "./src/middleware/auth.js";
import validateLimit from "./src/middleware/rateLimiter.js";
import validateURL from "./src/middleware/urlValidator.js";
import validateEmail from "./src/middleware/emailValidator.js";
import validateTier from "./src/middleware/tierValidator.js"
import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import insertData from "./insert.js";

const app = express()
app.use(express.json())

const config = dotenv.config()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

// connect to the MongoDB database
await connect(`${MONGO_URI}`)

// configure swagger
const options = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info: {
            title: "URL Shortener API",
            version: "0.1.0",
            description:
                "This is a simple url shortener made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            }
        },
        servers: [
            {
                url: process.env.BASE_URL,
            },
        ],
    },
    apis: ["./src/routes/*.js"]
}

const specs = swaggerJSDoc(options);
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// if the --insert-data flag argument is passed when the app is run, insert default data to the database
// the argument is not specified by default
const args = process.argv.slice(2)
if (args[0] === "--insert-data") {
    console.log("Insert default data")
    await insertData()
}

const middleware = {
    validateLimit: validateLimit,
    validateURL: validateURL,
    authenticateToken: authenticateToken,
    validateEmail: validateEmail,
    validateTier: validateTier
}
AppRoutes(app, userService, urlService, middleware)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
