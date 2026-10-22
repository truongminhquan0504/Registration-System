export const DAY_LABELS = {
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
  8: "Chủ nhật",
};

export const WEEK_DAYS = [2, 3, 4, 5, 6, 7, 8];

export function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const ROLE_LABELS = {
  STUDENT: "Sinh viên",
  TEACHER: "Giảng viên",
  ADMIN: "Quản trị viên",
};
