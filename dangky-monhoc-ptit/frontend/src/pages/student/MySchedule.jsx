import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import { DAY_LABELS, WEEK_DAYS } from "../../utils/format";

const SEMESTER = "2026.1";
const MAX_PERIOD = 12;

export default function MySchedule() {
  const { token } = useAuth();

  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .getMySchedule(token, { semester: SEMESTER })
      .then((res) => {
        if (!cancelled) setSchedule(res.data);
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

  // Với mỗi (thứ, tiết), tìm lớp học đang chiếm ô đó (nếu có) và số tiết nó kéo dài.
  const grid = useMemo(() => {
    if (!schedule) return {};
    const map = {};
    for (const day of WEEK_DAYS) {
      const classesOfDay = schedule.by_day[day] ?? [];
      for (const c of classesOfDay) {
        map[`${day}-${c.start_period}`] = c;
        for (let p = c.start_period + 1; p <= c.end_period; p++) {
          map[`${day}-${p}`] = "occupied";
        }
      }
    }
    return map;
  }, [schedule]);

  return (
    <section className="page">
      <div className="container">
        <div className="page__header">
          <div>
            <h1 className="page__title">Thời khóa biểu</h1>
            <p className="page__subtitle">
              Học kỳ {SEMESTER}
              {schedule ? ` • ${schedule.classes.length} lớp • ${schedule.total_credits} tín chỉ` : ""}
            </p>
          </div>
        </div>

        {error && <p className="alert alert--error" role="alert">{error}</p>}

        {isLoading ? (
          <p className="empty-state">Đang tải...</p>
        ) : !schedule || schedule.classes.length === 0 ? (
          <p className="empty-state">Bạn chưa đăng ký môn học nào trong học kỳ này.</p>
        ) : (
          <div className="timetable">
            <div className="timetable__cell timetable__head"></div>
            {WEEK_DAYS.map((day) => (
              <div key={day} className="timetable__cell timetable__head">
                {DAY_LABELS[day]}
              </div>
            ))}

            {Array.from({ length: MAX_PERIOD }, (_, i) => i + 1).map((period) => (
              <ScheduleRow key={period} period={period} grid={grid} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ScheduleRow({ period, grid }) {
  return (
    <>
      <div className="timetable__cell timetable__period">Tiết {period}</div>
      {WEEK_DAYS.map((day) => {
        const cell = grid[`${day}-${period}`];
        if (cell === "occupied") return null;
        if (cell) {
          const span = cell.end_period - cell.start_period + 1;
          return (
            <div key={day} className="timetable__cell" style={{ gridRow: `span ${span}` }}>
              <div className="timetable__class">
                {cell.subject?.code}
                <span>
                  {cell.class_code}
                  <br />
                  {cell.room}
                </span>
              </div>
            </div>
          );
        }
        return <div key={day} className="timetable__cell"></div>;
      })}
    </>
  );
}
