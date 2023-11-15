import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const tierSchema = new Schema({
    _id: String,
    name: {
        type: String,
        required: true
    },
    windowPeriodInSeconds: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);

const Tier = model('Tier', tierSchema);
export default Tier;