import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#020617";
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.gridOverlay}></div>
      <div style={styles.blobLeft}></div>
      <div style={styles.blobRight}></div>

      {/* --- NAVBAR --- */}
      <nav style={{...styles.nav, backgroundColor: scrolled ? "rgba(2, 6, 23, 0.9)" : "transparent"}}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🛠️</span> AI Complaint System
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate("/login")} style={styles.ghostBtn}>Login</button>
          <button onClick={() => navigate("/register")} style={styles.navActionBtn}>Register</button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section style={styles.hero}>
        <div style={styles.badge}>AI-POWERED GRIEVANCE PLATFORM</div>
        <h1 style={styles.heroTitle}>
           Tired of Ignored <br />
          <span style={styles.gradientText}> Complaints</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Submit, track, and resolve complaints through an intelligent AI-powered system.
          Our platform automatically categorizes issues, assigns priority levels,
          and routes them to the appropriate authority for faster resolution.
        </p>
        
        <div style={styles.btnGroup}>
          <button style={styles.primaryBtn} onClick={() => navigate("/register")}>Submit Complaint</button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>Track Complaint</button>
        </div>

        <div style={styles.trustLine}>
          AI • PRIORITIZED • TRACKABLE • TRANSPARENT
        </div>
      </section>

      {/* --- PROBLEM VS SOLUTION --- */}
      <section style={styles.section}>
        <div style={styles.comparisonGrid}>
          <div style={styles.comparisonCard}>
            <h3 style={{color: '#f43f5e', marginBottom: '20px'}}>Traditional Complaint Handling</h3>
            <ul style={styles.list}>
              <li>❌ Manual complaint registration</li>
              <li>❌ No priority detection</li>
              <li>❌ Delayed forwarding to departments</li>
              <li>❌ No proper tracking system</li>
            </ul>
          </div>
          <div style={styles.solutionCard}>
            <h3 style={{color: '#818cf8', marginBottom: '20px'}}>AI-Based Complaint System</h3>
            <ul style={styles.list}>
              <li>✅ AI-based complaint categorization</li>
              <li>✅ Automatic priority detection (High/Normal)</li>
              <li>✅ Smart routing to correct authority</li>
              <li>✅ Real-time complaint status tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- KEY BENEFITS --- */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Core Features of the Platform</h2>
        <div style={styles.benefitGrid}>
          <Benefit icon="📝" title="Quick Complaint Submission" desc="Easily submit complaints with detailed description and image upload support." />
          <Benefit icon="🤖" title="AI Categorization" desc="System automatically detects category, sentiment, and urgency level." />
          <Benefit icon="⚡" title="Priority Detection" desc="High-priority complaints are highlighted for immediate attention." />
          <Benefit icon="📊" title="Admin Dashboard" desc="Admins can monitor, filter, update, and manage all complaints efficiently." />
          <Benefit icon="🔄" title="Real-Time Tracking" desc="Users can track complaint progress from submission to resolution." />
          <Benefit icon="🔐" title="Secure Authentication" desc="JWT-based secure login system with role-based access control." />
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How the AI Complaint System Works</h2>
        <div style={styles.stepContainer}>
          <div style={styles.stepCard}>
            <div style={styles.stepNum}>1</div>
            <h4>Submit Complaint</h4>
            <p>User submits complaint with details and optional image.</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNum}>2</div>
            <h4>AI Analysis</h4>
            <p>System analyzes text, detects category & priority automatically.</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNum}>3</div>
            <h4>Resolve & Update</h4>
            <p>Admin updates status and user tracks resolution in real-time.</p>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section style={styles.finalCta}>
        <div style={styles.ctaCard}>
          <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>
            Experience Intelligent Complaint Management
          </h2>
          <button style={styles.primaryBtn} onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </section>

      <footer style={styles.footer}>
        © 2026 AI Complaint Management System. Powered by SmartResolve AI.
      </footer>
    </div>
  );
};

// --- COMPONENTS ---
const Benefit = ({ icon, title, desc }) => (
  <div style={styles.glassCard}>
    <div style={{fontSize: '2.5rem', marginBottom: '15px'}}>{icon}</div>
    <h4 style={{fontSize: '1.2rem', marginBottom: '10px'}}>{title}</h4>
    <p style={{color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5'}}>{desc}</p>
  </div>
);

// --- STYLES ---
const styles = {
  
  container: { backgroundColor: "#020617", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif", overflowX: "hidden", position: "relative" },
  gridOverlay: { position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`, backgroundSize: "40px 40px", zIndex: 0 },
  blobLeft: { position: "fixed", top: "-10%", left: "-10%", width: "500px", height: "500px", background: "rgba(99, 102, 241, 0.1)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 },
  blobRight: { position: "fixed", bottom: "10%", right: "-5%", width: "400px", height: "400px", background: "rgba(168, 85, 247, 0.1)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 },
  nav: { position: "fixed", top: 0, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 8%", boxSizing: "border-box", zIndex: 100, backdropFilter: "blur(10px)" },
  logo: { fontSize: "1.5rem", fontWeight: "800", display: 'flex', alignItems: 'center', gap: '10px' },
  navActionBtn: { backgroundColor: "#6366f1", color: "#fff", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer" },
  ghostBtn: { background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", marginRight: "20px", fontWeight: "500" },
  hero: { padding: "160px 10% 80px 10%", textAlign: "center", position: "relative", zIndex: 1 },
  badge: { background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", padding: "6px 16px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "700", display: "inline-block", marginBottom: "20px" },
  heroTitle: { fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: "800", lineHeight: "1.1", marginBottom: "20px" },
  gradientText: { background: "linear-gradient(90deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSubtitle: { fontSize: "1.2rem", color: "#94a3b8", maxWidth: "700px", margin: "0 auto 40px auto", lineHeight: "1.6" },
  btnGroup: { display: "flex", gap: "15px", justifyContent: "center", flexWrap: 'wrap' },
  primaryBtn: { background: "#6366f1", color: "#fff", padding: "16px 32px", borderRadius: "12px", fontWeight: "600", border: "none", cursor: "pointer", boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)" },
  secondaryBtn: { background: "rgba(255,255,255,0.05)", color: "#fff", padding: "16px 32px", borderRadius: "12px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" },
  trustLine: { marginTop: '40px', fontSize: '0.8rem', color: '#475569', letterSpacing: '2px', fontWeight: 'bold' },
  section: { padding: "80px 10%", position: "relative", zIndex: 1 },
  sectionTitle: { fontSize: "2.2rem", textAlign: "center", marginBottom: "50px", fontWeight: "800" },
  comparisonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' },
  comparisonCard: { padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' },
  solutionCard: { padding: '40px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.2)' },
  list: { listStyle: 'none', padding: 0, lineHeight: '2.5', fontSize: '1rem' },
  benefitGrid: { 
    display: 'grid', 
    // Isse ek row mein maximum 4 cards aayenge
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))', 
    gap: '25px',
    // Isse last row ke 2 cards center mein aa jayenge
    justifyContent: 'center', 
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto'
  },

  glassCard: { 
    background: "rgba(255, 255, 255, 0.03)", 
    padding: "35px", 
    borderRadius: "24px", 
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    transition: "transform 0.3s ease, border 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Text ko card ke andar center karne ke liye
    textAlign: "center"   // Description text center karne ke liye
  },
  stepContainer: { display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' },
  stepCard: { flex: '1', minWidth: '250px', textAlign: 'center', padding: '20px' },
  stepNum: { width: '50px', height: '50px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '1.5rem', fontWeight: 'bold' },
  finalCta: { padding: '80px 10%', textAlign: 'center' },
  ctaCard: { background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', padding: '60px', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.1)' },
  footer: { textAlign: 'center', padding: '40px', color: '#475569', fontSize: '0.9rem' }
};

export default Home;