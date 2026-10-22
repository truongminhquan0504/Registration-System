import { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as api from "../services/api";

/**
 * Quản lý trạng thái đăng nhập cho toàn ứng dụng.
 *
 * Khi ứng dụng khởi động: nếu localStorage có token thì gọi GET /auth/me để
 * xác nhận token còn hợp lệ. Token hỏng hoặc hết hạn sẽ bị xóa và đưa về
 * trạng thái chưa đăng nhập.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lấy sẵn user đã lưu để giao diện không bị nháy khi tải lại trang
  const [user, setUser] = useState(() => api.storage.getUser());
  const [token, setToken] = useState(() => api.storage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = api.storage.getToken();

    if (!savedToken) {
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;

    api
      .getCurrentUser(savedToken)
      .then((response) => {
        if (cancelled) return;
        setUser(response.data);
        setToken(savedToken);
        api.storage.save(savedToken, response.data);
      })
      .catch((error) => {
        if (cancelled) return;

        // Token sai hoặc hết hạn -> đăng xuất.
        // Riêng lỗi mạng (status 0) thì giữ nguyên phiên, vì có thể chỉ do
        // backend đang tắt chứ token vẫn còn hạn.
        if (error.status !== 0) {
          api.storage.clear();
          setUser(null);
          setToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** Đăng nhập rồi lưu phiên. Ném lỗi để trang Login hiển thị thông báo. */
  const login = useCallback(async (credentials) => {
    const response = await api.login(credentials);
    const { token: newToken, user: newUser } = response.data;

    api.storage.save(newToken, newUser);
    setToken(newToken);
    setUser(newUser);

    return newUser;
  }, []);

  const register = useCallback((payload) => api.register(payload), []);

  const logout = useCallback(() => {
    api.storage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    isStudent: user?.role === "STUDENT",
    isTeacher: user?.role === "TEACHER",
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong <AuthProvider>.");
  }
  return context;
}

export default AuthContext;
