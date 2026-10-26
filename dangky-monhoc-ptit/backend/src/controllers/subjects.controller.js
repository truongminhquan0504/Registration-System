import { db } from "../data/store.js";

export function list(req, res) {
  const { q } = req.query;
  let subjects = db.subjects.all();

  if (q?.trim()) {
    const keyword = q.trim().toLowerCase();
    subjects = subjects.filter(
      (s) =>
        s.code.toLowerCase().includes(keyword) ||
        s.name.toLowerCase().includes(keyword)
    );
  }

  subjects.sort((a, b) => a.code.localeCompare(b.code));
  return res.json({ data: subjects });
}

export function getById(req, res) {
  const subject = db.subjects.find((s) => s.id === Number(req.params.id));
  if (!subject) return res.status(404).json({ message: "Không tìm thấy môn học." });
  return res.json({ data: subject });
}

export function create(req, res) {
  const { code, name, credits, description } = req.body ?? {};

  if (!code?.trim() || !name?.trim() || !credits) {
    return res.status(400).json({ message: "Vui lòng nhập đủ mã môn, tên môn và số tín chỉ." });
  }
  if (Number(credits) < 1) {
    return res.status(400).json({ message: "Số tín chỉ phải lớn hơn 0." });
  }
  if (db.subjects.find((s) => s.code.toLowerCase() === code.trim().toLowerCase())) {
    return res.status(409).json({ message: "Mã môn học đã tồn tại." });
  }

  const subject = db.subjects.insert({
    code: code.trim().toUpperCase(),
    name: name.trim(),
    credits: Number(credits),
    description: description?.trim() || "",
  });
  return res.status(201).json({ data: subject });
}

export function update(req, res) {
  const id = Number(req.params.id);
  const existing = db.subjects.find((s) => s.id === id);
  if (!existing) return res.status(404).json({ message: "Không tìm thấy môn học." });

  const { code, name, credits, description } = req.body ?? {};
  const nextCode = code?.trim() ? code.trim().toUpperCase() : existing.code;

  if (
    db.subjects.find(
      (s) => s.id !== id && s.code.toLowerCase() === nextCode.toLowerCase()
    )
  ) {
    return res.status(409).json({ message: "Mã môn học đã tồn tại." });
  }
  if (credits !== undefined && Number(credits) < 1) {
    return res.status(400).json({ message: "Số tín chỉ phải lớn hơn 0." });
  }

  const updated = db.subjects.update(id, {
    code: nextCode,
    name: name?.trim() ? name.trim() : existing.name,
    credits: credits ? Number(credits) : existing.credits,
    description: description !== undefined ? description.trim() : existing.description,
  });
  return res.json({ data: updated });
}

export function remove(req, res) {
  const id = Number(req.params.id);
  const hasClasses = db.classes.find((c) => c.subject_id === id);
  if (hasClasses) {
    return res.status(409).json({ message: "Không thể xóa: môn học đang có lớp học phần." });
  }
  const removed = db.subjects.remove(id);
  if (!removed) return res.status(404).json({ message: "Không tìm thấy môn học." });
  return res.status(204).end();
}
