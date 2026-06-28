import { useEffect, useRef } from "react";
import { adherenceByMed } from "../data/mockData";
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler } from "chart.js";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

// Generate fake 30-day history
function generate30Days(basePct) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-MY", { month: "short", day: "numeric" });
    const val = Math.min(100, Math.max(0, basePct + Math.round((Math.random() - 0.5) * 30)));
    days.push({ label, val });
  }
  return days;
}

function MedLineChart({ med }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const history   = generate30Days(med.pct);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const color = med.pct >= 85 ? "#1D9E75" : med.pct >= 60 ? "#EF9F27" : "#E24B4A";
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: history.map(d => d.label),
        datasets: [{
          data: history.map(d => d.val),
          borderColor: color,
          backgroundColor: color + "18",
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 110, ticks: { callback: v => `${v}%`, font: { size: 9 } }, grid: { color: "rgba(0,0,0,.05)" } },
          x: { ticks: { maxTicksLimit: 6, font: { size: 9 } }, grid: { display: false } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div style={{ position: "relative", height: 120 }}>
      <canvas ref={canvasRef} role="img" aria-label={`30-day adherence trend for ${med.name}`}>
        {med.name}: {med.pct}% average adherence over 30 days.
      </canvas>
    </div>
  );
}

function adherenceColor(pct) {
  if (pct >= 85) return { text: "#085041", bg: "#E1F5EE" };
  if (pct >= 60) return { text: "#633806", bg: "#FAEEDA" };
  return { text: "#501313", bg: "#FCEBEB" };
}

export default function AdherenceReport() {
  return (
    <>
      <div className="topbar">
        <div>
          <h1>Adherence Report</h1>
          <p>Last 30 days · Lee Chen</p>
        </div>
        <div className="topbar-actions">
          <button className="btn">
            <i className="ti ti-download" aria-hidden="true" /> Export PDF
          </button>
          <button className="btn">
            <i className="ti ti-file-spreadsheet" aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      <div className="content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Overall 30-day</div>
            <div className="stat-val">82%</div>
            <div className="stat-sub warn">Below 85% target</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total doses scheduled</div>
            <div className="stat-val">120</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Doses taken</div>
            <div className="stat-val" style={{ color: "#1D9E75" }}>94</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Doses missed / skipped</div>
            <div className="stat-val" style={{ color: "#E24B4A" }}>26</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {adherenceByMed.map(med => {
            const { text, bg } = adherenceColor(med.pct);
            return (
              <div className="card" key={med.name}>
                <div className="card-header">
                  <span className="card-title">{med.name}</span>
                  <span className="badge" style={{ background: bg, color: text, fontSize: 13, padding: "3px 12px" }}>
                    {med.pct}%
                  </span>
                </div>
                <div className="card-body">
                  <MedLineChart med={med} />
                  <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                    <span>Taken: <strong style={{ color: "#1a1a1a" }}>{med.taken}</strong></span>
                    <span>Missed: <strong style={{ color: "#E24B4A" }}>{med.total - med.taken}</strong></span>
                    <span>Total: {med.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
