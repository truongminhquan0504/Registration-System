/**
 * Hai lớp học phần được coi là TRÙNG LỊCH nếu học cùng thứ trong tuần và
 * khoảng tiết học giao nhau (dùng để chặn đăng ký khi tạo xung đột thời khóa
 * biểu cho sinh viên).
 */
export function isScheduleOverlap(a, b) {
  if (a.day_of_week !== b.day_of_week) return false;
  return a.start_period <= b.end_period && b.start_period <= a.end_period;
}

export const DAY_LABELS = {
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
  8: "Chủ nhật",
};

export function formatSchedule(classItem) {
  const day = DAY_LABELS[classItem.day_of_week] ?? `Thứ ${classItem.day_of_week}`;
  return `${day}, tiết ${classItem.start_period}-${classItem.end_period} • ${classItem.room}`;
}
