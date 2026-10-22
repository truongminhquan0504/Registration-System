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
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return emptyDb();
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}

/** Truy cập một bảng (collection) trong file JSON, luôn đọc/ghi trực tiếp xuống đĩa. */
function table(name) {
  return {
    all() {
      return readDb()[name];
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
