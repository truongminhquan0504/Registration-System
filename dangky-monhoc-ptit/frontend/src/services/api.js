/**
 * Nơi duy nhất khai báo địa chỉ backend.
 * Component không tự ghép URL, luôn gọi qua các hàm trong file này.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const TOKEN_KEY = "dangky_token";
const USER_KEY = "dangky_user";

/** Lỗi có kèm mã HTTP để nơi gọi biết đường xử lý. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Gọi API và luôn trả về lỗi ở dạng thông báo tiếng Việt dễ đọc.
 * Không để lộ stack trace hay chi tiết kỹ thuật ra giao diện.
 */
async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Backend tắt, sai cổng, mất mạng...
    throw new ApiError(
      "Không kết nối được tới máy chủ. Vui lòng kiểm tra kết nối và thử lại.",
      0
    );
  }

  if (response.status === 204) return null;

  let data = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.",
      response.status
    );
  }

  return data;
}

/* ------------------------------------------------------------------ */
/*  Authentication                                                     */
/* ------------------------------------------------------------------ */

/** Đăng ký tài khoản. Cố ý KHÔNG gửi `role` — backend luôn đặt là STUDENT. */
export function register({ name, email, password, student_code }) {
  return request("/auth/register", {
    method: "POST",
    body: { name, email, password, student_code },
  });
}

/** Đăng nhập, trả về { token, user }. */
export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

/** Lấy thông tin tài khoản đang đăng nhập từ token. */
export function getCurrentUser(token) {
  return request("/auth/me", { token });
}

/* ------------------------------------------------------------------ */
/*  Môn học                                                             */
/* ------------------------------------------------------------------ */

export function getSubjects() {
  return request("/subjects");
}

export function createSubject(payload, token) {
  return request("/subjects", { method: "POST", body: payload, token });
}

export function updateSubject(id, payload, token) {
  return request(`/subjects/${id}`, { method: "PUT", body: payload, token });
}

export function deleteSubject(id, token) {
  return request(`/subjects/${id}`, { method: "DELETE", token });
}

/* ------------------------------------------------------------------ */
/*  Lớp học phần                                                        */
/* ------------------------------------------------------------------ */

/** Bỏ các tham số rỗng để URL luôn gọn. */
function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** Danh sách lớp học phần, lọc tuỳ chọn: { subject_id, semester, teacher_id, q } */
export function getClasses(params) {
  return request(`/classes${buildQuery(params)}`);
}

export function getClassById(id) {
  return request(`/classes/${id}`);
}

export function createClass(payload, token) {
  return request("/classes", { method: "POST", body: payload, token });
}

export function updateClass(id, payload, token) {
  return request(`/classes/${id}`, { method: "PUT", body: payload, token });
}

export function deleteClass(id, token) {
  return request(`/classes/${id}`, { method: "DELETE", token });
}

/** Danh sách lớp mà giảng viên hiện tại đang dạy. */
export function getMyTeachingClasses(token) {
  return request("/classes/teaching/me", { token });
}

/** Danh sách sinh viên đã đăng ký một lớp (giảng viên/admin). */
export function getClassRoster(id, token) {
  return request(`/classes/${id}/roster`, { token });
}

/* ------------------------------------------------------------------ */
/*  Đăng ký môn học (sinh viên)                                         */
/* ------------------------------------------------------------------ */

export function getMyRegistrations(token, params) {
  return request(`/registrations/me${buildQuery(params)}`, { token });
}

export function getMySchedule(token, params) {
  return request(`/registrations/me/schedule${buildQuery(params)}`, { token });
}

export function registerForClass(classId, token) {
  return request("/registrations", {
    method: "POST",
    body: { class_id: classId },
    token,
  });
}

export function cancelRegistration(registrationId, token) {
  return request(`/registrations/${registrationId}/cancel`, {
    method: "POST",
    token,
  });
}

/* ------------------------------------------------------------------ */
/*  Người dùng (admin)                                                  */
/* ------------------------------------------------------------------ */

export function getUsers(token, params) {
  return request(`/users${buildQuery(params)}`, { token });
}

export function updateUserRole(id, role, token) {
  return request(`/users/${id}/role`, { method: "PUT", body: { role }, token });
}

/* ------------------------------------------------------------------ */
/*  Lưu phiên đăng nhập ở trình duyệt                                    */
/*                                                                       */
/*  Chỉ lưu token và vài thông tin hiển thị. KHÔNG bao giờ lưu mật        */
/*  khẩu hay chuỗi băm mật khẩu.                                         */
/* ------------------------------------------------------------------ */

export const storage = {
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  save(token, user) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          student_code: user.student_code,
        })
      );
    } catch {
      // Trình duyệt chặn lưu trữ (chế độ riêng tư) — vẫn dùng được trong phiên
    }
  },

  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // bỏ qua
    }
  },
};
