import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/ProfilLayout.css";
import "../../styles/Histori.css";
import { logoutUser } from "../../services/auth";
import { clearAuthSession } from "../../utils/authStorage";
import {
  getScopedItem,
  removeScopedItem,
  setScopedItem,
  USER_STORAGE_KEYS,
} from "../../utils/userScopedStorage";

const defaultProfile = {
  photo: "",
  fullName: "",
  email: "",
};

const defaultAppliedJob = {
  id: "",
  title: "Belum ada lowongan dipilih",
  company: "Perusahaan belum tersedia",
  location: "Lokasi belum tersedia",
  type: "MAGANG",
  duration: "",
  work: "",
  stage: "Administrasi",
};

export default function Histori() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);
  const isStatusLamaranGroup =
    location.pathname.startsWith("/status-lamaran") ||
    location.pathname.startsWith("/histori-lamaran");

  const readSavedProfile = () => {
    try {
      const saved = getScopedItem(USER_STORAGE_KEYS.dataDiri);
      if (!saved) return defaultProfile;

      const parsed = JSON.parse(saved);
      return {
        photo: parsed?.photo || "",
        fullName: parsed?.fullName || "",
        email: parsed?.email || "",
      };
    } catch (error) {
      console.error("Gagal membaca profil dari localStorage:", error);
      return defaultProfile;
    }
  };

  const readAppliedJob = () => {
    try {
      const savedJob = getScopedItem(USER_STORAGE_KEYS.appliedJob);
      if (!savedJob) return defaultAppliedJob;

      const parsed = JSON.parse(savedJob);
      return {
        id: parsed?.id || "",
        title: parsed?.title || "Belum ada lowongan dipilih",
        company: parsed?.company || "Perusahaan belum tersedia",
        location: parsed?.location || "Lokasi belum tersedia",
        type: parsed?.type || "MAGANG",
        duration: parsed?.duration || "",
        work: parsed?.work || "",
        stage: parsed?.stage || "Administrasi",
      };
    } catch (error) {
      console.error("Gagal membaca data lowongan dari localStorage:", error);
      return defaultAppliedJob;
    }
  };

  const [savedProfile, setSavedProfile] = useState(defaultProfile);
  const [appliedJob, setAppliedJob] = useState(defaultAppliedJob);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    setScopedItem(USER_STORAGE_KEYS.statusViewed, "true");
    window.dispatchEvent(new Event("career-journey-updated"));
  }, []);

  useEffect(() => {
    const syncAllData = () => {
      setSavedProfile(readSavedProfile());
      setAppliedJob(readAppliedJob());
    };

    syncAllData();

    window.addEventListener("profile-updated", syncAllData);
    window.addEventListener("storage", syncAllData);

    return () => {
      window.removeEventListener("profile-updated", syncAllData);
      window.removeEventListener("storage", syncAllData);

      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout backend gagal, sesi lokal tetap dibersihkan:", error);
    } finally {
      clearAuthSession();
      navigate("/login");
    }
  };

  const openWithdrawModal = () => {
    setShowWithdrawModal(true);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
  };

  const handleConfirmWithdraw = () => {
    setShowWithdrawModal(false);
    setShowSuccessToast(true);

    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
    }

    redirectTimerRef.current = setTimeout(() => {
      removeScopedItem(USER_STORAGE_KEYS.appliedJob);
      navigate("/status-lamaran", { replace: true });
    }, 800);
  };

  const displayName = useMemo(() => {
    return savedProfile.fullName?.trim() || "";
  }, [savedProfile.fullName]);

  const displayEmail = useMemo(() => {
    return savedProfile.email?.trim() || "";
  }, [savedProfile.email]);

  const shortEmail = useMemo(() => {
    if (!displayEmail) return "";
    return displayEmail.length > 18
      ? `${displayEmail.slice(0, 18)}...`
      : displayEmail;
  }, [displayEmail]);

  const currentStage = appliedJob.stage || "Administrasi";
  const isWithdrawn = currentStage === "Mengundurkan Diri";

  const steps = [
    {
      no: 1,
      title: "Administrasi",
      active: currentStage === "Administrasi",
      content:
        "Proses seleksi administrasi sedang berlangsung. Pastikan data diri dan dokumen yang Anda kirim sudah benar serta sesuai dengan persyaratan lowongan.",
    },
    {
      no: 2,
      title: "Lolos Seleksi",
      active: currentStage === "Lolos Seleksi",
      content:
        "Selamat, Anda lolos tahap seleksi awal. Silakan pantau informasi berikutnya secara berkala pada halaman status lamaran.",
    },
    {
      no: 3,
      title: "Pelaksanaan",
      active: currentStage === "Pelaksanaan",
      content:
        "Program sedang memasuki tahap pelaksanaan. Pastikan Anda mengikuti seluruh arahan dan jadwal yang telah ditentukan oleh perusahaan.",
    },
    {
      no: 4,
      title: "Lulus Magang",
      active: currentStage === "Lulus Magang",
      content:
        "Selamat, Anda telah menyelesaikan program magang. Semoga pengalaman ini bermanfaat untuk pengembangan karir Anda.",
    },
  ];

  return (
    <div className="profilePage historiPage">
      <header className="profileHeader">
        <div className="headerContainer">
          <div className="headerLeft">
            <div className="logoWrap">
              <img
                src="/vocaseeklogo.png"
                alt="logo vocaseek"
                className="logoImage"
              />
            </div>
          </div>

          <div className="headerRight">
            <button className="userPill" type="button">
              {savedProfile.photo ? (
                <img
                  src={savedProfile.photo}
                  alt="Foto Profil"
                  className="userAvatarImage"
                />
              ) : (
                <span className="userAvatar" aria-hidden="true" />
              )}

              <span className="userName">{displayName || "User"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pageContainer">
        <aside className="aside">
          <div className="asideInner">
            <div className="asideCard">
              <div className="asideOverlay" aria-hidden="true" />
              <div className="asideCardRow">
                <div className="asideAvatarWrap">
                  {savedProfile.photo ? (
                    <img
                      src={savedProfile.photo}
                      alt="Foto Profil"
                      className="asideAvatarImage"
                    />
                  ) : (
                    <div className="asideAvatar" aria-hidden="true" />
                  )}

                  <div className="asideOnlineDot" aria-hidden="true" />
                </div>

                <div className="asideMeta">
                  <div className="asideName">
                    {displayName || "Nama Pengguna"}
                  </div>
                  <div className="asideEmail">
                    {shortEmail || "email@domain.com"}
                  </div>
                </div>
              </div>
            </div>

            <nav className="asideNav" aria-label="Sidebar Navigation">
              <NavLink
                to="/profil"
                end={false}
                className={({ isActive }) =>
                  `asideLink ${isActive ? "isActive" : ""}`
                }
              >
                <span className="asideIcon" aria-hidden="true">
                  <img src="/CV.png" alt="CV" className="asideIconImg" />
                </span>
                <span className="asideLabel">Curriculum Vitae</span>
              </NavLink>

              <NavLink
                to="/status-lamaran"
                className={() =>
                  `asideLink ${isStatusLamaranGroup ? "isActive" : ""}`
                }
              >
                <span className="asideIcon" aria-hidden="true">
                  <img
                    src="/StatusLamaran.png"
                    alt="Status Lamaran"
                    className="asideIconImg"
                  />
                </span>
                <span className="asideLabel">Status Lamaran</span>
              </NavLink>

              <NavLink
                to="/pretest"
                className={({ isActive }) =>
                  `asideLink ${isActive ? "isActive" : ""}`
                }
              >
                <span className="asideIcon" aria-hidden="true">
                  <img
                    src="/Pretest.png"
                    alt="Pre-Test"
                    className="asideIconImg"
                  />
                </span>
                <span className="asideLabel">Pre-Test</span>
              </NavLink>

              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `asideLink ${isActive ? "isActive" : ""}`
                }
              >
                <span className="asideIcon" aria-hidden="true">
                  <img src="/home.png" alt="home" className="asideIconImg" />
                </span>
                <span className="asideLabel">Beranda</span>
              </NavLink>

              <div className="asideDivider" />

              <button
                type="button"
                className="asideLink"
                onClick={handleLogout}
              >
                <span className="asideIcon" aria-hidden="true">
                  <img
                    src="/Keluar.png"
                    alt="Keluar"
                    className="asideIconImg"
                  />
                </span>
                <span className="asideLabel">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="main">
          <div className="mainCard historiMainCard">
            <div className="historiHeaderRow">
              <div className="historiHeaderText">
                <h1 className="historiTitle">Status Lamaran</h1>
                <p className="historiSubtitle">
                  Pantau semua aktivitas lamaran Anda dan cek perkembangan
                  terbaru dari lowongan yang sudah Anda daftar.
                </p>
              </div>
            </div>

            <div className="historiFilterRow">
              <button className="historiFilterChip isActive" type="button">
                Semua
              </button>
            </div>

            <div className="historiContentWrap">
              <div className="historiJobCard">
                <div className="historiJobLeft">
                  <div className="historiCompanyIcon" aria-hidden="true">
                    <div className="historiBuilding">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>

                  <div className="historiJobMeta">
                    <h2 className="historiJobTitle">{appliedJob.title}</h2>
                    <p className="historiCompanyLine">
                      {appliedJob.company} • {appliedJob.location}
                      <span className="historiBadge">
                        {appliedJob.type || "MAGANG"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="historiStageWrap">
                  <button
                    className={`historiStagePill ${
                      isWithdrawn ? "isWithdrawn" : ""
                    }`}
                    type="button"
                  >
                    {currentStage}
                  </button>
                </div>
              </div>

              {isWithdrawn ? (
                <div className="historiWithdrawStateBox">
                  <div className="historiWithdrawStateIcon">!</div>
                  <div className="historiWithdrawStateText">
                    <h3>Lamaran telah diundurkan</h3>
                    <p>
                      Anda telah mengundurkan diri dari lowongan ini. Silakan
                      kembali ke halaman status lamaran untuk melihat informasi
                      terbaru.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="historiTimeline">
                  {steps.map((step, index) => (
                    <div
                      className={`historiStep ${step.active ? "isActive" : ""} ${
                        index === steps.length - 1 ? "isLast" : ""
                      }`}
                      key={step.no}
                    >
                      <div className="historiStepMarkerWrap">
                        <div className="historiStepMarker">{step.no}</div>
                        {index !== steps.length - 1 && (
                          <div className="historiStepLine" aria-hidden="true" />
                        )}
                      </div>

                      <div className="historiStepContent">
                        <h3 className="historiStepTitle">{step.title}</h3>

                        {step.active && (
                          <>
                            <div className="historiInfoBox">
                              <span
                                className="historiInfoIcon"
                                aria-hidden="true"
                              >
                                i
                              </span>
                              <p>{step.content}</p>
                            </div>

                            <div className="historiActionRow">
                              <button
                                className="historiWithdrawBtn"
                                type="button"
                                onClick={openWithdrawModal}
                              >
                                Pengunduran diri
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showWithdrawModal && (
        <div className="historiModalOverlay" onClick={closeWithdrawModal}>
          <div
            className="historiModalCard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="historiModalIcon">!</div>

            <h3 className="historiModalTitle">Konfirmasi Pengunduran Diri</h3>

            <p className="historiModalText">
              Apakah Anda yakin ingin mengundurkan diri dari lowongan
              <strong> {appliedJob.title}</strong> di
              <strong> {appliedJob.company}</strong>?
            </p>

            <div className="historiModalActions">
              <button
                type="button"
                className="historiModalCancelBtn"
                onClick={closeWithdrawModal}
              >
                Tidak
              </button>

              <button
                type="button"
                className="historiModalConfirmBtn"
                onClick={handleConfirmWithdraw}
              >
                Iya, lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="historiToastWrap">
          <div className="historiToastCard">
            <div className="historiToastIcon">✓</div>
            <div className="historiToastContent">
              <h4>Berhasil</h4>
              <p>
                Pengunduran diri lamaran <strong>{appliedJob.title}</strong>{" "}
                berhasil diproses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
