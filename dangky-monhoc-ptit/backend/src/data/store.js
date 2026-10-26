import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lớp lưu trữ dữ liệu dạng file JSON.
 *
 * Đồ án chỉ cần chạy độc lập, không phụ thuộc một hệ quản trị CSDL cài đặt
 * riêng, nên toàn bộ dữ liệu được lưu trong data/db.json. Cách đọc/ghi được
 * gói gọn trong module này — phần còn lại của backend không biết (và không
 * cần biết) dữ liệu đang nằm ở đâu. Muốn đổi sang Postgres/MySQL sau này chỉ
 * cần viết lại các hàm trong file này, controller không phải sửa gì.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");

let cache = null;
let lastMtimeMs = 0;

function emptyDb() {
  return {
    users: [],
    subjects: [],
    classes: [],
    registrations: [],
  };
}

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    writeDb(emptyDb());
    return cache;
  }

  const stat = fs.statSync(DB_FILE);
  if (cache && stat.mtimeMs === lastMtimeMs) {
    return cache;
  }

  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    cache = JSON.parse(raw);
    lastMtimeMs = stat.mtimeMs;
    return cache;
  } catch {
    cache = emptyDb();
    return cache;
  }
}

function writeDb(db) {
  cache = db;
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  try {
    lastMtimeMs = fs.statSync(DB_FILE).mtimeMs;
  } catch {
    lastMtimeMs = Date.now();
  }
}

function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}

/** Truy cập một bảng (collection) trong file JSON, kết hợp bộ nhớ đệm (in-memory cache) để tối ưu tốc độ đọc. */
function table(name) {
  return {
    all() {
      return [...readDb()[name]];
    },
    find(predicate) {
      return readDb()[name].find(predicate);
    },
    filter(predicate) {
      return readDb()[name].filter(predicate);
    },
    insert(row) {
      const db = readDb();
      const record = { id: nextId(db[name]), ...row };
      db[name].push(record);
      writeDb(db);
      return record;
    },
    update(id, patch) {
      const db = readDb();
      const index = db[name].findIndex((row) => row.id === id);
      if (index === -1) return null;
      db[name][index] = { ...db[name][index], ...patch, id };
      writeDb(db);
      return db[name][index];
    },
    remove(id) {
      const db = readDb();
      const before = db[name].length;
      db[name] = db[name].filter((row) => row.id !== id);
      writeDb(db);
      return db[name].length < before;
    },
  };
}

export const db = {
  users: table("users"),
  subjects: table("subjects"),
  classes: table("classes"),
  registrations: table("registrations"),
  raw: readDb,
  reset(data) {
    writeDb(data);
  },
};
