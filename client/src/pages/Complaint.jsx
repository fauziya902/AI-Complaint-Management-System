import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function Complaint() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    title: "",
    description: "",
    urgency: "Medium", // Default urgency
    address: "",      // Manual address/landmark
    latitude: null,
    longitude: null
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Detecting...");
  const navigate = useNavigate();

  // Component load hote hi location fetch karein
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationStatus("Location Captured ✅");
        },
        (error) => {
          console.error("Error getting location", error);
          setLocationStatus("Location Permission Denied ❌");
        }
      );
    } else {
      setLocationStatus("Geolocation not supported");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // FormData me saara data append karna
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      await API.post("/complaints", data, {
        headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });

      Swal.fire({
        title: "Complaint Registered!",
        text: "Your issue has been logged with location data.",
        icon: "success",
        confirmButtonColor: "#2563EB",
      }).then(() => {
        navigate("/dashboard");
      });

    } catch  {
      Swal.fire({
        title: "Error!",
        text: "Could not submit. Please check your connection.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formPage}>
      <div style={styles.formContainer}>
        <div style={styles.banner}>
          <h2 style={styles.bannerTitle}>Submit a Complaint</h2>
          <p style={styles.bannerText}>
            Provide details below. Exact location is captured for faster resolution.
          </p>
          <div style={styles.locationBadge}>{locationStatus}</div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name</label>
              <input style={styles.input} name="firstName" placeholder="John" onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input style={styles.input} name="lastName" placeholder="Doe" onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} type="email" name="email" placeholder="email@example.com" onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Urgency Level</label>
              <select style={styles.input} name="urgency" onChange={handleChange} value={formData.urgency}>
                <option value="Low">Low (Routine)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="High">High (Immediate Action)</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Reason for Complaint</label>
            <select style={styles.input} name="reason" onChange={handleChange} required>
              <option value="">Choose your reason</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Other">Other</option>
            </select> 
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Exact Address / Landmark</label>
            <input 
              style={styles.input} 
              name="address" 
              placeholder="e.g. Near City Park, Street No. 4" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Subject Title</label>
            <input style={styles.input} name="title" placeholder="Brief subject" onChange={handleChange} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Detailed Description</label>
            <textarea style={styles.textarea} name="description" placeholder="Describe the issue in detail..." onChange={handleChange} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Upload Evidence (Photo)</label>
            <input 
               type="file" 
               accept="image/*" 
               onChange={(e) => setImage(e.target.files[0])} 
               style={{fontSize: '14px'}}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Submitting..." : "Post Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  formPage: { padding: "40px", backgroundColor: "#f3f4f6", minHeight: "100vh" },
  formContainer: { maxWidth: "800px", margin: "0 auto", background: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflow: "hidden" },
  banner: { background: "#ffffff", padding: "30px", textAlign: "center", borderBottom: "1px solid #E5E7EB" },
  bannerTitle: { fontSize: "28px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" },
  bannerText: { fontSize: "15px", color: "#6B7280", margin: 0 },
  locationBadge: { display: "inline-block", marginTop: "12px", padding: "6px 12px", background: "#EFF6FF", color: "#2563EB", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  form: { padding: "40px" },
  row: { display: "flex", gap: "20px", marginBottom: "15px" },
  inputGroup: { flex: 1, marginBottom: "20px", display: "flex", flexDirection: "column" },
  label: { fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#374151" },
  input: { padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px", outlineColor: "#2563EB" },
  textarea: { padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px", minHeight: "120px" },
  submitBtn: { width: "100%", padding: "14px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "600", transition: "0.3s" }
};

export default Complaint;