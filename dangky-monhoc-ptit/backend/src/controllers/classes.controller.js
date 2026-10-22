import { db } from "../data/store.js";
import { formatSchedule, isScheduleOverlap } from "../utils/schedule.js";

/** Gắn thêm thông tin môn học, giảng viên, sĩ số hiện tại vào một lớp thô. */
function enrich(classItem) {
  const subject = db.subjects.find((s) => s.id === classItem.subject_id);
  const teacher = db.users.find((u) => u.id === classItem.teacher_id);
  const registeredCount = db.registrations.filter(
    (r) => r.class_id === classItem.id && r.status === "REGISTERED"
  ).length;

  return {
    ...classItem,
    subject: subject ? { id: subject.id, code: subject.code, name: subject.name, credits: subject.credits } : null,
    teacher: teacher ? { id: teacher.id, name: teacher.name } : null,
    schedule_text: formatSchedule(classItem),
    registered_count: registeredCount,
    remaining_slots: Math.max(classItem.max_students - registeredCount, 0),
    is_full: registeredCount >= classItem.max_students,
  };
}

export function list(req, res) {
  const { subject_id, semester, teacher_id, q } = req.query;
  let classes = db.classes.all();

  if (subject_id) classes = classes.filter((c) => c.subject_id === Number(subject_id));
  if (semester) classes = classes.filter((c) => c.semester === semester);
  if (teacher_id) classes = classes.filter((c) => c.teacher_id === Number(teacher_id));

  let enriched = classes.map(enrich);

  if (q?.trim()) {
    const keyword = q.trim().toLowerCase();
    enriched = enriched.filter(
      (c) =>
        c.class_code.toLowerCase().includes(keyword) ||
        c.subject?.name.toLowerCase().includes(keyword) ||
        c.subject?.code.toLowerCase().includes(keyword)
    );
  }

  enriched.sort((a, b) => a.class_code.localeCompare(b.class_code));
  return res.json({ data: enriched });
}

export function getById(req, res) {
  const classItem = db.classes.find((c) => c.id === Number(req.params.id));
  if (!classItem) return res.status(404).json({ message: "Không tìm thấy lớp học phần." });
  return res.json({ data: enrich(classItem) });
}

export function create(req, res) {
  const { subject_id, class_code, teacher_id, semester, max_students, room, day_of_week, start_period, end_period } =
    req.body ?? {};

  if (!subject_id || !class_code?.trim() || !semester?.trim() || !max_students || !room?.trim() || !day_of_week || !start_period || !end_period) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin lớp học phần." });
  }
  if (!db.subjects.find((s) => s.id === Number(subject_id))) {
    return res.status(400).json({ message: "Môn học không tồn tại." });
  }
  if (teacher_id && !db.users.find((u) => u.id === Number(teacher_id) && u.role === "TEACHER")) {
    return res.status(400).json({ message: "Giảng viên không hợp lệ." });
  }
  if (db.classes.find((c) => c.class_code.toLowerCase() === class_code.trim().toLowerCase())) {
    return res.status(409).json({ message: "Mã lớp học phần đã tồn tại." });
  }
  if (Number(start_period) > Number(end_period)) {
    return res.status(400).json({ message: "Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc." });
  }

  const classItem = db.classes.insert({
    subject_id: Number(subject_id),
    class_code: class_code.trim(),
    teacher_id: teacher_id ? Number(teacher_id) : null,
    semester: semester.trim(),
    max_students: Number(max_students),
    room: room.trim(),
    day_of_week: Number(day_of_week),
    start_period: Number(start_period),
    end_period: Number(end_period),
  });
  return res.status(201).json({ data: enrich(classItem) });
}

export function update(req, res) {
  const id = Number(req.params.id);
  const existing = db.classes.find((c) => c.id === id);
  if (!existing) return res.status(404).json({ message: "Không tìm thấy lớp học phần." });

  const body = req.body ?? {};
  const patch = {};
  for (const key of ["subject_id", "teacher_id", "max_students", "day_of_week", "start_period", "end_period"]) {
    if (body[key] !== undefined) patch[key] = Number(body[key]);
  }
  for (const key of ["class_code", "semester", "room"]) {
    if (body[key] !== undefined) patch[key] = String(body[key]).trim();
  }

  const updated = db.classes.update(id, patch);
  return res.json({ data: enrich(updated) });
}

export function remove(req, res) {
  const id = Number(req.params.id);
  const hasRegs = db.registrations.find((r) => r.class_id === id && r.status === "REGISTERED");
  if (hasRegs) {
    return res.status(409).json({ message: "Không thể xóa: lớp học phần đang có sinh viên đăng ký." });
  }
  const removed = db.classes.remove(id);
  if (!removed) return res.status(404).json({ message: "Không tìm thấy lớp học phần." });
  return res.status(204).end();
}

/** Danh sách lớp mà giảng viên hiện tại đang dạy. */
export function myTeachingClasses(req, res) {
  const classes = db.classes.filter((c) => c.teacher_id === req.user.id).map(enrich);
  return res.json({ data: classes });
}

/** Danh sách sinh viên đã đăng ký (roster) của một lớp — cho giảng viên/admin. */
export function roster(req, res) {
  const classId = Number(req.params.id);
  const classItem = db.classes.find((c) => c.id === classId);
  if (!classItem) return res.status(404).json({ message: "Không tìm thấy lớp học phần." });

  if (req.user.role === "TEACHER" && classItem.teacher_id !== req.user.id) {
    return res.status(403).json({ message: "Bạn không phụ trách lớp học phần này." });
  }

  const roster = db.registrations
    .filter((r) => r.class_id === classId && r.status === "REGISTERED")
    .map((r) => {
      const student = db.users.find((u) => u.id === r.student_id);
      return {
        registration_id: r.id,
        registered_at: r.registered_at,
        student: student ? { id: student.id, name: student.name, email: student.email, student_code: student.student_code } : null,
      };
    });

  return res.json({ data: { class: enrich(classItem), students: roster } });
}

export { enrich, isScheduleOverlap };
