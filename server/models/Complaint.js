const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  category: String, // Ye aapka original category field hai
  title: String,
  description: String,
  status: {
    type: String,
    default: "Pending"
  },
  image: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // --- Naye Fields Jo Humne Add Kiye Hain ---
  
  // Admin ko priority set karne mein help karega
  urgency: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  // User manually landmark ya ghar ka address likh sakega
  address: {
    type: String,
    required: false // Aap ise true bhi kar sakte hain agar zaroori ho
  },

  // Exact map location ke liye coordinates
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  },

  // Officer assignment ke liye (optional)
  assignedOfficer: {
    type: String,
    default: "Not Assigned"
  }

}, { timestamps: true }); // Isse createdAt aur updatedAt automatically mil jayenge

module.exports = mongoose.model("Complaint", complaintSchema);