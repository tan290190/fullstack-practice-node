// Vì serverController.js nằm trong thư mục "controllers/",
// nên cần "../db" để lùi ra 1 cấp tìm file db.js ở thư mục gốc Ngay_01
const db = require("../db");

// Xử lý GET /servers (hỗ trợ lọc qua query ?status=online hoặc ?status=offline)
function getAllServers(req, res) {
  const { status } = req.query;

  if (status) {
    const rows = db
      .prepare("SELECT * FROM servers WHERE status = ?")
      .all(status);
    return res.json(rows);
  }

  const rows = db.prepare("SELECT * FROM servers").all();
  res.json(rows);
}

// Xử lý POST /servers (thêm server mới vào SQLite)
function createServer(req, res) {
  const { name, ip, status } = req.body;

  if (!name || !ip) {
    return res
      .status(400)
      .json({ error: "Vui lòng cung cấp đầy đủ name và ip" });
  }

  const finalStatus = status || "online";

  try {
    const insert = db.prepare(
      "INSERT INTO servers (name, ip, status) VALUES (?, ?, ?)",
    );
    const result = insert.run(name, ip, finalStatus);

    res.status(201).json({
      message: "Đã lưu server vào Database thành công",
      data: {
        id: Number(result.lastInsertRowid),
        name,
        ip,
        status: finalStatus,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Tên server đã tồn tại hoặc dữ liệu không hợp lệ" });
  }
}

// Xử lý PUT /servers/:name (đổi trạng thái online/offline)
function updateServerStatus(req, res) {
  const { name } = req.params;
  const { status } = req.body;

  if (!["online", "offline"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Trạng thái chỉ được là 'online' hoặc 'offline'" });
  }

  const update = db.prepare("UPDATE servers SET status = ? WHERE name = ?");
  const result = update.run(status, name);

  if (result.changes === 0) {
    return res.status(404).json({ error: `Không tìm thấy server tên ${name}` });
  }

  res.json({ message: `Đã cập nhật ${name} thành ${status}` });
}

// Xử lý DELETE /servers/:name (xóa server khỏi SQLite)
function deleteServer(req, res) {
  const { name } = req.params;
  const del = db.prepare("DELETE FROM servers WHERE name = ?");
  const result = del.run(name);

  if (result.changes === 0) {
    return res.status(404).json({ error: `Không tìm thấy server tên ${name}` });
  }

  res.json({ message: `Đã xóa vĩnh viễn server ${name} khỏi Database` });
}

// Xuất cả 4 hàm ra để file routes sử dụng
module.exports = {
  getAllServers,
  createServer,
  updateServerStatus,
  deleteServer,
};
