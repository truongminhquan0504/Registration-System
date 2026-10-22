import { Fragment, useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

export default function MyClasses() {
  const { token } = useAuth();

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [roster, setRoster] = useState(null);
  const [rosterLoading, setRosterLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getMyTeachingClasses(token)
      .then((res) => {
        if (!cancelled) setClasses(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const toggleRoster = async (classId) => {
    if (expandedId === classId) {
      setExpandedId(null);
      setRoster(null);
      return;
    }
    setExpandedId(classId);
    setRoster(null);
    setRosterLoading(true);
    try {
      const res = await api.getClassRoster(classId, token);
      setRoster(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRosterLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="page__header">
          <div>
            <h1 className="page__title">Lớp giảng dạy</h1>
            <p className="page__subtitle">Danh sách các lớp học phần bạn phụ trách.</p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}

        {isLoading ? (
          <p className="empty-state">Đang tải...</p>
        ) : classes.length === 0 ? (
          <p className="empty-state">Bạn chưa được phân công lớp nào.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã lớp</th>
                  <th>Môn học</th>
                  <th>Lịch học</th>
                  <th>Sĩ số</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <Fragment key={c.id}>
                    <tr>
                      <td>{c.class_code}</td>
                      <td>{c.subject?.name}</td>
                      <td>{c.schedule_text}</td>
                      <td>
                        {c.registered_count}/{c.max_students}
                      </td>
                      <td>
                        <button type="button" className="btn btn--secondary btn--sm" onClick={() => toggleRoster(c.id)}>
                          {expandedId === c.id ? "Đóng" : "Xem sinh viên"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === c.id && (
                      <tr>
                        <td colSpan={5} style={{ background: "var(--bg-subtle)" }}>
                          {rosterLoading ? (
                            <p className="empty-state">Đang tải danh sách...</p>
                          ) : roster && roster.students.length > 0 ? (
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>MSSV</th>
                                  <th>Họ tên</th>
                                  <th>Email</th>
                                </tr>
                              </thead>
                              <tbody>
                                {roster.students.map((s) => (
                                  <tr key={s.registration_id}>
                                    <td>{s.student?.student_code ?? "—"}</td>
                                    <td>{s.student?.name}</td>
                                    <td>{s.student?.email}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="empty-state">Chưa có sinh viên đăng ký lớp này.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
