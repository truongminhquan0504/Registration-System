import { Link } from "react-router-dom";

import "./AuthPage.css";

export default function NotFound() {
  return (
    <section className="auth">
      <div className="auth__inner">
        <div className="auth__head">
          <h1 className="auth__title">Không tìm thấy trang</h1>
          <p className="auth__subtitle">
            Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.
          </p>
        </div>
        <div className="auth__card" style={{ textAlign: "center" }}>
          <Link className="btn btn--primary btn--lg" to="/">
            Về trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
}
