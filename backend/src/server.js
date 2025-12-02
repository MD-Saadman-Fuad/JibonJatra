import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
//import Feed from "../../frontend/src/pages/Feed.jsx";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import marketPriceRoutes from "./routes/marketPriceRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import reviewRoutes from './routes/reviewRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import sponsoredRoutes from './routes/sponsoredRoutes.js'; // ✅ ADDED SPONSORED ROUTES
import homeRoutes from "./routes/homeRoutes.js"; // ✅ ADDED HOME ROUTES (NEW LINE)

dotenv.config();
const app = express();

// Middleware
// app.use(cors({ origin: "http://localhost:3000" }));
const allowedOrigins = [
  'http://localhost:3000',
  'https://jibonjatra-web.onrender.com',
  process.env.FRONTEND_URL, // Will be set in Render
  "https://jibonjatra-web.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
// //////
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
app.use("/api/homes", homeRoutes); // ✅ ADDED HOME ROUTES (NEW LINE)
app.use("/api/items", itemRouter);
app.use("/api/products", productRoutes);
app.use("/api/market", marketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/feed', feedRoutes);
app.use("/api/sponsored-posts", sponsoredRoutes); // ✅ ADDED SPONSORED ROUTES

//app.use('/api/feed', Feed);


// Health check
app.get("/", (req, res) => res.send("🚀 Running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));