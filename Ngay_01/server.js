// Nạp biến môi trường từ file .env (hỗ trợ sẵn trên Node.js v20.6+)
try {
  process.loadEnvFile();
} catch (_) {
  // Bỏ qua nếu môi trường đã có sẵn biến PORT
}

const express = require("express");
const serverRoutes = require("./routes/serverRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware đọc JSON từ body của request
app.use(express.json());

// Phục vụ giao diện tĩnh từ thư mục Public
app.use(express.static("Public"));

// Route kiểm tra trạng thái hoạt động của API
app.get("/api/health", (req, res) => {
  res.json({
    service: "System Monitor API (SQLite Connected)",
    status: "running",
  });
});

// Gắn toàn bộ route quản lý server vào /servers
app.use("/servers", serverRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
