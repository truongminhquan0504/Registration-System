# Backend — API Đăng ký môn học

Node.js + Express. Dữ liệu lưu tại `src/data/db.json` (tự tạo khi seed/chạy
lần đầu).

## Cài đặt

```bash
npm install
cp .env.example .env
npm run seed     # tạo dữ liệu mẫu
npm run dev       # chạy với --watch, tự restart khi sửa code
# hoặc: npm start
```

Mặc định chạy tại `http://localhost:5000`, tất cả API nằm dưới `/api`.

## Các nhóm API chính

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/subjects` (công khai) · `POST/PUT/DELETE /api/subjects` (Admin)
- `GET /api/classes` (công khai, hỗ trợ lọc `subject_id`, `semester`,
  `teacher_id`, `q`) · `POST/PUT/DELETE /api/classes` (Admin)
- `GET /api/classes/teaching/me` (Giảng viên) · `GET /api/classes/:id/roster`
  (Giảng viên/Admin)
- `POST /api/registrations` (đăng ký), `POST /api/registrations/:id/cancel`
  (hủy), `GET /api/registrations/me`, `GET /api/registrations/me/schedule`
  — tất cả chỉ dành cho Sinh viên
- `GET /api/users`, `PUT /api/users/:id/role` (Admin)

## Ghi chú thiết kế

- Mật khẩu băm bằng `bcryptjs` (thuần JS, không cần biên dịch native — chạy
  ổn định trên mọi môi trường).
- Đăng ký môn học kiểm tra theo thứ tự: đã đăng ký lớp này chưa → đã học môn
  này ở lớp khác trong cùng học kỳ chưa → còn chỗ trống không → có trùng
  lịch với lớp đã đăng ký khác không (`src/utils/schedule.js`).
- Muốn xóa toàn bộ dữ liệu và làm lại từ đầu: chạy lại `npm run seed`.
