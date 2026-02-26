import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  let userName = "User";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.name;
    } catch { console.log("Invalid token"); }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar - Always Visible */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>AI</div>
          <h2 style={styles.logoText}>CMS Pro</h2>
        </div>
        
        <nav style={styles.navGroup}>
          <button 
            style={location.pathname === "/dashboard" ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button 
            style={location.pathname === "/complaint" ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => navigate("/complaint")}
          >
            Write Complaint
          </button>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content Area - This changes based on Route */}
      <main style={styles.main}>
        <Outlet context={{ userName, token }} />
      </main>
    </div>
  );
}

// Copy the styles from your Dashboard.jsx here
const styles = {
  layout: { display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", color: "#1F2937" },
  sidebar: { width: "260px", background: "#111827", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column" },
  logoArea: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", paddingLeft: "10px" },
  logoIcon: { background: "#3B82F6", padding: "8px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px" },
  logoText: { fontSize: "20px", fontWeight: "700", margin: 0, letterSpacing: "-0.5px" },
  navGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  navBtn: { background: "transparent", color: "#9CA3AF", border: "none", padding: "12px 15px", textAlign: "left", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
  activeNavBtn: { background: "#1F2937", color: "white", border: "none", padding: "12px 15px", textAlign: "left", borderRadius: "8px", fontWeight: "600" },
  logoutBtn: { background: "rgba(239, 68, 68, 0.1)", color: "#F87171", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "10px", borderRadius: "8px", cursor: "pointer" },
  main: { flex: 1, background: "#F9FAFB", overflowY: "auto" },
};

export default UserLayout;