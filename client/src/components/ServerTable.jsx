export default function ServerTable({ servers, loading, onToggle, onDelete }) {
  if (loading) {
    return (
      <div className="status-box">Đang tải danh sách server từ hệ thống...</div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="status-box">
        Không có server nào khớp với bộ lọc hiện tại.
      </div>
    );
  }
  return (
    <div className="table-wrap">
      <table className="server-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Server</th>
            <th>Địa Chỉ IP</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((sv) => {
            const nextStatus = sv.status === "online" ? "offline" : "online";
            return (
              <tr key={sv.id}>
                <td>{sv.id}</td>
                <td className="mono blod"> {sv.name}</td>
                <td className="mono">{sv.ip}</td>
                <td>
                  <span className={`status-pill ${sv.status}`}>
                    {sv.status}
                  </span>
                </td>
                <td className="actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onToggle(sv)}
                  >
                    Đổi thành {nextStatus}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(sv.name)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
