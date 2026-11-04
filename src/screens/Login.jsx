import "./Login.css";

export default function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">OutfitReady</p>
        <h1>เข้าสู่ระบบ</h1>
        <p className="subtitle">จัดการตู้เสื้อผ้าของคุณให้เป็นเรื่องง่าย</p>

        <form className="auth-form">
          <label>
            <span>อีเมล</span>
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            <span>รหัสผ่าน</span>
            <input type="password" placeholder="••••••••" />
          </label>

          <button type="submit" className="primary-btn" onClick={() => navigate = '/'}>
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
