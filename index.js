import express from "express";
import dotenv from "dotenv";
import { connect, database } from "./src/services/databaseService.js";
import AppRoutes from "./src/routes/routes.js";
import userService from "./src/services/userService.js";
import urlService from "./src/services/urlService.js";
import authenticateToken from "./src/middleware/auth.js";
import validateLimit from "./src/middleware/rateLimiter.js";
import validateURL from "./src/middleware/urlValidator.js";
const app = express()
app.use(express.json())

const config = dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// connect to the MongoDB database
connect(`${MONGO_URI}/${DB_NAME}`) 
const repository = database()

// await repository.createTier({
//     _id: '4',
//     name:"Tier 4",
//     windowPeriodInSeconds: 60,
//     limit: 5
//   })
  
const userServiceRef = userService(repository)
const urlServiceRef = urlService(repository)

const middleware = {
    validateLimit: validateLimit(repository),
    validateURL: validateURL(),
    authenticateToken: authenticateToken(userServiceRef)
}

AppRoutes(app, userServiceRef, urlServiceRef, middleware)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
