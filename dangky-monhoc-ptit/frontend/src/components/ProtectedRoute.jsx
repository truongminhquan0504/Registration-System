import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * Bọc quanh một trang cần đăng nhập. Truyền `roles` để giới hạn thêm theo
 * vai trò (vd. chỉ ADMIN). Chưa đăng nhập -> về trang đăng nhập, nhớ luôn
 * đường dẫn muốn tới để quay lại sau khi đăng nhập thành công.
 */
export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="page-loading">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
