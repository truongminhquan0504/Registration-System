import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  }

  return errors;
}

/** Trang chủ mặc định theo vai trò sau khi đăng nhập. */
function homeFor(role) {
  if (role === "STUDENT") return "/dang-ky";
  if (role === "TEACHER") return "/giang-day";
  if (role === "ADMIN") return "/quan-tri/mon-hoc";
  return "/";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [values, setValues] = useState({
    email: location.state?.registeredEmail ?? "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const justRegistered = Boolean(location.state?.registeredEmail);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError("");
      return;
    }

    setErrors({});
    setFormError("");
    setIsSubmitting(true);

    try {
      const user = await login({
        email: values.email.trim(),
        password: values.password,
      });

      const redirectTo = location.state?.from ?? homeFor(user.role);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(
        error.status === 401 ? "Email hoặc mật khẩu không đúng." : error.message
      );
      setValues((current) => ({ ...current, password: "" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth__inner">
        <div className="auth__head">
          <Logo />
          <h1 className="auth__title">Đăng nhập</h1>
          <p className="auth__subtitle">
            Đăng nhập để đăng ký môn học và xem thời khóa biểu của bạn.
          </p>
        </div>

        <div className="auth__card">
          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {justRegistered && !formError && (
              <p className="auth__alert auth__alert--success" role="status">
                Đăng ký thành công. Mời bạn đăng nhập.
              </p>
            )}

            {formError && (
              <p className="auth__alert auth__alert--error" role="alert">
                {formError}
              </p>
            )}

            <div className="field">
              <label className="field__label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`field__input${errors.email ? " field__input--error" : ""}`}
                placeholder="ten@ptit.edu.vn"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "login-email-error" : undefined}
              />
              {errors.email && (
                <p className="field__error" id="login-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="login-password">
                Mật khẩu
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                className={`field__input${errors.password ? " field__input--error" : ""}`}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
              />
              {errors.password && (
                <p className="field__error" id="login-password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>

          <p className="auth__footer">
            Chưa có tài khoản?{" "}
            <Link className="auth__link" to="/register">
              Đăng ký
            </Link>
          </p>
        </div>

        <p className="auth__note">
          Tài khoản demo (mật khẩu <strong>123456</strong>): admin@ptit.edu.vn ·
          teacher1@ptit.edu.vn · sv1@ptit.edu.vn
        </p>
      </div>
    </section>
  );
}
