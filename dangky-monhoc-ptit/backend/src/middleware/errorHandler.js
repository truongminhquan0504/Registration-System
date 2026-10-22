/** Bắt các lỗi không lường trước (throw trong controller) để không làm sập server. */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ message: "Không tìm thấy đường dẫn API này." });
}
