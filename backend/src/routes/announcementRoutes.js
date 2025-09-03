import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementViewed,
} from "../controllers/announcementController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public – all users can view announcements
router.get("/", getAnnouncements);

// Admin only – create, update, delete
router.post("/", auth("admin"), createAnnouncement);
router.put("/:id", auth("admin"), updateAnnouncement);
router.delete("/:id", auth("admin"), deleteAnnouncement);

router.post("/:id/viewed", auth(), markAnnouncementViewed);

export default router;

