const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint
} = require("../controllers/complaintController");

// Create Complaint
router.post("/", auth, upload.single("image"), createComplaint);

// User - View Own Complaints
router.get("/my", auth, getMyComplaints);

// Admin - View All Complaints
router.get("/all", auth, getAllComplaints);

// 🔥 Admin - Update Status
router.put("/:id", auth, updateComplaintStatus);

// 🔥 Admin - Delete Complaint
router.delete("/:id", auth, deleteComplaint);

module.exports = router;