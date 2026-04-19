import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_LOGIN_API_URL ?? "http://localhost:8000/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setMsg("Link reset password telah dikirim ke email kamu. Cek inbox / spam.");
      setIsError(false);
    } catch (err) {
      setMsg(err?.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo / Title */}
        <h2 style={styles.title}>Lupa Password</h2>
        <p style={styles.subtitle}>
          Masukkan email yang terdaftar. Kami akan mengirimkan link reset password.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            required
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          {msg && (
            <div style={{ ...styles.alert, background: isError ? "#fee2e2" : "#d1fae5",
                          color: isError ? "#b91c1c" : "#065f46" }}>
              {msg}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        <button onClick={() => navigate(-1)} style={styles.back}>
          ← Kembali ke Login
        </button>
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
    cursor: "pointer", marginBottom: 16,
  },
  back: {
    background: "none", border: "none", color: "#3267e3",
    fontSize: 13, cursor: "pointer", padding: 0,
  },
};