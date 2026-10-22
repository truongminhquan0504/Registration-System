import { verifyToken } from "../utils/jwt.js";
import { db } from "../data/store.js";

/** Bắt buộc phải đăng nhập. Gắn `req.user` (không có password) nếu hợp lệ. */
export function authenticate(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục." });
  }

  try {
    const payload = verifyToken(token);
    const user = db.users.find((u) => u.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Tài khoản không còn tồn tại." });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch {
    return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
  }
}

/** Chỉ cho phép một số role nhất định (dùng sau `authenticate`). */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này." });
    }
    next();
  };
}
