import { db } from "../data/store.js";
import { enrich, isScheduleOverlap } from "./classes.controller.js";
import { formatSchedule } from "../utils/schedule.js";

/** Các lớp sinh viên đang đăng ký còn hiệu lực, trong cùng học kỳ với `semester` (nếu truyền vào). */
function activeClassesOf(studentId, semester) {
  const regs = db.registrations.filter((r) => r.student_id === studentId && r.status === "REGISTERED");
  return regs
    .map((r) => db.classes.find((c) => c.id === r.class_id))
    .filter(Boolean)
    .filter((c) => !semester || c.semester === semester);
}

/** Đăng ký một lớp học phần cho sinh viên đang đăng nhập. */
export function registerClass(req, res) {
  const studentId = req.user.id;
  const classId = Number(req.body?.class_id);

  if (!classId) {
    return res.status(400).json({ message: "Vui lòng chọn lớp học phần cần đăng ký." });
  }

  const targetClass = db.classes.find((c) => c.id === classId);
  if (!targetClass) {
    return res.status(404).json({ message: "Không tìm thấy lớp học phần." });
  }

  // 1. Đã đăng ký lớp này rồi?
  const already = db.registrations.find(
    (r) => r.student_id === studentId && r.class_id === classId && r.status === "REGISTERED"
  );
  if (already) {
    return res.status(409).json({ message: "Bạn đã đăng ký lớp học phần này rồi." });
  }

  // 2. Đã học môn này ở một lớp khác trong cùng học kỳ chưa (tránh đăng ký trùng môn)?
  const currentClasses = activeClassesOf(studentId, targetClass.semester);
  const sameSubject = currentClasses.find((c) => c.subject_id === targetClass.subject_id);
  if (sameSubject) {
    return res.status(409).json({
      message: `Bạn đã đăng ký môn học này ở lớp ${sameSubject.class_code}.`,
    });
  }

  // 3. Hết chỗ?
  const registeredCount = db.registrations.filter(
    (r) => r.class_id === classId && r.status === "REGISTERED"
  ).length;
  if (registeredCount >= targetClass.max_students) {
    return res.status(409).json({ message: "Lớp học phần đã đủ sĩ số." });
  }

  // 4. Trùng lịch học với một lớp đã đăng ký khác trong cùng học kỳ?
  const conflict = currentClasses.find((c) => isScheduleOverlap(c, targetClass));
  if (conflict) {
    return res.status(409).json({
      message: `Trùng lịch học với lớp ${conflict.class_code} (${formatSchedule(conflict)}).`,
    });
  }

  const registration = db.registrations.insert({
    student_id: studentId,
    class_id: classId,
    status: "REGISTERED",
    registered_at: new Date().toISOString(),
  });

  return res.status(201).json({ data: { ...registration, class: enrich(targetClass) } });
}

/** Hủy đăng ký một lớp học phần. */
export function cancelRegistration(req, res) {
  const studentId = req.user.id;
  const registrationId = Number(req.params.id);

  const registration = db.registrations.find((r) => r.id === registrationId);
  if (!registration || registration.student_id !== studentId) {
    return res.status(404).json({ message: "Không tìm thấy đăng ký này." });
  }
  if (registration.status !== "REGISTERED") {
    return res.status(409).json({ message: "Đăng ký này đã được hủy trước đó." });
  }

  const updated = db.registrations.update(registrationId, { status: "CANCELLED" });
  return res.json({ data: updated });
}

/** Danh sách môn/lớp sinh viên hiện đang đăng ký. */
export function myRegistrations(req, res) {
  const { semester } = req.query;
  let regs = db.registrations.filter((r) => r.student_id === req.user.id && r.status === "REGISTERED");

  const data = regs
    .map((r) => {
      const classItem = db.classes.find((c) => c.id === r.class_id);
      if (!classItem) return null;
      return { registration_id: r.id, registered_at: r.registered_at, class: enrich(classItem) };
    })
    .filter(Boolean)
    .filter((r) => !semester || r.class.semester === semester);

  return res.json({ data });
}

/** Thời khóa biểu cá nhân, nhóm sẵn theo thứ trong tuần để frontend vẽ lưới. */
export function mySchedule(req, res) {
  const semester = req.query.semester;
  const classes = activeClassesOf(req.user.id, semester).map(enrich);

  const byDay = {};
  for (const c of classes) {
    byDay[c.day_of_week] = byDay[c.day_of_week] ?? [];
    byDay[c.day_of_week].push(c);
  }
  for (const day of Object.keys(byDay)) {
    byDay[day].sort((a, b) => a.start_period - b.start_period);
  }

  const totalCredits = classes.reduce((sum, c) => sum + (c.subject?.credits ?? 0), 0);

  return res.json({ data: { classes, by_day: byDay, total_credits: totalCredits } });
}
