export default function Sidebar({ role, page, navigate }) {
  const isPatient   = role === "patient";
  const isCaregiver = role === "caregiver";
  const isAdmin     = role === "admin";

  const navItem = (key, icon, label, badge) => {
    const isActive = isPatient && page === key;
    return (
      <div
        className={`nav-item ${isActive ? "active" : ""}`}
        onClick={() => navigate(key)}
        role="button"
        tabIndex={0}
      >
        <i className={`ti ti-${icon}`} aria-hidden="true" />
        {label}
        {badge ? <span className="badge badge-notif">{badge}</span> : null}
      </div>
    );
  };

  const roleItem = (key, icon, label) => (
    <div
      className={`nav-item ${role === key ? "active" : ""}`}
      onClick={() => navigate(key)}
      role="button"
      tabIndex={0}
    >
      <i className={`ti ti-${icon}`} aria-hidden="true" />
      {label}
    </div>
  );

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <i className="ti ti-pill" aria-hidden="true" />
          </div>
          <div>
            <div className="logo-text">MediMinder</div>
            <div className="logo-sub">Medication Companion</div>
          </div>
        </div>
        <div className={`role-badge role-badge-${role}`}>
          {role === "patient" && "Patient"}
          {role === "caregiver" && "Caregiver"}
          {role === "admin" && "Clinic Admin"}
        </div>
      </div>

      {/* Nav */}
      <nav className="nav">
        {isPatient && (
          <>
            <div className="nav-section">Overview</div>
            {navItem("today",     "calendar-check", "Today's Schedule")}
            {navItem("meds",      "pill",           "My Medications")}
            {navItem("adherence", "chart-line",     "Adherence Report")}
            <div className="nav-section">Settings</div>
            {navItem("reminders", "bell",           "Reminders", 2)}
          </>
        )}
        {isCaregiver && (
          <>
            <div className="nav-section">Patients</div>
            {navItem("today", "users", "My Patients")}
          </>
        )}
        {isAdmin && (
          <>
            <div className="nav-section">Clinic</div>
            {navItem("today", "building-hospital", "Patient Overview")}
          </>
        )}

        <div className="nav-section">Switch role</div>
        {roleItem("patient",   "user",              "Patient view")}
        {roleItem("caregiver", "nurse",             "Caregiver view")}
        {roleItem("admin",     "stethoscope",       "Admin view")}
      </nav>

      {/* User info */}
      <div className="sidebar-user">
        <div className="avatar" style={{ width: 32, height: 32, background: "#E1F5EE", color: "#085041", fontSize: 11 }}>
          LC
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Lee Chen</div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>P-2847</div>
        </div>
      </div>
    </aside>
  );
}
