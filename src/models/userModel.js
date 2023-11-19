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
        ref: 'Tier',
        required: true,
    },
    usage: {
        windowStart: Date,
        windowEnd: Date,
        tokenCount: {
            type: Number,
            default: 0
        }
    }
},
    { timestamps: true }
);

const User = model('User', userSchema);
export default User;