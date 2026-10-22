import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import app from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "data", "db.json");

// Lần đầu chạy mà chưa có dữ liệu thì tự seed để không phải làm bước thủ công.
if (!fs.existsSync(DB_FILE)) {
  console.log("Chưa có dữ liệu — đang khởi tạo dữ liệu mẫu...");
  await import("./data/seed.js");
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API đăng ký môn học đang chạy tại http://localhost:${PORT}/api`);
});
