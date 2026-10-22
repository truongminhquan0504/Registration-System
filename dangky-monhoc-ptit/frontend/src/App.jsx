import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import CourseRegistration from "./pages/student/CourseRegistration";
import MyRegistrations from "./pages/student/MyRegistrations";
import MySchedule from "./pages/student/MySchedule";

import MyClasses from "./pages/teacher/MyClasses";

import ManageSubjects from "./pages/admin/ManageSubjects";
import ManageClasses from "./pages/admin/ManageClasses";
import ManageUsers from "./pages/admin/ManageUsers";

/** Đổi trang thì luôn cuộn lên đầu. */
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollHandler />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Sinh viên */}
          <Route
            path="/dang-ky"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <CourseRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/da-dang-ky"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thoi-khoa-bieu"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <MySchedule />
              </ProtectedRoute>
            }
          />

          {/* Giảng viên */}
          <Route
            path="/giang-day"
            element={
              <ProtectedRoute roles={["TEACHER"]}>
                <MyClasses />
              </ProtectedRoute>
            }
          />

          {/* Quản trị viên */}
          <Route
            path="/quan-tri/mon-hoc"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <ManageSubjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-tri/lop-hoc-phan"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <ManageClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quan-tri/tai-khoan"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
