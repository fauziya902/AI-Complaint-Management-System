import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AdminUI from "../components/admin/AdminUI";

function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // 1. Naya state Urgency filter ke liye
  const [filterUrgency, setFilterUrgency] = useState("All");
  
  const [analytics, setAnalytics] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await API.get("/complaints/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await API.get("/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics fetch failed", err);
    }
  }, [token]);

  

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, [fetchComplaints, fetchAnalytics]);

  // 2. Updated Filtering Logic
  useEffect(() => {
    let data = [...complaints];
    
    // Date Filter
    if (filterDate) {
      data = data.filter(c => new Date(c.createdAt).toISOString().split("T")[0] === filterDate);
    }
    
    // Status Filter
    if (filterStatus !== "All") {
      data = data.filter(c => c.status === filterStatus);
    }

    // Urgency Filter (Naya)
    if (filterUrgency !== "All") {
      data = data.filter(c => c.urgency === filterUrgency);
    }

    setFiltered(data);
  }, [filterDate, filterStatus, filterUrgency, complaints]);

  const handleDelete = async (id) => {
    if (!window.confirm("This action cannot be undone. Delete anyway?")) return;
    try {
      await API.delete(`/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComplaints();
      fetchAnalytics();
    } catch {
      alert("Failed to delete complaint");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComplaints();
      fetchAnalytics();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  

  return (
    <AdminUI
      complaints={filtered}
      loading={loading}
      analytics={analytics}
      filterDate={filterDate}
      filterStatus={filterStatus}
      filterUrgency={filterUrgency} // Pass kiya
      setFilterDate={setFilterDate}
      setFilterStatus={setFilterStatus}
      setFilterUrgency={setFilterUrgency} // Pass kiya
      handleDelete={handleDelete}
      handleStatusUpdate={handleStatusUpdate}
      handleLogout={handleLogout}
    />
  );
}

export default Admin;