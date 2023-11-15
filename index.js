import express from "express";
import dotenv from "dotenv";
import * as repository from "./src/services/databaseService.js";
import AppRoutes from "./src/routes/routes.js";

const app = express()
app.use(express.json())

const config = dotenv.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

// connect to the MongoDB database
repository.connect(`${MONGO_URI}/${DB_NAME}`) 

// await repository.createTier({
//     _id: '4',
//     name:"Tier 4",
//     windowPeriodInSeconds: 60,
//     limit: 5
//   })
  
AppRoutes(app)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})
