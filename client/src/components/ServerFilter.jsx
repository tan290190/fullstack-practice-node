const FILTERS = [
  { label: "Tất cả", value: "" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];

export default function ServerFilter({ filter, onChange, total }) {
  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        <span className="filter-label">Lọc trạng thái:</span>
        {FILTERS.map((item) => (
          <button
            key={item.value || "all"}
            type="button"
            className={`btn btn-filter ${filter === item.value ? "active" : ""}`}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <span className="total-badge">Tổng: {total} server</span>
    </div>
  );
}
