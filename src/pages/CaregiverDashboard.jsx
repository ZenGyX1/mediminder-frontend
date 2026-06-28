import { caregiverPatients } from "../data/mockData";

const STATUS = {
  good: { icon: "ti-circle-check", color: "#1D9E75", bg: "#E1F5EE", tc: "#085041" },
  warn: { icon: "ti-alert-triangle", color: "#EF9F27", bg: "#FAEEDA", tc: "#633806" },
  risk: { icon: "ti-alert-circle",   color: "#E24B4A", bg: "#FCEBEB", tc: "#501313" },
};

function initials(name) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase();
}

export default function CaregiverDashboard() {
  return (
    <>
      <div className="topbar">
        <div>
          <h1>Caregiver Dashboard</h1>
          <p>Monitoring {caregiverPatients.length} patients</p>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary">
            <i className="ti ti-user-plus" aria-hidden="true" /> Link patient
          </button>
        </div>
      </div>

      <div className="content">
        <div className="stats-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          <div className="stat-card">
            <div className="stat-label">Total patients</div>
            <div className="stat-val">{caregiverPatients.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg adherence</div>
            <div className="stat-val">
              {Math.round(caregiverPatients.reduce((s,p) => s + p.adh30, 0) / caregiverPatients.length)}%
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Needs attention</div>
            <div className="stat-val" style={{ color: "#E24B4A" }}>
              {caregiverPatients.filter(p => p.status !== "good").length}
            </div>
          </div>
        </div>

        <div className="gap-col">
          {caregiverPatients.map(p => {
            const s = STATUS[p.status];
            return (
              <div className="card" key={p.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
                  <div
                    className="avatar"
                    style={{ width: 44, height: 44, background: s.bg, color: s.tc, fontSize: 13 }}
                  >
                    {initials(p.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Age {p.age} · {p.meds} medications · Last dose: {p.lastDose}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{p.adh30}%</div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>30-day adherence</div>
                  </div>
                  <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: s.color }} aria-hidden="true" />
                </div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 16px",
                  borderTop: "1px solid #e8eaed",
                  background: "#f9fafb",
                }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    <i className="ti ti-clock" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} aria-hidden="true" />
                    Next: {p.nextDose}
                  </span>
                  <button className="btn btn-sm">Details</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
