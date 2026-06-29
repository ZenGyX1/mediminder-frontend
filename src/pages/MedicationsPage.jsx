import { useState, useEffect } from "react";
// 删除了 mockData 里的 prescriptions（以后全靠云端真实数据），保留 medications 供表单下拉框选择
import { medications } from "../data/mockData";

const getMedName = (medId) => medications.find(m => m.id === Number(medId))?.name ?? "Unknown";

export default function MedicationsPage() {
  const [items, setItems] = useState([]); // 初始为空，由 useEffect 从云端拉取
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ medId: 1, dose: "", frequency: "Once daily", time: "08:00 AM", startDate: "", endDate: "", notes: "" });

  // === 1. 页面加载时：自动向 PHP 后端索要真实药物列表 ===
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch("https://mediminder-api-production.up.railway.app/api/medications");
        const result = await response.json();
        if (result.status === "success") {
          setItems(result.data); // 装载数据库真实返回的数据
        }
      } catch (error) {
        console.error("拉取药物列表失败:", error);
      }
    };
    fetchMedications();
  }, []);

  // === 2. 添加药物：不仅更新前端，更要发给后端永久保存 ===
  const handleAdd = async (e) => {
    e.preventDefault();
    
    // 构造发给后端的数据
    const medName = getMedName(form.medId);
    const newMed = {
      medName: medName,
      dose: form.dose,
      time: form.time,
      color: "blue" // 默认给个颜色
    };

    // 乐观更新：瞬间让前端表格多出一行（提升用户体验）
    const tempItem = { 
      id: Date.now(), 
      ...newMed, 
      frequency: form.frequency, 
      stock: 30, 
      startDate: form.startDate || "2024-01-01", 
      endDate: form.endDate || "2024-12-31", 
      notes: form.notes 
    };
    setItems(prev => [...prev, tempItem]);
    setShowModal(false);

    // 真实动作：存入云端数据库
    try {
      await fetch("https://mediminder-api-production.up.railway.app/api/medications/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMed),
      });
      
      // （可选）添加成功后，重新从数据库拉取一次最新列表，获取真实的自增 ID
      const response = await fetch("https://mediminder-api-production.up.railway.app/api/medications");
      const result = await response.json();
      if (result.status === "success") setItems(result.data);
      
    } catch (error) {
      console.error("添加药物到数据库失败:", error);
    }
  };

  // === 3. 删除药物：联动删除云端数据 ===
  const handleDelete = async (id) => {
    // 乐观更新：立刻在画面上抹掉
    setItems(prev => prev.filter(p => p.id !== id));

    // 真实动作：告诉数据库删掉它
    try {
      await fetch("https://mediminder-api-production.up.railway.app/api/medications/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("在数据库中删除药物失败:", error);
    }
  };

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
                <th>Time</th>
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
                    {/* 兼容处理：如果来自数据库就用 medName，如果来自本地测试数据就用 getMedName */}
                    <div style={{ fontWeight: 600 }}>{p.medName || getMedName(p.medId)}</div>
                  </td>
                  <td>{p.dose}</td>
                  <td>{p.frequency || "Once daily"}</td>
                  <td>{p.time || (p.times ? p.times.join(", ") : "08:00 AM")}</td>
                  <td>
                    <span className={`badge ${(p.stock || 30) <= 7 ? "badge-red" : "badge-green"}`}>
                      {p.stock || 30} days
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "#6b7280" }}>
                    {p.startDate || "2024-05-01"} → {p.endDate || "Continuous"}
                  </td>
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
                    <label className="form-label">Time</label>
                    <input className="form-input" placeholder="e.g. 08:00 AM" value={form.time}
                      onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <select className="form-input" value={form.frequency}
                      onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
                      {["Once daily","Twice daily","Three times daily","As needed"].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start date</label>
                    <input className="form-input" type="date" value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
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