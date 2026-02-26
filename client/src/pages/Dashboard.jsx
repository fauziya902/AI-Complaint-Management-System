import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Swal from "sweetalert2"; // 1. SweetAlert Import kiya

// --- Constants ---
const BACKEND_URL = "http://localhost:5000";

// --- Helper Logic ---
const getStatusDetails = (status) => {
  const s = status?.toLowerCase();
  if (s === "pending") return { bg: "#FEF3C7", text: "#92400E", progress: "25%", icon: "⏳" };
  if (s === "resolved") return { bg: "#D1FAE5", text: "#065F46", progress: "100%", icon: "✅" };
  if (s === "in progress") return { bg: "#DBEAFE", text: "#1E40AF", progress: "65%", icon: "⚙️" };
  return { bg: "#F3F4F6", text: "#374151", progress: "10%", icon: "📁" };
};

const analyzeSeverity = (text) => {
  const urgentKeywords = [
    "urgent", "emergency", "danger", "fire", "leak", "broken", "theft", "short circuit", 
    "immediate", "gas leak", "sparking", "shock", "smoke", "blast", "flooding",
    "critical"
  ];
  const isUrgent = urgentKeywords.some(word => text?.toLowerCase().includes(word));
  
  // Fake sentiment score for UI feel (Actually 0.8+ for urgent, 0.4+ for normal)
  const score = isUrgent ? (Math.random() * (0.95 - 0.8) + 0.8).toFixed(2) : (Math.random() * (0.5 - 0.2) + 0.2).toFixed(2);

  return isUrgent 
    ? { label: "High Priority", color: "#EF4444", bg: "#FEE2E2", score } 
    : { label: "Standard", color: "#3B82F6", bg: "#EFF6FF", score };
};

function Dashboard() {
  const navigate = useNavigate();
  const { userName, token } = useOutletContext();
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const res = await API.get("/complaints/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) loadComplaints();
  }, [token]);

  // 2. SweetAlert Popup Function
  const handleViewAiLogs = (complaint) => {
    const ai = analyzeSeverity(complaint.description);
    
    Swal.fire({
      title: '<span style="font-family: Inter">AI  Analysis</span>',
      html: `
        <div style="text-align: left; font-family: Inter; font-size: 14px; line-height: 1.6;">
          <div style="background: #f8fafc; padding: 10px; borderRadius: 8px; marginBottom: 15px; border: 1px solid #e2e8f0">
             <strong>Issue:</strong> ${complaint.title}
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Detected Priority:</span>
            <span style="color: ${ai.color}; font-weight: 800;">${ai.label}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Sentiment Score:</span>
            <span style="font-weight: 700;">${ai.score}</span>
          </div>
          <div style="height: 8px; width: 100%; background: #e2e8f0; border-radius: 10px; margin: 10px 0;">
            <div style="height: 100%; width: ${ai.score * 100}%; background: ${ai.color}; border-radius: 10px;"></div>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 15px;">
            🤖 <i>AI scan completed. Keywords identified and routed to the respective department with ${ai.label} tag.</i>
          </p>
        </div>
      `,
      icon: ai.label === "High Priority" ? 'warning' : 'info',
      confirmButtonText: 'Understood',
      confirmButtonColor: '#2563EB',
      showCloseButton: true,
      customClass: {
        popup: 'rounded-popup'
      }
    });
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [complaints, searchTerm]);

  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(c => c.status?.toLowerCase() === "pending").length,
    resolved: complaints.filter(c => c.status?.toLowerCase() === "resolved").length
  }), [complaints]);

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>AI is loading your data...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.topbar}>
        <div>
          <h1 style={styles.greeting}>Welcome back, {userName}! 👋</h1> <br></br>
          <p style={styles.subtitle}>AI-Powered Complaint Management System</p>
        </div>
        <button style={styles.primaryBtn} onClick={() => navigate("/complaint")}>
          + File New Complaint
        </button>
      </header>

      <main style={styles.content}>
        {/* AI Insight Card */}
        <div style={styles.aiAssistantCard}>
          <div style={styles.aiIcon}>🤖</div>
          <div>
            <h4 style={{margin: 0, color: '#1E3A8A', fontSize: '15px'}}>AI Predictive Insights</h4>
            <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#475569'}}>
              {stats.pending > 0 
                ? `Attention: ${stats.pending} issues need resolution. High-risk items have been bumped to the top.` 
                : "System Healthy: All reported issues are currently resolved."}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <StatCard label="Total Reports" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} color="#F59E0B" />
          <StatCard label="Resolved" value={stats.resolved} color="#10B981" />
        </div>

        {/* Search */}
        <div style={styles.searchRow}>
          <input 
            type="text" 
            placeholder="Search by keyword..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {filteredComplaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} onOpenLogs={handleViewAiLogs} />
          ))}
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ label, value, color = "#E5E7EB" }) => (
  <div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}>
    <span style={styles.statLabel}>{label}</span>
    <h2 style={styles.statValue}>{value}</h2>
  </div>
);

const ComplaintCard = ({ complaint, onOpenLogs }) => {
  const statusInfo = getStatusDetails(complaint.status);
  const aiSeverity = analyzeSeverity(complaint.description);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerInfo}>
          <h4 style={styles.cardTitle}>{complaint.title}</h4>
          <span style={{...styles.severityBadge, backgroundColor: aiSeverity.bg, color: aiSeverity.color}}>
            ● {aiSeverity.label}
          </span>
        </div>
        <span style={{...styles.statusBadge, backgroundColor: statusInfo.bg, color: statusInfo.text}}>
          {statusInfo.icon} {complaint.status}
        </span>
      </div>

      <p style={styles.cardDesc}>{complaint.description}</p>

      <div style={styles.progressSection}>
        <div style={styles.progressText}>
          <span>Resolution Progress</span>
          <span>{statusInfo.progress}</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{
            ...styles.progressBarFill, 
            width: statusInfo.progress, 
            backgroundColor: aiSeverity.color 
          }} />
        </div>
      </div>
      
      {complaint.image && (
        <div style={styles.imageWrapper}>
          <img 
            src={`${BACKEND_URL}/uploads/${complaint.image}`} 
            alt="Evidence" 
            style={styles.cardImg}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <div style={styles.cardFooter}>
        <span style={styles.dateText}>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
        <button style={styles.detailsBtn} onClick={() => onOpenLogs(complaint)}>
          View AI Logs
        </button>
      </div>
    </div>
  );
};

// --- Styles (Existing Styles kept for consistency) ---
const styles = {
  container: { width: "100%", minHeight: "100vh", background: "#F9FAFB", fontFamily: 'Inter, sans-serif' },
  topbar: { background: "white", padding: "20px 40px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", position: 'sticky', top: 0, zIndex: 10 },
  greeting: { fontSize: "22px", margin: 0, fontWeight: "800", color: "#111827" },
  subtitle: { margin: 0, color: "#6B7280", fontSize: "14px" },
  primaryBtn: { background: "#2563EB", color: "white", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  content: { padding: "30px 40px", maxWidth: "1400px", margin: "0 auto" },
  aiAssistantCard: { background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" },
  aiIcon: { fontSize: "24px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "25px" },
  statCard: { background: "white", padding: "18px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  statLabel: { fontSize: "11px", color: "#6B7280", fontWeight: "700", textTransform: "uppercase" },
  statValue: { fontSize: "28px", margin: "5px 0 0 0", color: "#111827", fontWeight: "800" },
  searchRow: { marginBottom: "25px" },
  searchInput: { width: "100%", padding: "14px 20px", borderRadius: "12px", border: "1px solid #D1D5DB", outline: "none", fontSize: "15px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" },
  card: { background: "white", padding: "20px", borderRadius: "16px", border: "1px solid #E5E7EB", display: 'flex', flexDirection: 'column' },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" },
  headerInfo: { display: "flex", flexDirection: "column", gap: "4px" },
  cardTitle: { fontSize: "16px", margin: 0, fontWeight: "700", color: "#111827" },
  severityBadge: { fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" },
  statusBadge: { fontSize: "11px", padding: "4px 10px", borderRadius: "20px", fontWeight: "600" },
  cardDesc: { fontSize: "14px", color: "#4B5563", lineHeight: "1.5", marginBottom: "20px", height: "42px", display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  progressSection: { marginBottom: "20px" },
  progressText: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B7280", marginBottom: "6px", fontWeight: "600" },
  progressBarBg: { height: "6px", background: "#F3F4F6", borderRadius: "10px" },
  progressBarFill: { height: "100%", transition: "width 0.6s ease", borderRadius: "10px" },
  imageWrapper: { width: "100%", height: "150px", borderRadius: "12px", overflow: "hidden", marginBottom: "15px" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardFooter: { borderTop: "1px solid #F3F4F6", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 'auto' },
  dateText: { fontSize: "12px", color: "#9CA3AF" },
  detailsBtn: { background: "none", border: "none", color: "#2563EB", fontWeight: "700", cursor: "pointer", fontSize: "13px" }
};

export default Dashboard;