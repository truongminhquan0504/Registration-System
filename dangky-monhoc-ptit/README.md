# Hệ thống Đăng ký môn học — PTIT

Đồ án xây dựng theo khung code của dự án "Học liệu PTIT" (React 19 + Vite +
React Router, `AuthContext` + JWT, `services/api.js` dạng wrapper `request()`,
design token trong `tokens.css`). Gồm 2 phần độc lập: `backend/` (API) và
`frontend/` (giao diện web).

## Kiến trúc

```
dangky-monhoc-ptit/
├── backend/     API Node.js/Express, dữ liệu lưu file JSON (backend/src/data/db.json)
└── frontend/    Giao diện React (Vite)
```

**Vì sao lưu dữ liệu bằng file JSON thay vì SQL?** Để đồ án chạy được ngay
trên máy bất kỳ mà không cần cài đặt/thiết lập một hệ quản trị CSDL rời. Toàn
bộ việc đọc/ghi dữ liệu được gói gọn trong `backend/src/data/store.js` — nếu
sau này muốn đổi sang PostgreSQL/MySQL, chỉ cần viết lại file này, các
controller phía trên không cần sửa.

## Vai trò & tính năng

| Vai trò | Tính năng |
|---|---|
| **Sinh viên** | Xem danh sách môn học/lớp học phần, đăng ký & hủy đăng ký (tự động chặn trùng lịch, trùng môn, hết chỗ), xem thời khóa biểu cá nhân theo tuần |
| **Giảng viên** | Xem danh sách lớp mình giảng dạy, xem danh sách sinh viên đã đăng ký từng lớp |
| **Quản trị viên** | Quản lý (thêm/sửa/xóa) môn học, lớp học phần (phân công giảng viên, xếp lịch), quản lý vai trò tài khoản |

## Chạy dự án

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # có thể sửa JWT_SECRET nếu muốn
npm run seed               # khởi tạo dữ liệu mẫu (chạy 1 lần)
npm run dev                 # http://localhost:5000/api
```

> Nếu bỏ qua bước `npm run seed`, server sẽ tự seed dữ liệu mẫu trong lần
> chạy `npm run dev`/`npm start` đầu tiên.

### 2. Frontend

Mở một terminal khác:

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Frontend gọi API tại `http://localhost:5000/api` theo mặc định. Muốn đổi thì
tạo file `frontend/.env` với nội dung `VITE_API_URL=http://<host>:<port>/api`.

## Tài khoản demo

Mật khẩu chung cho mọi tài khoản demo: **`123456`**

| Vai trò | Email |
|---|---|
| Quản trị viên | `admin@ptit.edu.vn` |
| Giảng viên | `teacher1@ptit.edu.vn`, `teacher2@ptit.edu.vn`, `teacher3@ptit.edu.vn` |
| Sinh viên | `sv1@ptit.edu.vn`, `sv2@ptit.edu.vn` |

Có thể tự tạo thêm tài khoản sinh viên qua trang **Đăng ký tài khoản**.

## Luồng demo gợi ý

1. Đăng nhập `sv1@ptit.edu.vn` → vào **Đăng ký môn học**, thử đăng ký một lớp
   đang trùng giờ với lớp đã có sẵn (sv1 đã có sẵn lớp *Cấu trúc dữ liệu*,
   Thứ 2 tiết 4–6) để thấy thông báo lỗi trùng lịch.
2. Đăng ký một lớp khác không trùng giờ → xem lại ở **Môn đã đăng ký** và
   **Thời khóa biểu**.
3. Đăng nhập `teacher1@ptit.edu.vn` → vào **Lớp giảng dạy** → bấm "Xem sinh
   viên" để xem danh sách sinh viên đã đăng ký.
4. Đăng nhập `admin@ptit.edu.vn` → **Quản trị / Lớp học phần** → mở thêm một
   lớp mới, thử để trùng giờ với lớp đã tồn tại của cùng giảng viên (hệ thống
   hiện chỉ chặn trùng lịch phía sinh viên; có thể mở rộng chặn trùng lịch
   giảng viên nếu đồ án yêu cầu).

## Có thể mở rộng thêm

- Chặn giảng viên bị xếp trùng lịch giữa các lớp.
- Giới hạn số tín chỉ tối đa được đăng ký mỗi học kỳ.
- Xuất phiếu đăng ký học phần dạng PDF.
- Thông báo qua email khi đăng ký/hủy thành công.
- Chuyển tầng lưu trữ từ file JSON sang PostgreSQL/MySQL cho môi trường thật.
