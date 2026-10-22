import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import subjectsRoutes from "./routes/subjects.routes.js";
import classesRoutes from "./routes/classes.routes.js";
import registrationsRoutes from "./routes/registrations.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// API chính
app.get("/api", (req, res) => {
  res.json({
    message: "API đăng ký môn học đang hoạt động",
    status: "ok",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      subjects: "/api/subjects",
      classes: "/api/classes",
      registrations: "/api/registrations",
      users: "/api/users"
    }
  });
});

// Kiểm tra server
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Các API
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/registrations", registrationsRoutes);
app.use("/api/users", usersRoutes);

// Không tìm thấy API
app.use("/api", notFoundHandler);

// Xử lý lỗi
app.use(errorHandler);

export default app;