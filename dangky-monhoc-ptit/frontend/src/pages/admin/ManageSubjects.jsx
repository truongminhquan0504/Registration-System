import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";

const EMPTY_FORM = { code: "", name: "", credits: "", description: "" };

export default function ManageSubjects() {
  const { token } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const res = await api.getSubjects();
      setSubjects(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const startEdit = (subject) => {
    setEditingId(subject.id);
    setForm({
      code: subject.code,
      name: subject.name,
      credits: String(subject.credits),
      description: subject.description ?? "",
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
    if (!form.code.trim() || !form.name.trim() || !form.credits) {
      setError("Vui lòng nhập đủ mã môn, tên môn và số tín chỉ.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (editingId) {
        await api.updateSubject(editingId, form, token);
        setNotice("Đã cập nhật môn học.");
      } else {
        await api.createSubject(form, token);
        setNotice("Đã thêm môn học mới.");
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`Xóa môn học "${subject.name}"?`)) return;
    setError("");
    setNotice("");
    try {
      await api.deleteSubject(subject.id, token);
      setNotice("Đã xóa môn học.");
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
            <h1 className="page__title">Quản lý môn học</h1>
            <p className="page__subtitle">Thêm, sửa, xóa môn học trong chương trình đào tạo.</p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {notice && <p className="alert alert--success" role="status">{notice}</p>}

        <div className="card">
          <h2 style={{ fontSize: "var(--fs-h3)", marginBottom: "var(--space-4)" }}>
            {editingId ? "Sửa môn học" : "Thêm môn học mới"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="subject-code">Mã môn</label>
                <input id="subject-code" name="code" className="input" value={form.code} onChange={handleChange} placeholder="INT1339" />
              </div>
              <div className="field">
                <label htmlFor="subject-credits">Số tín chỉ</label>
                <input id="subject-credits" name="credits" type="number" min="1" className="input" value={form.credits} onChange={handleChange} />
              </div>
              <div className="field field--full">
                <label htmlFor="subject-name">Tên môn học</label>
                <input id="subject-name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="Nhập môn lập trình" />
              </div>
              <div className="field field--full">
                <label htmlFor="subject-description">Mô tả</label>
                <input id="subject-description" name="description" className="input" value={form.description} onChange={handleChange} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm môn học"}
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
                    <th>Mã môn</th>
                    <th>Tên môn học</th>
                    <th>Tín chỉ</th>
                    <th>Mô tả</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.id}>
                      <td>{s.code}</td>
                      <td>{s.name}</td>
                      <td>{s.credits}</td>
                      <td>{s.description}</td>
                      <td style={{ display: "flex", gap: "var(--space-2)" }}>
                        <button type="button" className="btn btn--secondary btn--sm" onClick={() => startEdit(s)}>
                          Sửa
                        </button>
                        <button type="button" className="btn btn--danger btn--sm" onClick={() => handleDelete(s)}>
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
