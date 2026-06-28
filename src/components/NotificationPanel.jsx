const TYPE_COLORS = {
  refill: "#EF9F27",
  link:   "#1D9E75",
  missed: "#888780",
};

export default function NotificationPanel({ notifications }) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          Notifications
          {unread > 0 && (
            <span className="badge badge-notif" style={{ marginLeft: 8 }}>{unread}</span>
          )}
        </span>
      </div>
      <div className="card-body gap-col" style={{ gap: 8 }}>
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              display: "flex",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: n.read ? "#fafafa" : "#fff",
              border: "1px solid #e8eaed",
              opacity: n.read ? 0.65 : 1,
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: TYPE_COLORS[n.type] || "#888",
              marginTop: 5, flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.4 }}>{n.text}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
