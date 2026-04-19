import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { getMyApplicationStatus } from "../../services/companyTalent";


// ─── constants ────────────────────────────────────────────────────────────────

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
  stage: "Administrasi",
};

// ✅ Mapping status DB → tahap tampilan
// enum DB: PENDING | REVIEWED | SHORTLISTED | INTERVIEW | OFFER | REJECTED
const STAGE_MAP = {
  PENDING:     "Administrasi",
  REVIEWED:    "Administrasi",
  SHORTLISTED: "Lolos Seleksi",
  INTERVIEW:   "Lolos Seleksi",
  OFFER:       "Pelaksanaan",
  REJECTED:    "Mengundurkan Diri",
};

function mapBackendStatusToStage(status) {
  return STAGE_MAP[String(status || "").toUpperCase()] || "Administrasi";
}

// Label badge status asli dari DB
const STATUS_LABEL = {
  PENDING:     "Menunggu Review",
  REVIEWED:    "Sedang Ditinjau",
  SHORTLISTED: "Lolos Seleksi",
  INTERVIEW:   "Tahap Interview",
  OFFER:       "Mendapat Penawaran",
  REJECTED:    "Tidak Lolos",
};

function getStatusLabel(status) {
  return STATUS_LABEL[String(status || "").toUpperCase()] || "Menunggu Review";
}

function getStatusColor(status) {
  const s = String(status || "").toUpperCase();
  if (s === "REJECTED")    return "statusBadgeRejected";
  if (s === "OFFER")       return "statusBadgeOffer";
  if (s === "SHORTLISTED" || s === "INTERVIEW") return "statusBadgeSuccess";
  return "statusBadgePending";
}


// ─── helpers ──────────────────────────────────────────────────────────────────

function readSavedProfile() {
  try {
    const saved = getScopedItem(USER_STORAGE_KEYS.dataDiri);
    if (!saved) return defaultProfile;
    const parsed = JSON.parse(saved);
    return {
      photo:    parsed?.photo    || "",
      fullName: parsed?.fullName || "",
      email:    parsed?.email    || "",
    };
  } catch {
    return defaultProfile;
  }
}

function readAppliedJob() {
  try {
    const savedJob = getScopedItem(USER_STORAGE_KEYS.appliedJob);
    if (!savedJob) return defaultAppliedJob;
    const parsed = JSON.parse(savedJob);
    return {
      id:       parsed?.id       || "",
      title:    parsed?.title    || defaultAppliedJob.title,
      company:  parsed?.company  || defaultAppliedJob.company,
      location: parsed?.location || defaultAppliedJob.location,
      type:     parsed?.type     || "MAGANG",
      stage:    parsed?.stage    || "Administrasi",
      rawStatus: parsed?.rawStatus || "PENDING",
    };
  } catch {
    return defaultAppliedJob;
  }
}


// ─── component ────────────────────────────────────────────────────────────────

export default function Histori() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);
  const pollingRef = useRef(null);

  const isStatusLamaranGroup =
    location.pathname.startsWith("/status-lamaran") ||
    location.pathname.startsWith("/histori-lamaran");

  const [savedProfile,      setSavedProfile]      = useState(defaultProfile);
  const [appliedJob,        setAppliedJob]        = useState(defaultAppliedJob);
  const [rawStatus,         setRawStatus]         = useState("PENDING");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessToast,  setShowSuccessToast]  = useState(false);
  const [isFetching,        setIsFetching]        = useState(false);
  const [hasApplication,    setHasApplication]    = useState(true);

  // ── tandai halaman sudah dilihat ─────────────────────────────────────────
  useEffect(() => {
    setScopedItem(USER_STORAGE_KEYS.statusViewed, "true");
    window.dispatchEvent(new Event("career-journey-updated"));
  }, []);

  // ── fetch status dari backend ────────────────────────────────────────────
 const fetchStatusFromBackend = useCallback(async () => {
  setIsFetching(true);
  try {
    const response = await getMyApplicationStatus();

    // Response struktur: { data: { application_id, status, title, ... } }
    const data = response?.data?.data || response?.data || null;

    if (!data || !data.application_id) {
      setHasApplication(false);
      return;
    }

    setHasApplication(true);

    const updatedJob = {
      id:        data.application_id || "",
      title:     data.title    || defaultAppliedJob.title,
      company:   data.company  || defaultAppliedJob.company,
      location:  data.location || defaultAppliedJob.location,
      type:      data.type     || "MAGANG",
      stage:     mapBackendStatusToStage(data.status),
      rawStatus: data.status   || "PENDING",
    };

    setAppliedJob(updatedJob);
    setRawStatus(data.status || "PENDING");
    setScopedItem(USER_STORAGE_KEYS.appliedJob, JSON.stringify(updatedJob));

  } catch (error) {
    console.error("Gagal fetch status dari backend, pakai data lokal:", error);
  } finally {
    setIsFetching(false);
  }
}, []);

  // ── sync profil + job dari localStorage + fetch backend ─────────────────
  useEffect(() => {
    const syncLocalData = () => {
      setSavedProfile(readSavedProfile());
      const localJob = readAppliedJob();
      setAppliedJob(localJob);
      if (localJob.rawStatus) setRawStatus(localJob.rawStatus);
    };

    syncLocalData();
    fetchStatusFromBackend();

    // Polling setiap 30 detik
    pollingRef.current = setInterval(fetchStatusFromBackend, 30_000);

    window.addEventListener("profile-updated", syncLocalData);
    window.addEventListener("storage", syncLocalData);

    return () => {
      clearInterval(pollingRef.current);
      window.removeEventListener("profile-updated", syncLocalData);
      window.removeEventListener("storage", syncLocalData);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [fetchStatusFromBackend]);

  // ── logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout backend gagal:", error);
    } finally {
      clearAuthSession();
      navigate("/login");
    }
  };

  // ── withdraw ─────────────────────────────────────────────────────────────
  const openWithdrawModal  = () => setShowWithdrawModal(true);
  const closeWithdrawModal = () => setShowWithdrawModal(false);

  const handleConfirmWithdraw = () => {
    setShowWithdrawModal(false);
    setShowSuccessToast(true);
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    redirectTimerRef.current = setTimeout(() => {
      removeScopedItem(USER_STORAGE_KEYS.appliedJob);
      navigate("/status-lamaran", { replace: true });
    }, 800);
  };

  // ── derived values ───────────────────────────────────────────────────────
  const displayName = useMemo(
    () => savedProfile.fullName?.trim() || "",
    [savedProfile.fullName]
  );

  const displayEmail = useMemo(
    () => savedProfile.email?.trim() || "",
    [savedProfile.email]
  );

  const shortEmail = useMemo(() => {
    if (!displayEmail) return "";
    return displayEmail.length > 18
      ? `${displayEmail.slice(0, 18)}...`
      : displayEmail;
  }, [displayEmail]);

  const currentStage = appliedJob.stage || "Administrasi";
  const isWithdrawn  = rawStatus === "REJECTED";
  const isRejected   = rawStatus === "REJECTED";

  // Step ditentukan dari STAGE_MAP, bukan input user
  const steps = [
    {
      no: 1,
      key: "Administrasi",
      title: "Administrasi",
      dbStatuses: ["PENDING", "REVIEWED"],
      content:
        "Proses seleksi administrasi sedang berlangsung. Pastikan data diri dan dokumen yang Anda kirim sudah benar serta sesuai dengan persyaratan lowongan.",
    },
    {
      no: 2,
      key: "Lolos Seleksi",
      title: "Lolos Seleksi",
      dbStatuses: ["SHORTLISTED", "INTERVIEW"],
      content:
        "Selamat, Anda lolos tahap seleksi awal. Silakan pantau informasi berikutnya secara berkala pada halaman status lamaran.",
    },
    {
      no: 3,
      key: "Pelaksanaan",
      title: "Pelaksanaan",
      dbStatuses: ["OFFER"],
      content:
        "Program sedang memasuki tahap pelaksanaan. Pastikan Anda mengikuti seluruh arahan dan jadwal yang telah ditentukan oleh perusahaan.",
    },
    {
      no: 4,
      key: "Lulus Magang",
      title: "Lulus Magang",
      dbStatuses: [],
      content:
        "Selamat, Anda telah menyelesaikan program magang. Semoga pengalaman ini bermanfaat untuk pengembangan karir Anda.",
    },
  ];

  // Index step yang sedang aktif
  const activeStepIndex = steps.findIndex((s) => s.key === currentStage);

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <div className="profilePage historiPage">
      {/* ── Header ── */}
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
        {/* ── Sidebar ── */}
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
                  <div className="asideName">{displayName || "Nama Pengguna"}</div>
                  <div className="asideEmail">{shortEmail || "email@domain.com"}</div>
                </div>
              </div>
            </div>

            <nav className="asideNav" aria-label="Sidebar Navigation">
              <NavLink
                to="/profil"
                end={false}
                className={({ isActive }) => `asideLink ${isActive ? "isActive" : ""}`}
              >
                <span className="asideIcon" aria-hidden="true">
                  <img src="/CV.png" alt="CV" className="asideIconImg" />
                </span>
                <span className="asideLabel">Curriculum Vitae</span>
              </NavLink>

              <NavLink
                to="/status-lamaran"
                className={() => `asideLink ${isStatusLamaranGroup ? "isActive" : ""}`}
              >
                <span className="asideIcon" aria-hidden="true">
                  <img src="/StatusLamaran.png" alt="Status Lamaran" className="asideIconImg" />
                </span>
                <span className="asideLabel">Status Lamaran</span>
              </NavLink>

              <NavLink
                to="/pretest"
                className={({ isActive }) => `asideLink ${isActive ? "isActive" : ""}`}
              >
                <span className="asideIcon" aria-hidden="true">
                  <img src="/Pretest.png" alt="Pre-Test" className="asideIconImg" />
                </span>
                <span className="asideLabel">Pre-Test</span>
              </NavLink>

              <NavLink
                to="/home"
                className={({ isActive }) => `asideLink ${isActive ? "isActive" : ""}`}
              >
                <span className="asideIcon" aria-hidden="true">
                  <img src="/home.png" alt="home" className="asideIconImg" />
                </span>
                <span className="asideLabel">Beranda</span>
              </NavLink>

              <div className="asideDivider" />

              <button type="button" className="asideLink" onClick={handleLogout}>
                <span className="asideIcon" aria-hidden="true">
                  <img src="/Keluar.png" alt="Keluar" className="asideIconImg" />
                </span>
                <span className="asideLabel">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="main">
          <div className="mainCard historiMainCard">

            {/* Header row */}
            <div className="historiHeaderRow">
              <div className="historiHeaderText">
                <h1 className="historiTitle">Status Lamaran</h1>
                <p className="historiSubtitle">
                  Pantau semua aktivitas lamaran Anda dan cek perkembangan
                  terbaru dari lowongan yang sudah Anda daftar.
                </p>
              </div>
              {isFetching && (
                <span className="historiSyncLabel">
                  <span className="historiSyncDot" />
                  Menyinkronkan...
                </span>
              )}
            </div>

            {/* Filter chips */}
            <div className="historiFilterRow">
              <button className="historiFilterChip isActive" type="button">
                Semua
              </button>
            </div>

            <div className="historiContentWrap">

              {/* ── Belum ada lamaran ── */}
              {!hasApplication ? (
                <div className="historiEmptyState">
                  <div className="historiEmptyIcon">📋</div>
                  <h3>Belum ada lamaran</h3>
                  <p>Anda belum mendaftar ke lowongan manapun.</p>
                  <button
                    className="historiCariBtn"
                    type="button"
                    onClick={() => navigate("/home")}
                  >
                    Cari Lowongan
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Job Card ── */}
                  <div className="historiJobCard">
                    <div className="historiJobLeft">
                      <div className="historiCompanyIcon" aria-hidden="true">
                        <div className="historiBuilding">
                          <span /><span /><span />
                          <span /><span /><span />
                        </div>
                      </div>

                      <div className="historiJobMeta">
                        <h2 className="historiJobTitle">{appliedJob.title}</h2>
                        <p className="historiCompanyLine">
                          {appliedJob.company}
                          <span className="historiDot">•</span>
                          {appliedJob.location}
                          <span className="historiBadge">
                            {appliedJob.type || "MAGANG"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Badge status asli dari DB */}
                    <div className="historiStageWrap">
                      <span className={`historiStatusBadge ${getStatusColor(rawStatus)}`}>
                        {getStatusLabel(rawStatus)}
                      </span>
                      <button
                        className={`historiStagePill ${isRejected ? "isWithdrawn" : ""}`}
                        type="button"
                      >
                        {currentStage}
                      </button>
                    </div>
                  </div>

                  {/* ── State REJECTED ── */}
                  {isRejected ? (
                    <div className="historiWithdrawStateBox">
                      <div className="historiWithdrawStateIcon">✕</div>
                      <div className="historiWithdrawStateText">
                        <h3>Lamaran tidak dilanjutkan</h3>
                        <p>
                          Mohon maaf, lamaran Anda untuk posisi{" "}
                          <strong>{appliedJob.title}</strong> di{" "}
                          <strong>{appliedJob.company}</strong> tidak dapat
                          dilanjutkan ke tahap berikutnya. Jangan menyerah,
                          terus coba kesempatan lain!
                        </p>
                        <button
                          className="historiCariBtn"
                          type="button"
                          onClick={() => navigate("/home")}
                        >
                          Cari Lowongan Lain
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Timeline steps ── */
                    <div className="historiTimeline">
                      {steps.map((step, index) => {
                        const isActive  = step.key === currentStage;
                        const isPassed  = index < activeStepIndex;
                        const isLast    = index === steps.length - 1;

                        return (
                          <div
                            key={step.no}
                            className={[
                              "historiStep",
                              isActive ? "isActive"  : "",
                              isPassed ? "isPassed"  : "",
                              isLast   ? "isLast"    : "",
                            ].join(" ").trim()}
                          >
                            <div className="historiStepMarkerWrap">
                              <div className="historiStepMarker">
                                {isPassed ? "✓" : step.no}
                              </div>
                              {!isLast && (
                                <div
                                  className={`historiStepLine ${isPassed ? "isPassed" : ""}`}
                                  aria-hidden="true"
                                />
                              )}
                            </div>

                            <div className="historiStepContent">
                              <h3 className="historiStepTitle">{step.title}</h3>

                              {isActive && (
                                <>
                                  <div className="historiInfoBox">
                                    <span className="historiInfoIcon" aria-hidden="true">i</span>
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

                              {isPassed && (
                                <p className="historiStepPassedLabel">
                                  Tahap ini telah selesai
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Modal konfirmasi withdraw ── */}
      {showWithdrawModal && (
        <div className="historiModalOverlay" onClick={closeWithdrawModal}>
          <div className="historiModalCard" onClick={(e) => e.stopPropagation()}>
            <div className="historiModalIcon">!</div>
            <h3 className="historiModalTitle">Konfirmasi Pengunduran Diri</h3>
            <p className="historiModalText">
              Apakah Anda yakin ingin mengundurkan diri dari lowongan{" "}
              <strong>{appliedJob.title}</strong> di{" "}
              <strong>{appliedJob.company}</strong>?
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

      {/* ── Toast sukses withdraw ── */}
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