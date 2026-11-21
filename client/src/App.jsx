import { useCallback, useEffect, useState } from "react";
import ServerForm from "./components/ServerForm";
import ServerFilter from "./components/ServerFilter";
import ServerTable from "./components/ServerTable";
import "./App.css";

export default function App() {
  const [servers, setServers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }

  const loadServers = useCallback(
    async (currentFilter = filter, showLoader = false) => {
      if (showLoader) setLoading(true);
      try {
        const url = currentFilter
          ? `/servers?status=${encodeURIComponent(currentFilter)}`
          : "/servers";
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Không thể tải danh sách server");
        }

        setServers(data);
      } catch (err) {
        setFeedback({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    loadServers(filter, true);
  }, [filter, loadServers]);

  async function handleAddServer(payload) {
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Thêm server thất bại",
        });
        return false;
      }

      setFeedback({
        type: "success",
        text: data.message || `Đã thêm ${payload.name}`,
      });
      await loadServers(filter, false);
      return true;
    } catch {
      setFeedback({ type: "error", text: "Lỗi kết nối tới Backend API" });
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(sv) {
    const nextStatus = sv.status === "online" ? "offline" : "online";
    setFeedback(null);
    try {
      const res = await fetch(`/servers/${encodeURIComponent(sv.name)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Cập nhật trạng thái thất bại",
        });
        return;
      }

      setFeedback({
        type: "success",
        text: data.message || `Đã đổi ${sv.name} sang ${nextStatus}`,
      });
      await loadServers(filter, false);
    } catch {
      setFeedback({ type: "error", text: "Lỗi kết nối tới Backend API" });
    }
  }

  async function handleDeleteServer(svName) {
    setFeedback(null);
    try {
      const res = await fetch(`/servers/${encodeURIComponent(svName)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Xóa server thất bại",
        });
        return;
      }

      setFeedback({
        type: "success",
        text: data.message || `Đã xóa ${svName}`,
      });
      await loadServers(filter, false);
    } catch {
      setFeedback({ type: "error", text: "Lỗi kết nối tới Backend API" });
    }
  }

  return (
    <main className="page">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <div>
            <h1>System Monitor Dashboard</h1>
            <p className="subtitle">
              Quản lý trạng thái node &amp; IP · React + Express + SQLite
            </p>
          </div>
        </header>

        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            <span>{feedback.text}</span>
            <button
              type="button"
              className="alert-close"
              onClick={() => setFeedback(null)}
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        )}

        <ServerForm onAdd={handleAddServer} submitting={submitting} />

        <ServerFilter
          filter={filter}
          onChange={setFilter}
          total={servers.length}
        />

        <ServerTable
          servers={servers}
          loading={loading}
          onToggle={handleToggleStatus}
          onDelete={handleDeleteServer}
        />
      </div>
    </main>
  );
}
