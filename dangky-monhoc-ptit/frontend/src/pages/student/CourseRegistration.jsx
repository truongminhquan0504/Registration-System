import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

const SEMESTER = "2026.1";

export default function CourseRegistration() {
  const { token } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingClassId, setPendingClassId] = useState(null);

  async function loadAll() {
    setIsLoading(true);
    setError("");
    try {
      const [subjectsRes, classesRes, regsRes] = await Promise.all([
        api.getSubjects(),
        api.getClasses({ semester: SEMESTER }),
        api.getMyRegistrations(token, { semester: SEMESTER }),
      ]);
      setSubjects(subjectsRes.data);
      setClasses(classesRes.data);
      setMyRegistrations(regsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registeredClassIds = useMemo(
    () => new Set(myRegistrations.map((r) => r.class.id)),
    [myRegistrations]
  );
  const registeredSubjectIds = useMemo(
    () => new Set(myRegistrations.map((r) => r.class.subject_id)),
    [myRegistrations]
  );

  const filteredClasses = useMemo(() => {
    let list = classes;
    if (subjectFilter) list = list.filter((c) => c.subject_id === Number(subjectFilter));
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.class_code.toLowerCase().includes(kw) ||
          c.subject?.name.toLowerCase().includes(kw) ||
          c.subject?.code.toLowerCase().includes(kw)
      );
    }
    return list;
  }, [classes, subjectFilter, keyword]);

  const handleRegister = async (classItem) => {
    setNotice("");
    setError("");
    setPendingClassId(classItem.id);
    try {
      await api.registerForClass(classItem.id, token);
      setNotice(`Đăng ký thành công lớp ${classItem.class_code}.`);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingClassId(null);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="page__header">
          <div>
            <h1 className="page__title">Đăng ký môn học</h1>
            <p className="page__subtitle">Học kỳ {SEMESTER} • Chọn lớp học phần còn chỗ trống để đăng ký.</p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {notice && <p className="alert alert--success" role="status">{notice}</p>}

        <div className="toolbar">
          <div className="toolbar__field">
            <label htmlFor="filter-subject">Môn học</label>
            <select
              id="filter-subject"
              className="select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar__field" style={{ flex: 1 }}>
            <label htmlFor="filter-keyword">Tìm kiếm</label>
            <input
              id="filter-keyword"
              className="input"
              type="text"
              placeholder="Mã lớp, tên môn hoặc mã môn..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="empty-state">Đang tải danh sách lớp học phần...</p>
        ) : filteredClasses.length === 0 ? (
          <p className="empty-state">Không có lớp học phần nào phù hợp.</p>
        ) : (
          <div className="class-grid">
            {filteredClasses.map((c) => {
              const alreadyThisClass = registeredClassIds.has(c.id);
              const alreadyThisSubject = registeredSubjectIds.has(c.subject_id) && !alreadyThisClass;
              const disabled = c.is_full || alreadyThisClass || alreadyThisSubject;

              return (
                <article key={c.id} className="class-card">
                  <div className="class-card__head">
                    <div>
                      <p className="class-card__code">{c.class_code}</p>
                      <p className="class-card__name">{c.subject?.name}</p>
                    </div>
                    <span className="badge badge--accent">{c.subject?.credits} TC</span>
                  </div>

                  <p className="class-card__meta">
                    {c.schedule_text}
                    <br />
                    Giảng viên: {c.teacher?.name ?? "Chưa phân công"}
                  </p>

                  <div className="class-card__footer">
                    <span
                      className={`badge ${c.is_full ? "badge--danger" : "badge--success"}`}
                    >
                      {c.is_full ? "Đã đủ sĩ số" : `Còn ${c.remaining_slots}/${c.max_students} chỗ`}
                    </span>

                    {alreadyThisClass ? (
                      <span className="badge badge--neutral">Đã đăng ký</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        disabled={disabled || pendingClassId === c.id}
                        title={alreadyThisSubject ? "Bạn đã đăng ký môn này ở lớp khác" : undefined}
                        onClick={() => handleRegister(c)}
                      >
                        {pendingClassId === c.id ? "Đang đăng ký..." : "Đăng ký"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
