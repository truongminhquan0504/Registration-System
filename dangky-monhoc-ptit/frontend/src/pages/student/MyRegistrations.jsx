import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { formatDate } from "../../utils/format";

const SEMESTER = "2026.1";

export default function MyRegistrations() {
  const { token } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingId, setPendingId] = useState(null);

  async function load() {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.getMyRegistrations(token, { semester: SEMESTER });
      setRegistrations(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCredits = registrations.reduce((sum, r) => sum + (r.class.subject?.credits ?? 0), 0);

  const handleCancel = async (registrationId, classCode) => {
    if (!window.confirm(`Hủy đăng ký lớp ${classCode}?`)) return;
    setNotice("");
    setError("");
    setPendingId(registrationId);
    try {
      await api.cancelRegistration(registrationId, token);
      setNotice(`Đã hủy đăng ký lớp ${classCode}.`);
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
            <h1 className="page__title">Môn học đã đăng ký</h1>
            <p className="page__subtitle">
              Học kỳ {SEMESTER} • Tổng {registrations.length} lớp • {totalCredits} tín chỉ
            </p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {notice && <p className="alert alert--success" role="status">{notice}</p>}

        {isLoading ? (
          <p className="empty-state">Đang tải...</p>
        ) : registrations.length === 0 ? (
          <p className="empty-state">Bạn chưa đăng ký môn học nào trong học kỳ này.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã lớp</th>
                  <th>Môn học</th>
                  <th>Tín chỉ</th>
                  <th>Lịch học</th>
                  <th>Giảng viên</th>
                  <th>Ngày đăng ký</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.registration_id}>
                    <td>{r.class.class_code}</td>
                    <td>{r.class.subject?.name}</td>
                    <td>{r.class.subject?.credits}</td>
                    <td>{r.class.schedule_text}</td>
                    <td>{r.class.teacher?.name ?? "—"}</td>
                    <td>{formatDate(r.registered_at)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        disabled={pendingId === r.registration_id}
                        onClick={() => handleCancel(r.registration_id, r.class.class_code)}
                      >
                        {pendingId === r.registration_id ? "Đang hủy..." : "Hủy đăng ký"}
                      </button>
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
