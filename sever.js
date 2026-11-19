const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

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
  res.json(servers);
});
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
app.post("/servers", (req, res) => {
  const { name, ip, status } = req.body;

  if (!name || !ip) {
    return res.status(400).json({ error: "Thiếu name hoặc ip" });
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
