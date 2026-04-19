import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_LOGIN_API_URL ?? "http://localhost:8000/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [tokenValid, setTokenValid] = useState(null); // null=loading, true, false
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [msg,        setMsg]        = useState("");
  const [isError,    setIsError]    = useState(false);
  const [success,    setSuccess]    = useState(false);

  // Validasi token saat halaman dibuka
  useEffect(() => {
    if (!token || !email) { setTokenValid(false); return; }
    axios.post(`${API}/reset-password/verify`, { token, email })
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false));
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg("Konfirmasi password tidak cocok."); setIsError(true); return;
    }
    setLoading(true); setMsg("");
    try {
      await axios.post(`${API}/reset-password`, {
        token, email,
        password,
        password_confirmation: confirm,
      });
      setSuccess(true);
      setMsg("Password berhasil direset! Mengalihkan ke halaman login...");
      setIsError(false);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setMsg(err?.response?.data?.message ?? "Terjadi kesalahan.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading validasi token ─────────────────────────────────────────────
  if (tokenValid === null) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ textAlign: "center", color: "#6b7280" }}>Memvalidasi token...</p>
        </div>
      </div>
    );
  }

  // ── Token tidak valid / expired ────────────────────────────────────────
  if (!tokenValid) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Link Tidak Valid</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
            Link reset password sudah kedaluwarsa atau tidak valid.
            Silakan minta ulang link baru.
          </p>
          <button onClick={() => navigate("/forgot-password")} style={styles.btn}>
            Minta Link Baru
          </button>
        </div>
      </div>
    );
  }

  // ── Form reset password ────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Buat Password Baru</h2>
        <p style={styles.subtitle}>Masukkan password baru untuk akun <strong>{email}</strong></p>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Password Baru</label>
            <input
              type="password" required minLength={8}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Konfirmasi Password</label>
            <input
              type="password" required
              placeholder="Ulangi password baru"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
            />

            {msg && (
              <div style={{ ...styles.alert,
                background: isError ? "#fee2e2" : "#d1fae5",
                color: isError ? "#b91c1c" : "#065f46" }}>
                {msg}
              </div>
            )}

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>
        ) : (
          <div style={{ ...styles.alert, background: "#d1fae5", color: "#065f46" }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f3f4f6",
  },
  card: {
    background: "#fff", borderRadius: 12, padding: "40px 36px",
    width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  title:    { fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 24 },
  label:    { display: "block", fontSize: 13, fontWeight: 600,
              color: "#374151", marginBottom: 6 },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #d1d5db", fontSize: 14, marginBottom: 16,
    boxSizing: "border-box", outline: "none",
  },
  alert: { borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  btn: {
    width: "100%", padding: "11px", background: "#3267e3", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
    cursor: "pointer",
  },
};