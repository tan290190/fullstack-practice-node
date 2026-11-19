const express = require("express");
const db = require("./db");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const servers = [
  { name: "SV1", ip: "192.168.1.1", status: "online" },
  { name: "SV2", ip: "192.168.1.10", status: "offline" },
  { name: "SV3", ip: "192.168.1.100", status: "online" },
];
app.get("/", (req, res) => {
  res.json({
    service: "System Monitor API",
    status: "running",
  });
});
app.get("/servers", (req, res) => {
  const { status } = req.query;
  if (status) {
    const rows = db
      .prepare("SELECT * FROM servers WHERE status = ?")
      .all(status);
    return res.json(rows);
  }
  const rows = db.prepare("SELECT * FROM servers").all();

  res.json(rows);
});

app.post("/servers", (req, res) => {
  const { name, ip, status } = req.body;

  if (!name || !ip) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ thông tin và Ip" });
  }
  try {
    const insert = db.prepare(
      "INSERT INTO servers (name, ip, status) VALUES (?, ?, ?)",
    );
    const result = insert.run(name, ip, status || "online");
    res.status(201).json({
      message: "Đã lưu server vào Database thành công",
      data: {
        id: Number(result.lastInsertRowid),
        name,
        ip,
        status: status || "online",
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Tên server đã tồn tại hoặc dữ liệu không hợp lệ" });
  }

  const newServer = {
    name,
    ip,
    status: status || "online",
  };

  servers.push(newServer);
  res.status(201).json({
    message: "Đã thêm server thành công",
    data: newServer,
    totalServers: servers.length,
  });
});
app.get("/servers", (req, res) => {
  const { status } = req.query;

  if (status) {
    const filtered = servers.filter((sv) => sv.status === status);
    return res.json(filtered);
  }
  res.json(servers);
});
app.delete("/servers/:name", (req, res) => {
  const { name } = req.params;
  const del = db.prepare("DELETE FROM servers WHERE name = ?");
  const result = del.run(name);

  if (result.changes === 0) {
    return res.status(404).json({ error: `Không tìm thấy server tên ${name}` });
  }
  res.json({
    message: `Đã xóa vĩnh viễn  server ${name} khỏi Database `,
  });
});
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
