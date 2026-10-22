import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { ROLE_LABELS, formatDate } from "../../utils/format";

const ROLES = ["STUDENT", "TEACHER", "ADMIN"];

export default function ManageUsers() {
  const { token, user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingId, setPendingId] = useState(null);

  async function load() {
    setIsLoading(true);
    try {
      const res = await api.getUsers(token, roleFilter ? { role: roleFilter } : undefined);
      setUsers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleRoleChange = async (userId, role) => {
    setError("");
    setNotice("");
    setPendingId(userId);
    try {
      await api.updateUserRole(userId, role, token);
      setNotice("Đã cập nhật vai trò tài khoản.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="page__header">
          <div>
            <h1 className="page__title">Quản lý tài khoản</h1>
            <p className="page__subtitle">Xem danh sách người dùng và cấp/đổi vai trò.</p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {notice && <p className="alert alert--success" role="status">{notice}</p>}

        <div className="toolbar">
          <div className="toolbar__field">
            <label htmlFor="filter-role">Vai trò</label>
            <select id="filter-role" className="select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Tất cả</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="empty-state">Đang tải...</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>MSSV</th>
                  <th>Ngày tạo</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.student_code ?? "—"}</td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      <select
                        className="select"
                        value={u.role}
                        disabled={u.id === currentUser.id || pendingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
