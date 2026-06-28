import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

function barColor(pct) {
  if (pct >= 85) return "#1D9E75";
  if (pct >= 60) return "#EF9F27";
  return "#E24B4A";
}

export default function AdherenceChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map(d => d.day),
        datasets: [{
          label: "Adherence %",
          data: data.map(d => d.pct),
          backgroundColor: data.map(d => barColor(d.pct)),
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}%` } },
        },
        scales: {
          y: {
            min: 0, max: 110,
            ticks: { callback: v => `${v}%`, font: { size: 10 } },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: {
            ticks: { font: { size: 10 } },
            grid: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div style={{ position: "relative", width: "100%", height: 180 }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Bar chart showing weekly medication adherence percentage"
      >
        Weekly adherence: {data.map(d => `${d.day} ${d.pct}%`).join(", ")}.
      </canvas>
    </div>
  );
}
