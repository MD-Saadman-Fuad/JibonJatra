// backend/src/routes/feedRoutes.js
import express from 'express';
import { getFeed, getFilteredFeed } from '../controllers/feedController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get complete feed with all content types (Public / Optional Auth)
router.get('/', optionalAuth, getFeed);

// Get filtered feed by content type (Public / Optional Auth)
router.get('/filter/:type', optionalAuth, getFilteredFeed);

export default router;