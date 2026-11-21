const express = require("express");
const router = express.Router();

// Lùi ra 1 cấp ("../") rồi đi vào thư mục controllers
const serverController = require("../controllers/serverController");

// Vì ở server.js ta đã gắn router này với tiền tố "/servers",
// nên "/" ở đây tương ứng với "/servers", và "/:name" tương ứng với "/servers/:name"
router.get("/", serverController.getAllServers);
router.post("/", serverController.createServer);
router.put("/:name", serverController.updateServerStatus);
router.delete("/:name", serverController.deleteServer);

module.exports = router;
