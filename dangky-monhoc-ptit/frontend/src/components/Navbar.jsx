import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "./Logo";
import { IconClose, IconMenu } from "./Icons";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const GUEST_LINKS = [{ label: "Trang chủ", to: "/" }];

const STUDENT_LINKS = [
  { label: "Đăng ký môn học", to: "/dang-ky" },
  { label: "Môn đã đăng ký", to: "/da-dang-ky" },
  { label: "Thời khóa biểu", to: "/thoi-khoa-bieu" },
];

const TEACHER_LINKS = [{ label: "Lớp giảng dạy", to: "/giang-day" }];

const ADMIN_LINKS = [
  { label: "Môn học", to: "/quan-tri/mon-hoc" },
  { label: "Lớp học phần", to: "/quan-tri/lop-hoc-phan" },
  { label: "Tài khoản", to: "/quan-tri/tai-khoan" },
];

function linksForRole(role) {
  if (role === "STUDENT") return STUDENT_LINKS;
  if (role === "TEACHER") return TEACHER_LINKS;
  if (role === "ADMIN") return ADMIN_LINKS;
  return GUEST_LINKS;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px)");
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  const links = linksForRole(user?.role);
  const isActive = (to) => location.pathname === to;

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link className="navbar__brand" to="/" onClick={closeMenu}>
          <Logo />
          <span className="sr-only">
            Đăng ký môn học Học viện Công nghệ Bưu chính Viễn thông — về trang chủ
          </span>
        </Link>

        <nav className="navbar__nav" aria-label="Điều hướng chính">
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  className={`navbar__link${isActive(link.to) ? " navbar__link--active" : ""}`}
                  to={link.to}
                  aria-current={isActive(link.to) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <span className="navbar__user" title={user.email}>
                Xin chào, <strong>{user.name}</strong>
              </span>
              <button type="button" className="btn btn--secondary" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn--ghost" to="/login">
                Đăng nhập
              </Link>
              <Link className="btn btn--primary" to="/register">
                Đăng ký tài khoản
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      <div
        id="navbar-mobile"
        className={`navbar__mobile${menuOpen ? " navbar__mobile--open" : ""}`}
        hidden={!menuOpen}
      >
        <nav className="container" aria-label="Điều hướng chính (mobile)">
          <ul className="navbar__mobile-links">
            {links.map((link) => (
              <li key={link.to}>
                <Link className="navbar__mobile-link" to={link.to} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar__mobile-actions">
            {isAuthenticated ? (
              <>
                <p className="navbar__mobile-user">
                  Xin chào, <strong>{user.name}</strong>
                  <span className="navbar__mobile-email">{user.email}</span>
                </p>
                <button type="button" className="btn btn--secondary btn--block" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn--secondary btn--block" to="/login" onClick={closeMenu}>
                  Đăng nhập
                </Link>
                <Link className="btn btn--primary btn--block" to="/register" onClick={closeMenu}>
                  Đăng ký tài khoản
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
