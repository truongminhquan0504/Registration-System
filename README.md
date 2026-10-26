# Hệ thống Đăng ký Tín chỉ & Quản lý Học phần — PTIT

Chào mừng bạn đến với kho mã nguồn dự án **Hệ thống Đăng ký Môn học — PTIT**. Mã nguồn chính của ứng dụng được đặt trong thư mục [`dangky-monhoc-ptit/`](./dangky-monhoc-ptit).

**Xem tài liệu chi tiết đầy đủ tại: [`dangky-monhoc-ptit/README.md`](./dangky-monhoc-ptit/README.md)**

---

## Khởi chạy nhanh (Quick Start)

### Cách 1: Chạy tự động bằng 1 cú click (Windows)
Nhấp đúp chuột vào file **[`run-dev.bat`](./run-dev.bat)** ở thư mục gốc (hoặc gõ `.\run-dev.bat` trong Terminal). Script sẽ tự động:
1. Tạo file `.env` từ `.env.example` (nếu chưa có).
2. Tự động chạy `npm install` nếu thiếu `node_modules`.
3. Bật đồng thời cả **Backend API** (`http://localhost:5000/api`) và **Frontend Web** (`http://localhost:5173`).
4. Tự động mở trình duyệt truy cập vào trang web.

---

### Cách 2: Chạy thủ công qua Terminal

#### 1. Chạy Backend API (`http://localhost:5000/api`)
```bash
cd dangky-monhoc-ptit/backend
npm install
npm run dev
```

#### 2. Chạy Frontend Web (`http://localhost:5173`)
```bash
cd dangky-monhoc-ptit/frontend
npm install
npm run dev
```

---

### 🔑 Tài khoản thử nghiệm (Mật khẩu: `123456`)
- **Quản trị viên**: `admin@ptit.edu.vn`
- **Giảng viên**: `teacher1@ptit.edu.vn`, `teacher2@ptit.edu.vn`, `teacher3@ptit.edu.vn`
- **Sinh viên**: `sv1@ptit.edu.vn`, `sv2@ptit.edu.vn`
