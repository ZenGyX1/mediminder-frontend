import { useState } from "react";
import { prescriptions, medications } from "../data/mockData";

const getMedName = (medId) => medications.find(m => m.id === medId)?.name ?? "Unknown";

export default function MedicationsPage() {
  const [items, setItems] = useState(prescriptions);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ medId: 1, dose: "", frequency: "Once daily", times: ["8:00 AM"], startDate: "", endDate: "", notes: "" });

  function handleAdd(e) {
    e.preventDefault();
    const newItem = { id: Date.now(), ...form, medId: Number(form.medId), stock: 30 };
    setItems(prev => [...prev, newItem]);
    setShowModal(false);
  }

  function handleDelete(id) {
    setItems(prev => prev.filter(p => p.id !== id));
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>My Medications</h1>
          <p>{items.length} active prescriptions</p>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="ti ti-plus" aria-hidden="true" /> Add prescription
          </button>
        </div>
      </div>

      <div className="content">
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dose</th>
                <th>Frequency</th>
                <th>Times</th>
                <th>Stock</th>
                <th>Period</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{getMedName(p.medId)}</div>
                  </td>
                  <td>{p.dose}</td>
                  <td>{p.frequency}</td>
                  <td>{p.times.join(", ")}</td>
                  <td>
                    <span className={`badge ${p.stock <= 7 ? "badge-red" : "badge-green"}`}>
                      {p.stock} days
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "#6b7280" }}>{p.startDate} → {p.endDate}</td>
                  <td style={{ fontSize: 12, color: "#6b7280", maxWidth: 120 }}>{p.notes || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-sm">
                        <i className="ti ti-edit" aria-hidden="true" />
                      </button>
                      <button className="btn btn-sm" style={{ color: "#E24B4A" }} onClick={() => handleDelete(p.id)}>
                        <i className="ti ti-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add prescription modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add prescription</div>
              <button className="btn btn-sm" onClick={() => setShowModal(false)}>
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Medication</label>
                  <select className="form-input" value={form.medId} onChange={e => setForm(f => ({ ...f, medId: e.target.value }))}>
                    {medications.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.strength})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Dose</label>
                    <input className="form-input" placeholder="e.g. 500mg" value={form.dose}
                      onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <select className="form-input" value={form.frequency}
                      onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                      {["Once daily","Twice daily","Three times daily","As needed"].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Start date</label>
                    <input className="form-input" type="date" value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End date</label>
                    <input className="form-input" type="date" value={form.endDate}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <input className="form-input" placeholder="e.g. Take with food" value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
