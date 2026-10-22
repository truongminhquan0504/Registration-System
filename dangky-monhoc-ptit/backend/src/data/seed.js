import bcrypt from "bcryptjs";

import { db } from "./store.js";

/**
 * Tạo lại toàn bộ dữ liệu mẫu. Chạy bằng `npm run seed`.
 * Mật khẩu demo cho MỌI tài khoản: 123456
 */

const DEMO_PASSWORD_HASH = bcrypt.hashSync("123456", 10);

const users = [
  {
    id: 1,
    name: "Quản trị hệ thống",
    email: "admin@ptit.edu.vn",
    password: DEMO_PASSWORD_HASH,
    role: "ADMIN",
    student_code: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "GV. Nguyễn Văn An",
    email: "teacher1@ptit.edu.vn",
    password: DEMO_PASSWORD_HASH,
    role: "TEACHER",
    student_code: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "GV. Trần Thị Bình",
    email: "teacher2@ptit.edu.vn",
    password: DEMO_PASSWORD_HASH,
    role: "TEACHER",
    student_code: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "GV. Lê Văn Cường",
    email: "teacher3@ptit.edu.vn",
    password: DEMO_PASSWORD_HASH,
    role: "TEACHER",
    student_code: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Phạm Văn Đức",
    email: "sv1@ptit.edu.vn",
    password: DEMO_PASSWORD_HASH,
    role: "STUDENT",
    student_code: "B21DCCN001",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Hoàng Thị Em",
    email: "sv2@ptit.edu.vn",
    password: DEMO_PASSWORD_HASH,
    role: "STUDENT",
    student_code: "B21DCCN002",
    created_at: new Date().toISOString(),
  },
];

const subjects = [
  { id: 1, code: "INT1339", name: "Nhập môn lập trình", credits: 3, description: "Các khái niệm cơ bản về lập trình với ngôn ngữ C." },
  { id: 2, code: "INT1420", name: "Cấu trúc dữ liệu và giải thuật", credits: 4, description: "Danh sách, cây, đồ thị, sắp xếp và tìm kiếm." },
  { id: 3, code: "INT1456", name: "Cơ sở dữ liệu", credits: 3, description: "Mô hình quan hệ, SQL, chuẩn hóa cơ sở dữ liệu." },
  { id: 4, code: "NET1234", name: "Mạng máy tính", credits: 3, description: "Mô hình OSI/TCP-IP, định tuyến, giao thức mạng." },
  { id: 5, code: "INT1345", name: "Lập trình hướng đối tượng", credits: 3, description: "Lập trình OOP với Java: lớp, kế thừa, đa hình." },
  { id: 6, code: "MAT1094", name: "Xác suất thống kê", credits: 3, description: "Xác suất, biến ngẫu nhiên, ước lượng và kiểm định." },
  { id: 7, code: "INT1327", name: "Hệ điều hành", credits: 3, description: "Tiến trình, bộ nhớ, hệ thống tệp, đồng bộ hóa." },
];

// day_of_week: 2 = Thứ 2 ... 7 = Thứ 7. period: tiết học trong ngày (1-12).
const classes = [
  { id: 1, subject_id: 1, class_code: "D22-INT1339-01", teacher_id: 2, semester: "2026.1", max_students: 3, room: "TC-301", day_of_week: 2, start_period: 1, end_period: 3 },
  { id: 2, subject_id: 1, class_code: "D22-INT1339-02", teacher_id: 3, semester: "2026.1", max_students: 40, room: "TC-302", day_of_week: 4, start_period: 7, end_period: 9 },
  { id: 3, subject_id: 2, class_code: "D22-INT1420-01", teacher_id: 2, semester: "2026.1", max_students: 40, room: "TC-201", day_of_week: 2, start_period: 4, end_period: 6 },
  { id: 4, subject_id: 2, class_code: "D22-INT1420-02", teacher_id: 4, semester: "2026.1", max_students: 40, room: "TC-202", day_of_week: 5, start_period: 1, end_period: 3 },
  { id: 5, subject_id: 3, class_code: "D22-INT1456-01", teacher_id: 3, semester: "2026.1", max_students: 35, room: "A2-401", day_of_week: 3, start_period: 1, end_period: 3 },
  { id: 6, subject_id: 3, class_code: "D22-INT1456-02", teacher_id: 3, semester: "2026.1", max_students: 35, room: "A2-402", day_of_week: 2, start_period: 1, end_period: 3 },
  { id: 7, subject_id: 4, class_code: "D22-NET1234-01", teacher_id: 4, semester: "2026.1", max_students: 45, room: "B1-101", day_of_week: 6, start_period: 4, end_period: 6 },
  { id: 8, subject_id: 5, class_code: "D22-INT1345-01", teacher_id: 2, semester: "2026.1", max_students: 40, room: "TC-303", day_of_week: 3, start_period: 7, end_period: 9 },
  { id: 9, subject_id: 6, class_code: "D22-MAT1094-01", teacher_id: 4, semester: "2026.1", max_students: 60, room: "A1-101", day_of_week: 5, start_period: 4, end_period: 6 },
  { id: 10, subject_id: 7, class_code: "D22-INT1327-01", teacher_id: 3, semester: "2026.1", max_students: 40, room: "TC-304", day_of_week: 7, start_period: 1, end_period: 3 },
];

// Cố tình để lớp #1 (INT1339-01) gần đầy (max 3 chỗ) để demo trường hợp hết chỗ,
// và cho sinh viên #5 đăng ký sẵn 1 lớp để demo trường hợp trùng lịch (lớp #6 cùng
// giờ Thứ 2 tiết 1-3 với lớp #3 mà sinh viên #5 sẽ thử đăng ký thêm).
const registrations = [
  { id: 1, student_id: 5, class_id: 3, status: "REGISTERED", registered_at: new Date().toISOString() },
  { id: 2, student_id: 6, class_id: 1, status: "REGISTERED", registered_at: new Date().toISOString() },
];

db.reset({ users, subjects, classes, registrations });

console.log("Đã tạo dữ liệu mẫu thành công.");
console.log("Tài khoản demo (mật khẩu chung: 123456):");
console.log("  Admin    : admin@ptit.edu.vn");
console.log("  Giảng viên: teacher1@ptit.edu.vn / teacher2@ptit.edu.vn / teacher3@ptit.edu.vn");
console.log("  Sinh viên : sv1@ptit.edu.vn / sv2@ptit.edu.vn");
