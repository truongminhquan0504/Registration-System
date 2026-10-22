import { Navigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Home.css";

function homeFor(role) {
  if (role === "STUDENT") return "/dang-ky";
  if (role === "TEACHER") return "/giang-day";
  if (role === "ADMIN") return "/quan-tri/mon-hoc";
  return null;
}

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="page-loading">Đang tải...</div>;

  if (isAuthenticated) {
    const target = homeFor(user.role);
    if (target) return <Navigate to={target} replace />;
  }

  return (
    <section className="home-hero section">
      <div className="container home-hero__inner">
        <p className="overline">Học viện Công nghệ Bưu chính Viễn thông</p>
        <h1 className="home-hero__title">Hệ thống đăng ký môn học</h1>
        <p className="home-hero__lead">
          Đăng ký lớp học phần, kiểm tra trùng lịch tự động và xem thời khóa biểu
          cá nhân chỉ trong vài bước.
        </p>
        <div className="home-hero__actions">
          <Link className="btn btn--primary btn--lg" to="/register">
            Tạo tài khoản sinh viên
          </Link>
          <Link className="btn btn--ghost btn--lg" to="/login">
            Đăng nhập
          </Link>
        </div>

        <div className="home-hero__features">
          <div className="home-hero__feature">
            <h3>Đăng ký nhanh</h3>
            <p>Xem danh sách lớp học phần còn chỗ trống theo từng môn, đăng ký chỉ với một cú nhấp.</p>
          </div>
          <div className="home-hero__feature">
            <h3>Chống trùng lịch</h3>
            <p>Hệ thống tự động từ chối nếu lớp bạn chọn trùng giờ với môn đã đăng ký.</p>
          </div>
          <div className="home-hero__feature">
            <h3>Thời khóa biểu trực quan</h3>
            <p>Xem lịch học theo tuần, tổng số tín chỉ đã đăng ký trong học kỳ.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
