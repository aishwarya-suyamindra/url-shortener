import Tier from "./src/models/tier.js";
import User from "./src/models/userModel.js";
import mongoose from "mongoose";

/**
 * Removes existing data if any and inserts default data to the database.
 */
async function insertData() {
    try {
        // Delete all the collections in the database
       // mongoose.connection.db.dropDatabase()
       await Tier.deleteMany({})
        // Insert 4 tiers
        await Tier.create([
            { _id: '1', name: 'Tier 1', windowPeriodInSeconds: 300, limit: 50 },
            { _id: '2', name: 'Tier 2', windowPeriodInSeconds: 200, limit: 20 },
            { _id: '3', name: 'Tier 3', windowPeriodInSeconds: 150, limit: 15 },
            { _id: '4', name: 'Tier 4', windowPeriodInSeconds: 100, limit: 5 }
        ]);

        await User.deleteMany({})
        // Inserting 5 users with different tiers
        await User.create([
            { _id: 'u1', name: 'User 1', email: 'user1@gmail.com', tier: '1' },
            { _id: 'u2', name: 'User 2', email: 'user2@gmail.com', tier: '2' },
            { _id: 'u3', name: 'User 3', email: 'user3@gmail.com', tier: '3' },
            { _id: 'u4', name: 'User 4', email: 'user4@gmail.com', tier: '4' },
            { _id: 'u5', name: 'User 5', email: 'user5@gmail.com', tier: '1' }
        ]);
        console.log('Successfully inserted!');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}
export default insertData
