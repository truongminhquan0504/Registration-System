import { db } from "../data/store.js";

function toSafeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

/** Admin: xem toàn bộ tài khoản, lọc theo role. */
export function list(req, res) {
  const { role } = req.query;
  let users = db.users.all();
  if (role) users = users.filter((u) => u.role === role.toUpperCase());
  return res.json({ data: users.map(toSafeUser) });
}

/** Admin: đổi vai trò một tài khoản (vd. nâng sinh viên lên giảng viên). */
export function updateRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body ?? {};

  if (!["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ." });
  }
  if (req.user?.id === id && role !== "ADMIN") {
    return res.status(400).json({ message: "Bạn không thể tự hạ quyền Quản trị viên của chính mình." });
  }
  const existing = db.users.find((u) => u.id === id);
  if (!existing) return res.status(404).json({ message: "Không tìm thấy tài khoản." });

  const updated = db.users.update(id, { role });
  return res.json({ data: toSafeUser(updated) });
}
