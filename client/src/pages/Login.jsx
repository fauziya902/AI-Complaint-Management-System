import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion
import API from "../services/api";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={styles.blob1} 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={styles.blob2} 
      />

      {/* Main Login Card with Entry Animation */}
      <motion.form 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onSubmit={handleLogin} 
        style={styles.glassCard}
      >
        <div style={styles.headerGroup}>
          <h2 style={styles.heading}> Login </h2>
          <p style={styles.subheading}>Securely access the AI Complaint System</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.errorBox}
          >
            {error}
          </motion.div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={isLoading}
          style={{
            ...styles.button,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </motion.button>
        
        <p style={styles.footerText}>
          System authorized access only.
        </p>
      </motion.form>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0f1a", // Deep dark background
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  },
  blob1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(37,99,235,0) 70%)",
    borderRadius: "50%",
    top: "-50px",
    left: "-50px",
    zIndex: 0,
  },
  blob2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(124,58,237,0) 70%)",
    borderRadius: "50%",
    bottom: "-100px",
    right: "-50px",
    zIndex: 0,
  },
  glassCard: {
    width: "400px",
    padding: "48px",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    zIndex: 1,
  },
  headerGroup: { textAlign: "center" },
  heading: {
    margin: "0 0 8px 0",
    fontSize: "32px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "-1px",
  },
  subheading: { margin: 0, fontSize: "14px", color: "#94a3b8" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", color: "#94a3b8", fontWeight: "500", marginLeft: "4px" },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.3s ease",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
  },
  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    textAlign: "center",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  footerText: { fontSize: "12px", color: "#475569", textAlign: "center", marginTop: "10px" },
};

export default Login;