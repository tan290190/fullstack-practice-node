import { useState } from "react";

export default function ServerForm({ onAdd, submitting }) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [status, setStatus] = useState("online");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !ip.trim()) return;
    const ok = await onAdd({
      name: name.ttrim(),
      ip: ip.trim(),
      status,
    });
    if (ok) {
      setName("");
      setIp("");
      setStatus("online");
    }
  }
  return (
    <form onSubmit={handleSubmit} className="server-form">
      <input
        type="text"
        placeholder="Tên server (VD:SV7)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
      />
      <input
        type="text"
        placeholder="Địa chỉ IP  (VD:192.168.1.70)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        disabled={submitting}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={submitting}
      >
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Đang lưu..." : "Thêm Server"}
      </button>
    </form>
  );
}
