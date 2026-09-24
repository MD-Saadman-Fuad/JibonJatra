import mongoose from "mongoose";
import dns from "dns";

// Set public DNS servers to resolve MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore error if custom DNS cannot be set
}

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jibonjatra";
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`✅ MongoDB Connected (${primaryUri.includes("127.0.0.1") || primaryUri.includes("localhost") ? "Local DB" : "Atlas Cloud DB"})`);
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB connection failed (${err.message}). Attempting fallback to local MongoDB...`);
    try {
      const fallbackUri = "mongodb://127.0.0.1:27017/jibonjatra";
      await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 4000 });
      console.log("✅ Connected to Local MongoDB (127.0.0.1:27017) successfully!");
    } catch (fallbackErr) {
      console.error("❌ Fatal: Could not connect to primary or fallback MongoDB:", fallbackErr.message);
      process.exit(1);
    }
  }
};

export default connectDB;