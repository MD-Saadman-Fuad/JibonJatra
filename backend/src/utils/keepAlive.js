import https from 'https';
import http from 'http';
import mongoose from 'mongoose';

/**
 * Self-pinging service to prevent Render free-tier web instances
 * from spinning down after 15 minutes of inactivity, and to keep
 * the MongoDB Atlas connection pool warm and active.
 */
export const startKeepAlive = () => {
  const PING_INTERVAL_MS = 10 * 60 * 1000; // Ping every 10 minutes
  const DB_PING_INTERVAL_MS = 5 * 60 * 1000; // DB keep-alive every 5 minutes

  // 1. Keep Server Awake (Render / External Hosting)
  setInterval(() => {
    const targetUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.BACKEND_URL ||
      "https://jibonjatra.onrender.com";

    if (!targetUrl) return;

    try {
      const client = targetUrl.startsWith("https") ? https : http;
      const request = client.get(targetUrl, (res) => {
        console.log(`[KeepAlive] 📡 Pinged ${targetUrl} - Status: ${res.statusCode}`);
      });

      request.on("error", (err) => {
        console.warn(`[KeepAlive] ⚠️ Ping warning for ${targetUrl}:`, err.message);
      });

      request.setTimeout(10000, () => {
        request.destroy();
      });
    } catch (e) {
      console.warn("[KeepAlive] Failed to execute self-ping:", e.message);
    }
  }, PING_INTERVAL_MS);

  // 2. Keep MongoDB Connection Warm
  setInterval(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        console.log("[KeepAlive] 🍃 MongoDB connection pinged successfully");
      }
    } catch (err) {
      console.warn("[KeepAlive] ⚠️ MongoDB ping warning:", err.message);
    }
  }, DB_PING_INTERVAL_MS);

  console.log("⚡ Automated Keep-Alive Service initialized (Server: 10m, DB: 5m)");
};
