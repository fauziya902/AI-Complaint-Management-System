const Complaint = require("../models/Complaint");

exports.getAnalytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    const rejected = await Complaint.countDocuments({ status: "Rejected" });

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      categoryStats,
    });
  } catch {
    res.status(500).json({ message: "Analytics Error" });
  }
};