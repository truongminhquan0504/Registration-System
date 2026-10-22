import "./Logo.css";

/**
 * Logo dạng typography + mark hình học đơn giản.
 * `size`: "md" (navbar) | "sm" (trong mockup).
 */
export default function Logo({ size = "md", as: Tag = "span" }) {
  return (
    <Tag className={`logo logo--${size}`}>
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" focusable="false">
          <path
            d="M5 6.2c2.6-.9 4.6-.9 7 .5v11.6c-2.4-1.4-4.4-1.4-7-.5z"
            fill="currentColor"
            opacity="0.55"
          />
          <path
            d="M19 6.2c-2.6-.9-4.6-.9-7 .5v11.6c2.4-1.4 4.4-1.4 7-.5z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="logo__wordmark">
        ĐĂNG KÝ MÔN HỌC <strong>PTIT</strong>
      </span>
    </Tag>
  );
}
