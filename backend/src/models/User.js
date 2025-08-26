import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["resident", "shopkeeper", "service provider", "homeowner", "market_head", "admin"],
    default: "resident"
  },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
});

export default mongoose.model("User", userSchema);
