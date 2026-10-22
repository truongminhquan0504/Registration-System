import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { DAY_LABELS, WEEK_DAYS } from "../../utils/format";

const EMPTY_FORM = {
  subject_id: "",
  class_code: "",
  teacher_id: "",
  semester: "2026.1",
  max_students: "40",
  room: "",
  day_of_week: "2",
  start_period: "1",
  end_period: "3",
};

export default function ManageClasses() {
  const { token } = useAuth();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        api.getClasses(),
        api.getSubjects(),
        api.getUsers(token, { role: "TEACHER" }),
      ]);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
      setTeachers(teachersRes.data);
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

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      subject_id: String(c.subject_id),
      class_code: c.class_code,
      teacher_id: c.teacher_id ? String(c.teacher_id) : "",
      semester: c.semester,
      max_students: String(c.max_students),
      room: c.room,
      day_of_week: String(c.day_of_week),
      start_period: String(c.start_period),
      end_period: String(c.end_period),
    });
    setNotice("");
    setError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject_id || !form.class_code.trim() || !form.room.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin lớp học phần.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (editingId) {
        await api.updateClass(editingId, form, token);
        setNotice("Đã cập nhật lớp học phần.");
      } else {
        await api.createClass(form, token);
        setNotice("Đã thêm lớp học phần mới.");
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Xóa lớp học phần "${c.class_code}"?`)) return;
    setError("");
    setNotice("");
    try {
      await api.deleteClass(c.id, token);
      setNotice("Đã xóa lớp học phần.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="page__header">
          <div>
            <h1 className="page__title">Quản lý lớp học phần</h1>
            <p className="page__subtitle">Mở lớp, phân công giảng viên, xếp lịch học cho từng môn.</p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {notice && <p className="alert alert--success" role="status">{notice}</p>}

        <div className="card">
          <h2 style={{ fontSize: "var(--fs-h3)", marginBottom: "var(--space-4)" }}>
            {editingId ? "Sửa lớp học phần" : "Mở lớp học phần mới"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="class-subject">Môn học</label>
                <select id="class-subject" name="subject_id" className="select" value={form.subject_id} onChange={handleChange}>
                  <option value="">— Chọn môn học —</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="class-code">Mã lớp học phần</label>
                <input id="class-code" name="class_code" className="input" value={form.class_code} onChange={handleChange} placeholder="D22-INT1339-01" />
              </div>

              <div className="field">
                <label htmlFor="class-teacher">Giảng viên</label>
                <select id="class-teacher" name="teacher_id" className="select" value={form.teacher_id} onChange={handleChange}>
                  <option value="">— Chưa phân công —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="class-semester">Học kỳ</label>
                <input id="class-semester" name="semester" className="input" value={form.semester} onChange={handleChange} placeholder="2026.1" />
              </div>

              <div className="field">
                <label htmlFor="class-room">Phòng học</label>
                <input id="class-room" name="room" className="input" value={form.room} onChange={handleChange} placeholder="TC-301" />
              </div>
              <div className="field">
                <label htmlFor="class-max">Sĩ số tối đa</label>
                <input id="class-max" name="max_students" type="number" min="1" className="input" value={form.max_students} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="class-day">Thứ</label>
                <select id="class-day" name="day_of_week" className="select" value={form.day_of_week} onChange={handleChange}>
                  {WEEK_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {DAY_LABELS[d]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
                <div>
                  <label htmlFor="class-start">Tiết bắt đầu</label>
                  <input id="class-start" name="start_period" type="number" min="1" max="12" className="input" value={form.start_period} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="class-end">Tiết kết thúc</label>
                  <input id="class-end" name="end_period" type="number" min="1" max="12" className="input" value={form.end_period} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Mở lớp học phần"}
              </button>
              {editingId && (
                <button type="button" className="btn btn--ghost" onClick={resetForm}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={{ marginTop: "var(--space-6)" }}>
          {isLoading ? (
            <p className="empty-state">Đang tải...</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã lớp</th>
                    <th>Môn học</th>
                    <th>Giảng viên</th>
                    <th>Lịch học</th>
                    <th>Sĩ số</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id}>
                      <td>{c.class_code}</td>
                      <td>{c.subject?.name}</td>
                      <td>{c.teacher?.name ?? "Chưa phân công"}</td>
                      <td>{c.schedule_text}</td>
                      <td>
                        {c.registered_count}/{c.max_students}
                      </td>
                      <td style={{ display: "flex", gap: "var(--space-2)" }}>
                        <button type="button" className="btn btn--secondary btn--sm" onClick={() => startEdit(c)}>
                          Sửa
                        </button>
                        <button type="button" className="btn btn--danger btn--sm" onClick={() => handleDelete(c)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
