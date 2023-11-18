import mongoose from 'mongoose';

const { Schema, model } = mongoose;
/**
 * Represents a user in the system.
 */
const userSchema = new Schema({
    _id: String,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    tier: {
        type: String,
        enum: ["Tier 1", "Tier 2", "Tier 3", "Tier 4"],
        required: true,
    },
    usage: {
        windowStart: Date,
        windowEnd: Date,
        tokenCount: Number
    }
},
    { timestamps: true }
);

// userSchema.pre('findOne', function() {
//     this.populate('usage');
// });

const User = model('User', userSchema);
export default User;