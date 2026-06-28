import { useState, useEffect } from "react";
// 删除了 mockData 里的 todayDoses，只保留图表和通知的假数据装点门面
import { adherenceByMed, weeklyAdherence, notifications } from "../data/mockData";
import AdherenceChart from "../components/AdherenceChart";
import NotificationPanel from "../components/NotificationPanel";

const COLOR_MAP = {
  blue:  { bg: "#E6F1FB", fg: "#378ADD" },
  teal:  { bg: "#E1F5EE", fg: "#1D9E75" },
  amber: { bg: "#FAEEDA", fg: "#EF9F27" },
  red:   { bg: "#FCEBEB", fg: "#E24B4A" },
};

function adherenceColor(pct) {
  if (pct >= 85) return { bar: "#1D9E75", text: "#085041" };
  if (pct >= 60) return { bar: "#EF9F27", text: "#633806" };
  return { bar: "#E24B4A", text: "#501313" };
}

export default function PatientDashboard() {
  // === 原有的状态 ===
  const [doses, setDoses] = useState([]); 
  const today = new Date().toLocaleDateString("en-MY", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // === 【新增】：弹窗开关和表单数据 ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({ medName: "Panadol", dose: "500mg", time: "08:00 AM", color: "teal" });

  // === 【新增】：处理表单提交的函数 ===
  const handleAddMedication = async (e) => {
    e.preventDefault();
    
    // 1. 生成一个临时 ID，并构建新药物的数据结构
    const addedDose = {
      id: Math.floor(Math.random() * 10000) + 100, // 随机生成一个 ID
      time: newMed.time,
      medName: newMed.medName,
      dose: newMed.dose,
      color: newMed.color,
      status: "upcoming" // 刚添加的药，默认没吃
    };

    // 2. 【核心】瞬间更新前端页面，让新药出现在列表里
    setDoses(prev => [...prev, addedDose]);
    setIsModalOpen(false); // 关闭弹窗

    // 3. 把新药发送给 PHP 后端 (即使后端还没存进复杂的关联表，前端也已经成功展示了)
    try {
      await fetch("http://mediminder-api-production.up.railway.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addedDose),
      });
    } catch (error) {
      console.error("发送到后端失败:", error);
    }
  };
  // 【核心新增】页面加载时，自动向 PHP 后端索要今天的数据
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("http://mediminder-api-production.up.railway.app");
        const result = await response.json();
        if (result.status === "success") {
          setDoses(result.data); // 将数据库返回的真实状态装载进页面
        }
      } catch (error) {
        console.error("无法连接到后端获取日程:", error);
      }
    };
    fetchSchedule();
  }, []);

  // 【核心修改】点击按钮时，不仅改变前端画面，还要发送到数据库
  const mark = async (id, status) => {
    // 1. 乐观更新：立刻让前端画面发生变化（不需要等服务器回传，感觉更流畅）
    const nowStr = new Date().toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
    setDoses(prev => prev.map(d => d.id === id ? { ...d, status, takenAt: nowStr } : d));

    // 2. 真实动作：把结果告诉数据库的 dose_logs 表
    try {
      await fetch("http://mediminder-api-production.up.railway.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      console.log(`ID ${id} 已成功在数据库中标记为 ${status}`);
    } catch (error) {
      console.error("数据库更新失败:", error);
    }
  };

  const taken   = doses.filter(d => d.status === "taken").length;
  const skipped = doses.filter(d => d.status === "skipped").length;
  const total   = doses.length;

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Today's Schedule</h1>
          <p>{today}</p>
        </div>
        <div className="topbar-actions">
          <button className="btn">
            <i className="ti ti-download" aria-hidden="true" /> Export report
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
  <i className="ti ti-plus" aria-hidden="true" /> Add medication
</button>
        </div>
      </div>

      <div className="content">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Today's doses</div>
            <div className="stat-val">{total}</div>
            <div className="stat-sub good">{taken} taken · {total - taken - skipped} upcoming</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">7-day adherence</div>
            <div className="stat-val">88%</div>
            <div className="stat-sub good">↑ 3% vs last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">30-day adherence</div>
            <div className="stat-val">82%</div>
            <div className="stat-sub warn">Below 85% target</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Streak</div>
            <div className="stat-val">5 days</div>
            <div className="stat-sub good">Personal best: 14</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Left column */}
          <div className="gap-col">
            {/* Schedule */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Medication schedule</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {["Yesterday","Today","Tomorrow"].map(d => (
                    <button key={d} className={`btn btn-sm ${d === "Today" ? "btn-primary" : ""}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="card-body gap-col" style={{ gap: 8 }}>
                {["Morning","Afternoon & Evening"].map(section => {
                  const isAM = section === "Morning";
                  const items = doses.filter(d => isAM ? d.time.includes("AM") : !d.time.includes("AM"));
                  return (
                    <div key={section}>
                      <div className="section-label">{section}</div>
                      {items.map(dose => {
                        const col = COLOR_MAP[dose.color] || COLOR_MAP.blue;
                        return (
                          <div key={dose.id} className={`dose-row dose-${dose.status}`}>
                            <span className="dose-time">{dose.time}</span>
                            <div
                              className="dose-icon"
                              style={{ background: col.bg, color: col.fg }}
                            >
                              <i className="ti ti-pill" aria-hidden="true" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className="dose-name">{dose.medName}</div>
                              <div className="dose-info">{dose.dose} · Oral tablet</div>
                            </div>
                            <div className="dose-actions">
                              {dose.status === "taken" && (
                                <span className="chip chip-taken">
                                  <i className="ti ti-check" style={{ fontSize: 12 }} /> Taken {dose.takenAt}
                                </span>
                              )}
                              {dose.status === "skipped" && (
                                <span className="chip chip-skipped">Skipped</span>
                              )}
                              {dose.status === "upcoming" && (
                                <>
                                  <button className="chip chip-take" onClick={() => mark(dose.id, "taken")}>
                                    <i className="ti ti-check" style={{ fontSize: 12 }} /> Mark taken
                                  </button>
                                  <button className="chip chip-skip" onClick={() => mark(dose.id, "skipped")}>
                                    Skip
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Adherence bars */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">30-day adherence per medication</span>
                <button className="btn btn-sm">Full report</button>
              </div>
              <div className="card-body gap-col">
                {adherenceByMed.map(m => {
                  const { bar, text } = adherenceColor(m.pct);
                  return (
                    <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#6b7280", width: 90, flexShrink: 0 }}>{m.name}</span>
                      <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${m.pct}%`, height: "100%", background: bar, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: text, width: 32, textAlign: "right" }}>
                        {m.pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="gap-col">
            <div className="card">
              <div className="card-header"><span className="card-title">Weekly overview</span></div>
              <div className="card-body">
                <AdherenceChart data={weeklyAdherence} />
              </div>
            </div>
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </div>
      {/* === 【新增】：真实弹出的表单 === */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Medication</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddMedication} className="auth-form">
              <div className="form-group">
                <label>Medication Name</label>
                <input type="text" required value={newMed.medName} onChange={e => setNewMed({...newMed, medName: e.target.value})} placeholder="e.g. Panadol" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dose</label>
                  <input type="text" required value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} placeholder="e.g. 500mg" />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="text" required value={newMed.time} onChange={e => setNewMed({...newMed, time: e.target.value})} placeholder="e.g. 08:00 AM" />
                </div>
              </div>

              <div className="form-group">
                <label>Color Tag</label>
                <select value={newMed.color} onChange={e => setNewMed({...newMed, color: e.target.value})}>
                  <option value="teal">Teal (Green)</option>
                  <option value="blue">Blue</option>
                  <option value="amber">Amber (Yellow)</option>
                  <option value="red">Red</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
                Save Schedule
              </button>
            </form>
          </div>
        </div>
      )}
      {/* === 弹窗结束 === */}
    </>
  );
}