import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const urlSchema = new Schema({
  _id: String,
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  users: [{
    type: String,
    ref: 'User'
  }]
}, {timestamps: true});

const Url = model("Url", urlSchema);
export default Url;