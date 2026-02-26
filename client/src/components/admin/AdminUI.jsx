import styles from "./Admin.module.css";
import { 
  FiLogOut, FiBarChart2, FiInbox, 
  FiCheckCircle, FiClock, FiXCircle, FiTrash2, FiActivity, FiMapPin 
} from "react-icons/fi";

function AdminUI({
  complaints, loading, analytics, filterDate, filterStatus,
  setFilterDate, setFilterStatus, handleDelete, handleStatusUpdate, handleLogout,
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <FiClock />;
      case "In Progress": return <FiActivity />;
      case "Resolved": return <FiCheckCircle />;
      case "Rejected": return <FiXCircle />;
      default: return null;
    }
  };

  // Google Maps par location kholne ke liye function
  const openMap = (lat, lng, address) => {
    const url = lat && lng 
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>A</div>
            <span>AI Admin</span>
          </div>
          <nav className={styles.menu}>
            <button className={`${styles.menuItem} ${styles.active}`}>
              <FiInbox /> Dashboard
            </button>
          </nav>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FiLogOut /> Logout
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.heading}>Management Console</h1>
            <p className={styles.subheading}>Real-time overview of public grievances</p>
          </div>
          
          <div className={styles.filterBar}>
            <input
              type="date"
              className={styles.dateInput}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <select
              className={styles.selectInput}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </header>

        {analytics && (
          <div className={styles.statsGrid}>
            <StatCard label="Total Complaints" value={analytics.total} type="total" icon={<FiInbox />} />
            <StatCard label="Pending" value={analytics.pending} type="pending" icon={<FiClock />} />
            <StatCard label="In Progress" value={analytics.inProgress} type="progress" icon={<FiActivity />} />
            <StatCard label="Resolved" value={analytics.resolved} type="resolved" icon={<FiCheckCircle />} />
          </div>
        )}

        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Fetching data...</p>
          </div>
        ) : (
          <div className={styles.complaintGrid}>
            {complaints.length > 0 ? (
              complaints.map((item) => (
                <div key={item._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={`${styles.badge} ${styles[item.status.replace(/\s+/g, '')]}`}>
                      {getStatusIcon(item.status)} {item.status}
                    </span>
                    <button onClick={() => handleDelete(item._id)} className={styles.iconDelete} title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>

                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.author}>{item.firstName} {item.lastName} <span className={styles.dot}>•</span> <span className={styles.email}>{item.email}</span></p>
                  
                  {/* Location Section Added Here */}
                  <div className={styles.locationBox} onClick={() => openMap(item.latitude, item.longitude, item.address)}>
                    <FiMapPin className={styles.locIcon} />
                    <span>{item.address || "View Location on Map"}</span>
                  </div>

                  <p className={styles.description}>{item.description}</p>

                  {item.image && (
                    <div className={styles.imageContainer}>
                      <img src={`http://localhost:5000/uploads/${item.image}`} alt="Proof" />
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    <button onClick={() => handleStatusUpdate(item._id, "In Progress")} className={styles.btnProgress}>Update Progress</button>
                    <button onClick={() => handleStatusUpdate(item._id, "Resolved")} className={styles.btnResolve}>Mark Resolved</button>
                    <button onClick={() => handleStatusUpdate(item._id, "Rejected")} className={styles.btnReject}>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData}>No complaints found for this selection.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const StatCard = ({ label, value, type, icon }) => (
  <div className={`${styles.statCard} ${styles[type]}`}>
    <div className={styles.statInfo}>
      <h4>{label}</h4>
      <p>{value}</p>
    </div>
    <div className={styles.statIcon}>{icon}</div>
  </div>
);

export default AdminUI;