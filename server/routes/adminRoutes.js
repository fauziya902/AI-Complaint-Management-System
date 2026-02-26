const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const { getAnalytics } = require("../controllers/adminController");


router.get("/analytics", auth, roleCheck("admin"), getAnalytics);

module.exports = router;