import "../../styles/daftarmagang.css";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { logoutUser } from "../../services/auth";
import { clearAuthSession, isAuthenticated } from "../../utils/authStorage";

export default function DaftarMagang() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout backend gagal, sesi lokal tetap dibersihkan:", error);
    } finally {
      clearAuthSession();
      navigate("/");
    }
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const userData = {
    name: "",
    email: "",
    photo: "",
  };

  const initials = userData.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu-wrapper")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const location = useLocation();

  // STATE FILE UPLOAD
  const [files, setFiles] = useState({
    ktp: null,
    portfolio: null,
    transkrip: null,
    cv: null,
  });

  // HANDLE FILE CHANGE
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [type]: file });
    }
  };

  return (
    <div className="dm-page user-nav-shell">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <img
              src="/vocaseeklogo.png"
              alt="Vocaseek Logo"
              className="logo-img"
            />
          </div>

          {/* HAMBURGER */}
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`nav ${menuOpen ? "show" : ""}`}>
            <NavLink
              to="/home"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Beranda
            </NavLink>

            <NavLink
              to="/searchlowongan"
              className={
                location.pathname === "/searchlowongan" ||
                location.pathname === "/daftar-magang"
                  ? "active"
                  : ""
              }
            >
              Lowongan
            </NavLink>

            <NavLink
              to={isLoggedIn ? "/searchmitra" : "/mitra"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Mitra
            </NavLink>

            <NavLink
              to={isLoggedIn ? "/contact" : "/kontak"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Kontak
            </NavLink>
          </nav>

          <div className="profile">
            {isLoggedIn ? (
              <div className="profile-menu-wrapper">
                <button
                  type="button"
                  className={`profile-trigger ${profileOpen ? "active" : ""}`}
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  <div className="profile-trigger-avatar-wrap">
                    <div className="avatar">
                      {!imageError ? (
                        <img
                          src={userData.photo}
                          alt={userData.name}
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <span className="avatar-fallback">{initials}</span>
                      )}
                    </div>
                    <span className="profile-online-badge"></span>
                  </div>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-top centered">
                      {/* BACKGROUND MOTIF */}
                      <div className="profile-avatar-accent"></div>

                      {/* AVATAR */}
                      <div className="profile-avatar-center">
                        {!imageError ? (
                          <img
                            src={userData.photo}
                            alt={userData.name}
                            className="profile-dropdown-avatar"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <div className="profile-dropdown-avatar fallback">
                            {initials}
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="profile-dropdown-info centered">
                        <h4>{userData.name || "Nama Pengguna"}</h4>
                        <span>{userData.email || "email@contoh.com"}</span>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <div className="profile-dropdown-actions">
                      <NavLink
                        to="/profil"
                        className="profile-dropdown-link primary"
                        onClick={() => setProfileOpen(false)}
                      >
                        Lihat Profil
                      </NavLink>

                      <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="login-btn">
                Masuk
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="dm-main">
        {/* HEADER TITLE */}

        <div className="dm-header">
          <h1>Daftar Magang</h1>

          <p>
            Pastikan seluruh informasi dan berkas yang ada di bawah sudah benar
            dan sesuai dengan data kamu ya.
          </p>

          {/* STEP */}

          <div className="dm-step">
            <div className="dm-step-active">1</div>

            <span className="dm-step-text">Cek Kelengkapan Berkas</span>

            <div className="dm-line"></div>

            <div className="dm-step-inactive">2</div>

            <span className="dm-step-gray">Review Lamaran Magang</span>
          </div>
        </div>

        {/* CARD */}

        <div className="dm-card">
          <h3>Data Pribadi</h3>

          <div className="dm-profile-empty">
            Data profil akan otomatis muncul dari akun kamu
          </div>

          {/* MOTIVATION */}

          <label className="dm-label">
            Motivasi mendaftar <span>*</span>
          </label>

          <textarea
            className="dm-textarea"
            placeholder="Tulis motivasi kamu..."
          ></textarea>

          {/* DOKUMEN */}

          <h3 className="dm-doc-title">Dokumen Pendukung</h3>

          {/* KTP */}

          <div className="dm-file">
            <div className="dm-file-info">
              <FaFilePdf className="dm-file-icon" />

              <div className="dm-file-name">
                {files.ktp ? files.ktp.name : "Otomatis Upload KTP"}
              </div>
            </div>

            <div className="dm-file-action">
              <label className="dm-file-btn">
                Ganti file
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "ktp")}
                />
              </label>
            </div>
          </div>

          {/* PORTFOLIO */}

          <div className="dm-file">
            <div className="dm-file-info">
              <FaFilePdf className="dm-file-icon" />

              <div className="dm-file-name">
                {files.portfolio
                  ? files.portfolio.name
                  : "Otomatis Upload Portfolio"}
              </div>
            </div>

            <div className="dm-file-action">
              <label className="dm-file-btn">
                Ganti file
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "portfolio")}
                />
              </label>
            </div>
          </div>

          {/* TRANSKRIP */}

          <div className="dm-file">
            <div className="dm-file-info">
              <FaFilePdf className="dm-file-icon" />

              <div className="dm-file-name">
                {files.transkrip
                  ? files.transkrip.name
                  : "Otomatis Upload Transkrip Nilai"}
              </div>
            </div>

            <div className="dm-file-action">
              <label className="dm-file-btn">
                Ganti file
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "transkrip")}
                />
              </label>
            </div>
          </div>

          {/* CV */}

          <div className="dm-file">
            <div className="dm-file-info">
              <FaFilePdf className="dm-file-icon" />

              <div className="dm-file-name">
                {files.cv ? files.cv.name : "Otomatis Upload CV"}
              </div>
            </div>

            <div className="dm-file-action">
              <label className="dm-file-btn">
                Ganti file
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "cv")}
                />
              </label>
            </div>
          </div>
        </div>

        {/* NEXT BUTTON */}

        <div className="dm-next-wrapper">
          <button
            className="dm-back"
            onClick={() => navigate("/searchlowongan")}
          >
            ← Kembali
          </button>

          <button
            className="dm-next"
            onClick={() => navigate("/review-lamaran")}
          >
            Selanjutnya →
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          {/* LEFT */}
          <div className="footer-about">
            <h3>About Us</h3>
            <span className="footer-line"></span>
            <p>
              Vocaseek berdedikasi dalam mengembangkan kapasitas talenta muda
              Indonesia melalui program pelatihan, mentoring, dan penyaluran
              karir yang terintegrasi.
            </p>

            <div className="footer-logo">
              <img src="/logovocaseek2.png" alt="Vocaseek" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="footer-contact">
            <h3>Contact Info</h3>
            <span className="footer-line"></span>

            <ul>
              <li>Jl. Pahlawan No.1, Surabaya, Jawa Timur</li>
              <li>+628517159231</li>
              <li>admin@vocaseek.id</li>
            </ul>

            <div className="footer-social">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill={"currentColor"}
                  viewBox={"0 0 24 24"}
                >
                  {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 2v.51l-8 6.22-8-6.22V6zM4 18V9.04l7.39 5.74c.18.14.4.21.61.21s.43-.07.61-.21L20 9.03v8.96H4Z"></path>
                </svg>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill={"currentColor"}
                  viewBox={"0 0 24 24"}
                >
                  {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                  <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248m0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008M16.806 6.129a1.078 1.078 0 1 0 0 2.156 1.078 1.078 0 1 0 0-2.156" />
                  <path d="M20.533 6.111A4.6 4.6 0 0 0 17.9 3.479a6.6 6.6 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.6 6.6 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.6 6.6 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71s0 2.753.056 3.71c.015.748.156 1.486.419 2.187a4.6 4.6 0 0 0 2.634 2.632 6.6 6.6 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.6 6.6 0 0 0 2.186-.419 4.61 4.61 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.6 6.6 0 0 0-.421-2.217m-1.218 9.532a5 5 0 0 1-.311 1.688 2.99 2.99 0 0 1-1.712 1.711 5 5 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a5 5 0 0 1-1.669-.311 2.99 2.99 0 0 1-1.719-1.711 5.1 5.1 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654s0-2.686.053-3.655a5 5 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5 5 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a5 5 0 0 1 1.67.311 3 3 0 0 1 1.712 1.712 5.1 5.1 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655s0 2.698-.043 3.654z" />
                </svg>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill={"currentColor"}
                  viewBox={"0 0 24 24"}
                >
                  {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                  <path d="M12 6.81c-2.86 0-5.19 2.33-5.19 5.19s2.33 5.19 5.19 5.19 5.19-2.33 5.19-5.19S14.86 6.81 12 6.81m-1.93 8.15V9.05L15.18 12l-5.11 2.95Z" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 15.92c-3.27 0-5.92-2.65-5.92-5.92S8.73 6.08 12 6.08s5.92 2.65 5.92 5.92-2.65 5.92-5.92 5.92" />
                </svg>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill={"currentColor"}
                  viewBox={"0 0 24 24"}
                >
                  {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                  <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.04 4.04 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.03 4.03 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.02 4.02 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.46 11.46 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a8 8 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8 8 0 0 0 2.319-.624 8.7 8.7 0 0 1-2.019 2.083" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Vocaseek. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
