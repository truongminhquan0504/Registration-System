# 🎓 Hệ thống Đăng ký Tín chỉ & Quản lý Học phần — PTIT

Hệ thống web hỗ trợ **Sinh viên**, **Giảng viên** và **Quản trị viên** trong quy trình quản lý môn học, mở lớp học phần, đăng ký tín chỉ trực tuyến và theo dõi thời khóa biểu tại **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**.

Dự án được thiết kế theo kiến trúc **Client–Server (RESTful API)** tách biệt rõ ràng giữa **Backend (Node.js/Express)** và **Frontend (React 19 + Vite)**, đảm bảo tính mô-đun, dễ triển khai và mở rộng.

---

## ✨ Tính năng nổi bật

### 👨‍🎓 Phân hệ Sinh viên (`STUDENT`)
- **Tra cứu & Lọc lớp học phần**: Tìm kiếm theo mã môn, tên môn học, lọc theo học kỳ và môn học cụ thể.
- **Đăng ký tín chỉ thông minh**: Tự động kiểm tra và ngăn chặn các trường hợp không hợp lệ:
  - Chặn đăng ký trùng lớp học phần đã đăng ký.
  - Chặn đăng ký nhiều lớp của cùng một môn học trong cùng học kỳ.
  - Chặn đăng ký khi lớp học phần đã đủ sĩ số tối đa.
  - Tự động phát hiện và cảnh báo **trùng lịch học** (trùng thứ và giao nhau về tiết học).
- **Quản lý môn đã đăng ký**: Theo dõi tổng số môn, tổng số tín chỉ tích lũy trong kỳ và hủy đăng ký học phần.
- **Thời khóa biểu trực quan**: Hiển thị lịch học cá nhân dạng lưới theo tuần (Thứ 2 – Thứ 7, Tiết 1 – Tiết 12).

### 👨‍🏫 Phân hệ Giảng viên (`TEACHER`)
- **Quản lý lớp giảng dạy**: Xem danh sách các lớp học phần được phân công phụ trách trong học kỳ.
- **Theo dõi sĩ số & Danh sách lớp**: Xem chi tiết danh sách sinh viên đã đăng ký vào từng lớp học phần (họ tên, email, thời gian đăng ký).

### 🛡️ Phân hệ Quản trị viên (`ADMIN`)
- **Quản lý danh mục môn học**: Thêm mới, cập nhật thông tin (mã môn, tên môn, số tín chỉ, khoa/bộ môn, mô tả) và xóa môn học.
- **Quản lý lớp học phần**: Mở lớp học phần mới, phân công giảng viên giảng dạy, thiết lập lịch học (thứ, tiết bắt đầu, tiết kết thúc, phòng học) và giới hạn sĩ số tối đa.
- **Quản lý người dùng & Phân quyền**: Xem danh sách toàn bộ tài khoản trên hệ thống, lọc theo vai trò và cấp/thay đổi quyền (`ADMIN`, `TEACHER`, `STUDENT`).

---

## 🛠️ Công nghệ sử dụng

| Tầng | Công nghệ / Thư viện | Mục đích |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8 | Xây dựng giao diện người dùng (SPA) tốc độ cao |
| **Routing** | React Router DOM v7 | Điều hướng client-side & bảo vệ route theo vai trò (`ProtectedRoute`) |
| **Styling** | CSS Variables (Design Tokens) | Hệ thống giao diện đồng nhất theo nhận diện thương hiệu PTIT |
| **Backend** | Node.js (ES Modules), Express 4 | Xây dựng RESTful API xử lý nghiệp vụ |
| **Bảo mật** | JSON Web Token (`jsonwebtoken`), `bcryptjs` | Xác thực stateless qua Bearer Token & mã hóa mật khẩu |
| **Lưu trữ** | JSON Data Store (`src/data/store.js`) | Tầng lưu trữ trừu tượng hóa trên file JSON, chạy ngay không cần cài đặt DB rời |

---

## 📂 Cấu trúc thư mục

```text
Registration-System/
└── dangky-monhoc-ptit/
    ├── backend/                        # RESTful API Server (Node.js + Express)
    │   ├── src/
    │   │   ├── controllers/            # Xử lý logic nghiệp vụ cho từng tài nguyên
    │   │   ├── data/                   # Tầng truy xuất dữ liệu (store.js) & khởi tạo dữ liệu mẫu (seed.js)
    │   │   ├── middleware/             # Middleware xác thực JWT, phân quyền Role & xử lý lỗi tập trung
    │   │   ├── routes/                 # Định nghĩa các tuyến API (/api/*)
    │   │   ├── utils/                  # Tiện ích ký/xác thực JWT & thuật toán kiểm tra trùng lịch học
    │   │   ├── app.js                  # Khởi tạo ứng dụng Express & gắn middleware
    │   │   └── server.js               # Điểm vào (Entry point) khởi chạy HTTP Server
    │   ├── .env.example                # Mẫu cấu hình biến môi trường
    │   └── package.json
    │
    └── frontend/                       # Giao diện người dùng (React 19 + Vite)
        ├── public/                     # Tài nguyên tĩnh (favicon, ...)
        ├── src/
        │   ├── components/             # Các component dùng chung (Navbar, Logo, ProtectedRoute, Icons)
        │   ├── context/                # Quản lý trạng thái đăng nhập toàn cục (AuthContext)
        │   ├── pages/                  # Các trang giao diện theo phân quyền (student/, teacher/, admin/)
        │   ├── services/               # Tầng giao tiếp HTTP API (api.js)
        │   ├── styles/                 # Hệ thống Design Tokens (tokens.css) & CSS toàn cục
        │   ├── utils/                  # Hàm định dạng thời gian, lịch học
        │   ├── App.jsx                 # Cấu hình định tuyến ứng dụng
        │   └── main.jsx                # Điểm vào ứng dụng React
        ├── index.html
        ├── vite.config.js
        └── package.json
```

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản `>= 18.x` (khuyến nghị `20.x` LTS trở lên)
- **npm**: Đi kèm khi cài đặt Node.js

### 2. Khởi chạy Backend (API Server)

Mở một cửa sổ Terminal và thực hiện:

```bash
cd dangky-monhoc-ptit/backend

# Cài đặt thư viện phụ thuộc
npm install

# Tạo file biến môi trường từ file mẫu (nếu chưa có)
cp .env.example .env

# (Tùy chọn) Khởi tạo hoặc đặt lại dữ liệu mẫu ban đầu
npm run seed

# Chạy server ở chế độ phát triển (tự động reload khi sửa code)
npm run dev
```
> **Lưu ý**: Nếu chưa chạy `npm run seed`, ở lần khởi động đầu tiên, server sẽ tự động tạo file `src/data/db.json` với đầy đủ dữ liệu mẫu.
> API sẽ hoạt động tại: **`http://localhost:5000/api`**

### 3. Khởi chạy Frontend (Web Client)

Mở một cửa sổ Terminal thứ hai và thực hiện:

```bash
cd dangky-monhoc-ptit/frontend

# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy máy chủ phát triển Vite
npm run dev
```
> Truy cập ứng dụng trên trình duyệt tại địa chỉ: **`http://localhost:5173`**

---

## ⚙️ Cấu hình biến môi trường

### Backend (`dangky-monhoc-ptit/backend/.env`)

| Biến | Giá trị mặc định | Mô tả |
| :--- | :--- | :--- |
| `PORT` | `5000` | Cổng lắng nghe của máy chủ API |
| `JWT_SECRET` | `doi-chuoi-bi-mat-nay-truoc-khi-trien-khai-that` | Khóa bí mật dùng để ký và xác thực JWT |
| `JWT_EXPIRES_IN` | `7d` | Thời hạn hiệu lực của token đăng nhập |

### Frontend (`dangky-monhoc-ptit/frontend/.env` — *Tùy chọn*)

| Biến | Giá trị mặc định | Mô tả |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:5000/api` | Đường dẫn gốc tới Backend API |

---

## 🔑 Tài khoản Demo có sẵn

Sau khi chạy dữ liệu mẫu (`seed`), bạn có thể đăng nhập ngay bằng các tài khoản dưới đây.
Mật khẩu chung cho tất cả tài khoản demo: **`123456`**

| Vai trò | Email đăng nhập | Ghi chú |
| :--- | :--- | :--- |
| **Quản trị viên (`ADMIN`)** | `admin@ptit.edu.vn` | Toàn quyền quản trị môn học, lớp học phần và tài khoản |
| **Giảng viên (`TEACHER`)** | `teacher1@ptit.edu.vn`<br>`teacher2@ptit.edu.vn`<br>`teacher3@ptit.edu.vn` | TS. Nguyễn Văn An<br>ThS. Trần Thị Bình<br>TS. Lê Hoàng Cường |
| **Sinh viên (`STUDENT`)** | `sv1@ptit.edu.vn`<br>`sv2@ptit.edu.vn` | Phạm Minh Đức (đã có sẵn 2 lớp mẫu)<br>Hoàng Thu Hà (đã có sẵn 1 lớp mẫu) |

*(Ngoài ra, bạn có thể tự tạo tài khoản sinh viên mới tại trang **Đăng ký** `/register`).*

---

## 📡 Tổng quan REST API Endpoints

Tất cả các endpoint đều bắt đầu với tiền tố `/api`:

| Nhóm | Phương thức & Đường dẫn | Quyền truy cập | Mô tả |
| :--- | :--- | :--- | :--- |
| **Health** | `GET /api/health` | Công khai | Kiểm tra trạng thái hoạt động của server |
| **Auth** | `POST /api/auth/register` | Công khai | Đăng ký tài khoản sinh viên mới |
| | `POST /api/auth/login` | Công khai | Đăng nhập và nhận JWT token |
| | `GET /api/auth/me` | Đã đăng nhập | Lấy thông tin người dùng hiện tại từ token |
| **Subjects** | `GET /api/subjects` | Công khai | Lấy danh sách môn học (hỗ trợ tìm kiếm `?q=`) |
| | `POST /api/subjects` | `ADMIN` | Thêm môn học mới |
| | `PUT /api/subjects/:id` | `ADMIN` | Cập nhật thông tin môn học |
| | `DELETE /api/subjects/:id` | `ADMIN` | Xóa môn học (nếu chưa có lớp học phần mở) |
| **Classes** | `GET /api/classes` | Công khai | Danh sách lớp học phần (lọc theo `subject_id`, `semester`, `teacher_id`, `q`) |
| | `GET /api/classes/teaching/me` | `TEACHER` | Danh sách lớp do giảng viên hiện tại phụ trách |
| | `GET /api/classes/:id/roster` | `TEACHER` / `ADMIN` | Xem danh sách sinh viên đã đăng ký trong lớp |
| | `POST /api/classes` | `ADMIN` | Mở lớp học phần mới |
| | `PUT /api/classes/:id` | `ADMIN` | Cập nhật lớp học phần / phân công giảng viên |
| | `DELETE /api/classes/:id` | `ADMIN` | Xóa lớp học phần |
| **Registrations** | `GET /api/registrations/me` | `STUDENT` | Danh sách học phần sinh viên đã đăng ký |
| | `GET /api/registrations/me/schedule` | `STUDENT` | Dữ liệu thời khóa biểu cá nhân của sinh viên |
| | `POST /api/registrations` | `STUDENT` | Đăng ký lớp học phần (kiểm tra trùng lịch, sĩ số, trùng môn) |
| | `POST /api/registrations/:id/cancel` | `STUDENT` | Hủy đăng ký lớp học phần |
| **Users** | `GET /api/users` | `ADMIN` | Danh sách người dùng (hỗ trợ lọc `?role=`) |
| | `PUT /api/users/:id/role` | `ADMIN` | Thay đổi vai trò người dùng |

---

## 🧭 Định hướng mở rộng

- Kiểm tra chống trùng lịch giảng dạy của giảng viên và trùng phòng học khi Admin tạo/cập nhật lớp học phần.
- Giới hạn số tín chỉ tối thiểu/tối đa được phép đăng ký trong một học kỳ.
- Xuất thời khóa biểu và phiếu đăng ký học phần sang định dạng PDF / Excel.
- Chuyển đổi tầng lưu trữ dữ liệu trong `backend/src/data/store.js` sang hệ quản trị cơ sở dữ liệu quan hệ (PostgreSQL / MySQL) cho môi trường Production.
