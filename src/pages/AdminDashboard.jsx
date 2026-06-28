import { adminPatients } from "../data/mockData";

function adherenceBadge(pct) {
  if (pct >= 85) return <span className="badge badge-green">{pct}%</span>;
  if (pct >= 60) return <span className="badge badge-amber">{pct}%</span>;
  return <span className="badge badge-red">{pct}%</span>;
}

function initials(name) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase();
}

export default function AdminDashboard() {
  const avg = Math.round(adminPatients.reduce((s, p) => s + p.adh, 0) / adminPatients.length);
  const atRisk = adminPatients.filter(p => p.adh < 60).length;
  const totalMeds = adminPatients.reduce((s, p) => s + p.meds, 0);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Clinic Administration</h1>
          <p>Sunrise Medical Clinic</p>
        </div>
        <div className="topbar-actions">
          <button className="btn">
            <i className="ti ti-file-report" aria-hidden="true" /> Generate report
          </button>
          <button className="btn btn-primary">
            <i className="ti ti-plus" aria-hidden="true" /> Add patient
          </button>
        </div>
      </div>

      <div className="content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total patients</div>
            <div className="stat-val">{adminPatients.length}</div>
            <div className="stat-sub good">+3 this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg adherence</div>
            <div className="stat-val">{avg}%</div>
            <div className="stat-sub warn">Below 85% target</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">At-risk patients</div>
            <div className="stat-val" style={{ color: "#E24B4A" }}>{atRisk}</div>
            <div className="stat-sub bad">Adherence &lt; 60%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active prescriptions</div>
            <div className="stat-val">{totalMeds}</div>
            <div className="stat-sub good">Across {adminPatients.length} patients</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Patient adherence overview</span>
            <button className="btn btn-sm">Filter at-risk</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Medications</th>
                <th>Caregiver</th>
                <th>Last visit</th>
                <th>Adherence</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {adminPatients.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        className="avatar"
                        style={{ width: 28, height: 28, background: "#f3f4f6", color: "#6b7280", fontSize: 10, fontWeight: 700 }}
                      >
                        {initials(p.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.age}</td>
                  <td>{p.meds}</td>
                  <td style={{ color: p.caregiver === "—" ? "#9ca3af" : "#374151" }}>{p.caregiver}</td>
                  <td>{p.lastVisit}</td>
                  <td>{adherenceBadge(p.adh)}</td>
                  <td><button className="btn btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
