const Complaint = require("../models/Complaint");

// ================= CREATE =================
exports.createComplaint = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      category,
      title,
      description,
      // Naye fields destructure kiye
      urgency,
      address,
      latitude,
      longitude
    } = req.body;

    const complaint = await Complaint.create({
      firstName,
      lastName,
      email,
      phone,
      category,
      title,
      description,
      // Naye data ko save kiya
      urgency: urgency || "Medium", 
      address: address || "",
      location: {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      },
      image: req.file ? req.file.filename : null,
      userId: req.user.id
    });

    res.status(201).json(complaint);

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Error creating complaint", error: error.message });
  }
};

// ================= USER - MY =================
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// ================= ADMIN - ALL =================
exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    // Admin ke liye list fetch karte waqt saare fields milenge
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch {
    res.status(500).json({ message: "Error fetching all complaints" });
  }
};

// ================= ADMIN - UPDATE STATUS =================
exports.updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedComplaint);

  } catch {
    res.status(500).json({ message: "Error updating complaint status" });
  }
};

// ================= ADMIN - DELETE =================
exports.deleteComplaint = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint deleted successfully" });

  } catch {
    res.status(500).json({ message: "Error deleting complaint" });
  }
};