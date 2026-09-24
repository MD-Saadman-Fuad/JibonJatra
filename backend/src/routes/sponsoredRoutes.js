import express from 'express';
import {
  getSponsoredPosts,
  getAllSponsoredPosts,
  createSponsoredPost,
  updateSponsoredPost,
  deleteSponsoredPost,
  getSponsoredPost
} from '../controllers/sponsoredController.js';
import auth, { optionalAuth } from '../middleware/auth.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

// Public / Optional Auth routes for viewing sponsored posts
router.get('/', optionalAuth, getSponsoredPosts);
router.get('/:id', optionalAuth, getSponsoredPost);

// Admin routes - require admin role (unchanged)
router.get('/admin/all', auth('admin'), getAllSponsoredPosts);
router.post('/', auth('admin'), upload.single('images'), createSponsoredPost);
router.put('/:id', auth('admin'), upload.single('images'), updateSponsoredPost);
router.delete('/:id', auth('admin'), deleteSponsoredPost);

export default router;