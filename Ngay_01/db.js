const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("Server.db");

db.exec(`
    CREATE TABLE IF NOT  EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        ip TEXT NOT NULL,
        status TEXT DEFAULT 'online'
    )
`);

const countRow = db.prepare("SELECT COUNT(*) as total FROM servers").get();
if (countRow.total === 0) {
  const insert = db.prepare(
    "INSERT INTO servers (name,ip,status) values   (?,?,?)",
  );
  insert.run("SV1", "192.168.1.1", "online");
  insert.run("SV2", "192.168.1.10", "offline");
  insert.run("SV3", "192.168.1.100", "online");
}
module.exports = db;
