import bcrypt from "bcryptjs";

import { db } from "../data/store.js";
import { signToken } from "../utils/jwt.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toSafeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

/** Đăng ký tài khoản. Cố ý luôn gán role = STUDENT — không nhận role từ client. */
export function register(req, res) {
  const { name, email, password, student_code } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu." });
  }
  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: "Email không đúng định dạng." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
  }
  if (db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ message: "Email này đã được đăng ký." });
  }

  const user = db.users.insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role: "STUDENT",
    student_code: student_code?.trim() || null,
    created_at: new Date().toISOString(),
  });

  return res.status(201).json({ data: toSafeUser(user) });
}

export function login(req, res) {
  const { email, password } = req.body ?? {};

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
  }

  const token = signToken({ sub: user.id, role: user.role });
  return res.json({ data: { token, user: toSafeUser(user) } });
}

export function me(req, res) {
  return res.json({ data: req.user });
}
