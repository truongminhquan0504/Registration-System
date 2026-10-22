import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

const EMPTY = { name: "", email: "", student_code: "", password: "", confirmPassword: "" };

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Vui lòng nhập họ và tên.";
  } else if (values.name.trim().length > 100) {
    errors.name = "Họ và tên không được dài quá 100 ký tự.";
  }

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!values.student_code.trim()) {
    errors.student_code = "Vui lòng nhập mã số sinh viên.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }

  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Cố ý không gửi `role` — backend luôn tạo tài khoản với quyền STUDENT
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        student_code: values.student_code.trim(),
        password: values.password,
      });

      setSuccessMessage("Đăng ký thành công. Đang chuyển tới trang đăng nhập…");
      setValues(EMPTY);

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { registeredEmail: values.email.trim() },
        });
      }, 1200);
    } catch (error) {
      if (error.status === 409) {
        setErrors({ email: "Email này đã được đăng ký." });
      } else {
        setFormError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth__inner">
        <div className="auth__head">
          <Logo />
          <h1 className="auth__title">Tạo tài khoản sinh viên</h1>
          <p className="auth__subtitle">Đăng ký tài khoản để đăng ký môn học mỗi học kỳ.</p>
        </div>

        <div className="auth__card">
          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {successMessage && (
              <p className="auth__alert auth__alert--success" role="status">
                {successMessage}
              </p>
            )}

            {formError && (
              <p className="auth__alert auth__alert--error" role="alert">
                {formError}
              </p>
            )}

            <div className="field">
              <label className="field__label" htmlFor="register-name">
                Họ và tên
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                className={`field__input${errors.name ? " field__input--error" : ""}`}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "register-name-error" : undefined}
              />
              {errors.name && (
                <p className="field__error" id="register-name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-student-code">
                Mã số sinh viên
              </label>
              <input
                id="register-student-code"
                name="student_code"
                type="text"
                className={`field__input${errors.student_code ? " field__input--error" : ""}`}
                placeholder="B21DCCNxxx"
                value={values.student_code}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.student_code)}
                aria-describedby={errors.student_code ? "register-student-code-error" : undefined}
              />
              {errors.student_code && (
                <p className="field__error" id="register-student-code-error">
                  {errors.student_code}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                className={`field__input${errors.email ? " field__input--error" : ""}`}
                placeholder="ten@ptit.edu.vn"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "register-email-error" : undefined}
              />
              {errors.email && (
                <p className="field__error" id="register-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-password">
                Mật khẩu
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                className={`field__input${errors.password ? " field__input--error" : ""}`}
                placeholder="Ít nhất 6 ký tự"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "register-password-error" : undefined}
              />
              {errors.password && (
                <p className="field__error" id="register-password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="register-confirm">
                Xác nhận mật khẩu
              </label>
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                className={`field__input${errors.confirmPassword ? " field__input--error" : ""}`}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
              />
              {errors.confirmPassword && (
                <p className="field__error" id="register-confirm-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký…" : "Đăng ký"}
            </button>
          </form>

          <p className="auth__footer">
            Đã có tài khoản?{" "}
            <Link className="auth__link" to="/login">
              Đăng nhập
            </Link>
          </p>
        </div>

        <p className="auth__note">
          Tài khoản mới mặc định là tài khoản sinh viên. Tài khoản giảng viên / quản
          trị do quản trị viên cấp riêng.
        </p>
      </div>
    </section>
  );
}
