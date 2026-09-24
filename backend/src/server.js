import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { startKeepAlive } from "./utils/keepAlive.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import reviewRoutes from './routes/reviewRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import sponsoredRoutes from './routes/sponsoredRoutes.js';
import homeRoutes from "./routes/homeRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://jibonjatra-web.onrender.com',
  process.env.FRONTEND_URL,
  "https://jibonjatra-web.vercel.app",
  "https://jibonjatra.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
await connectDB();

// Serve uploaded files
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
app.use("/uploads", express.static(path.join(dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/homes", homeRoutes);
app.use("/api/items", itemRouter);
app.use("/api/products", productRoutes);
app.use("/api/market", marketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/feed', feedRoutes);
app.use("/api/sponsored-posts", sponsoredRoutes);

// Health check
app.get("/", (req, res) => res.send("🚀 JibonJatra Backend is Active"));
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startKeepAlive();
});