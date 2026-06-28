import { useState } from "react";

const defaultReminders = [
  { id: 1, med: "Metformin",     time: "7:00 AM",  channels: ["in-app", "push"], enabled: true  },
  { id: 2, med: "Amlodipine",   time: "8:00 AM",  channels: ["in-app"],         enabled: true  },
  { id: 3, med: "Lisinopril",   time: "12:00 PM", channels: ["in-app", "push"], enabled: true  },
  { id: 4, med: "Atorvastatin", time: "9:00 PM",  channels: ["in-app"],         enabled: false },
];

export default function RemindersPage() {
  const [items, setItems] = useState(defaultReminders);

  function toggle(id) {
    setItems(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Reminders</h1>
          <p>Manage your medication alerts</p>
        </div>
      </div>

      <div className="content">
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><span className="card-title">Medication reminders</span></div>
          <div className="card-body">
            {items.map(r => (
              <div key={r.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 0", borderBottom: "1px solid #f3f4f6",
                opacity: r.enabled ? 1 : 0.5,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{r.med}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Daily at {r.time} · {r.channels.join(", ")}
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{r.enabled ? "On" : "Off"}</span>
                  <div
                    onClick={() => toggle(r.id)}
                    style={{
                      width: 40, height: 22, borderRadius: 11,
                      background: r.enabled ? "#1D9E75" : "#d1d5db",
                      position: "relative", cursor: "pointer", transition: "background .2s",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 3, left: r.enabled ? 21 : 3,
                      width: 16, height: 16, borderRadius: "50%", background: "#fff",
                      transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                    }} />
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Refill reminders</span></div>
          <div className="card-body">
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>
              Alert me when stock drops below:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="range" min={3} max={14} defaultValue={7} style={{ flex: 1 }} />
              <span style={{ fontSize: 14, fontWeight: 600, minWidth: 60 }}>7 days</span>
            </div>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              You currently have 1 medication below this threshold: Metformin (5 days).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
