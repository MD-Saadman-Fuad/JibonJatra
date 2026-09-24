// Standalone Ping Script to keep backend and MongoDB live
import https from 'https';
import http from 'http';

const TARGET_URL = process.env.TARGET_URL || process.argv[2] || 'https://jibonjatra.onrender.com';
const INTERVAL_MINUTES = parseInt(process.env.INTERVAL_MINUTES || '10', 10);

console.log(`🚀 Starting JibonJatra Standalone Ping Script...`);
console.log(`🎯 Target: ${TARGET_URL}`);
console.log(`⏱️ Interval: Every ${INTERVAL_MINUTES} minutes`);

const pingServer = () => {
  const time = new Date().toISOString();
  const client = TARGET_URL.startsWith('https') ? https : http;

  console.log(`[${time}] Sending keep-alive request to ${TARGET_URL}...`);

  const req = client.get(TARGET_URL, (res) => {
    console.log(`[${time}] ✅ Response Received! Status Code: ${res.statusCode}`);
  });

  req.on('error', (err) => {
    console.error(`[${time}] ❌ Ping Failed:`, err.message);
  });

  req.setTimeout(10000, () => {
    console.warn(`[${time}] ⚠️ Request timed out`);
    req.destroy();
  });
};

// Execute initial ping
pingServer();

// Schedule recurring pings
setInterval(pingServer, INTERVAL_MINUTES * 60 * 1000);
