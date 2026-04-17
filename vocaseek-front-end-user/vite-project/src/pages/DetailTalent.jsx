code = '''import React from "react";
import "../styles/DetailTalent.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  ArrowLeft,
  Mail,
  Download,
  UserRound,
  GraduationCap,
  FolderOpen,
  ShieldCheck,
  Folder,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyCandidateDetail } from "../services/companyTalent";

// ── Sub-components ─────────────────────────────────────────────────────────────

function InfoLabel({ title, value }) {
  return (
    <div className="detail-talent__info-label">
      <div className="detail-talent__info-label-title">{title}</div>
      <div className="detail-talent__info-label-value">{value || "-"}</div>
    </div>
  );
}

function Chip({ children, blue = false }) {
  return (
    <span
      className={`detail-talent__chip ${
        blue ? "detail-talent__chip--blue" : "detail-talent__chip--default"
      }`}
    >
      {children}
    </span>
  );
}

function FileItem({ title, subtitle, color = "orange", empty = false, onClick }) {
  const colorClassMap = {
    orange: "detail-talent__file-icon--orange",
    blue:   "detail-talent__file-icon--blue",
    green:  "detail-talent__file-icon--green",
    gray:   "detail-talent__file-icon--gray",
  };

  return (
    <div
      onClick={!empty && onClick ? onClick : undefined}
      className={`detail-talent__file-item ${
        empty
          ? "detail-talent__file-item--empty"
          : "detail-talent__file-item--filled"
      }`}
    >
      <div className="detail-talent__file-item-left">
        <div className={`detail-talent__file-icon ${colorClassMap[color]}`}>
          {title.includes("Curriculum") && <FileText size={20} />}
          {title.includes("Portfolio")  && <Folder size={20} />}
          {title.includes("KTP")        && <BadgeCheck size={20} />}
          {title.includes("Surat")      && <FileText size={20} />}
          {title.includes("Transkrip")  && <GraduationCap size={20} />}
        </div>
        <div>
          <div
            className={`detail-talent__file-title ${
              empty
                ? "detail-talent__file-title--empty"
                : "detail-talent__file-title--filled"
            }`}
          >
            {title}
          </div>
          <div className="detail-talent__file-subtitle">{subtitle}</div>
        </div>
      </div>

      <button
        type="button"
        className={`detail-talent__file-action ${
          empty
            ? "detail-talent__file-action--empty"
            : "detail-talent__file-action--filled"
        }`}
      >
        {empty ? "Kosong" : "Lihat File"}
      </button>
    </div>
  );
}

function SkeletonBlock({ width = "100%", height = 16, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 6,
        background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        ...style,
      }}
    />
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DetailTalent() {
  const navigate = useNavigate();
  // id = integer dari route /admin/mitra/talent/:id/detail
  const { id } = useParams();

  const [talent,    setTalent]    = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error,     setError]     = React.useState("");

  // ── Fetch dari backend ───────────────────────────────────────────────────
  React.useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError("");

    getCompanyCandidateDetail(id)
      .then((res) => {
        const d = res?.data?.data;
        if (!d) throw new Error("Data tidak ditemukan");
        setTalent(d);
      })
      .catch((err) => {
        console.error(err);
        setError("Data kandidat tidak ditemukan atau terjadi kesalahan.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // ── Navigate helpers ─────────────────────────────────────────────────────
  const goToReviewDokumen = () => navigate(`/talent/${id}/review-dokumen`);
const goToAssessment    = () => navigate(`/talent/${id}/assessment-review`);

  const handleDownloadCv = () => {
    const url = talent?.documents?.cv;
    if (url) window.open(url, "_blank");
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="detail-talent">
        <Sidebar />
        <main className="detail-talent__main">
          <Topbar />
          <section className="detail-talent__section" style={{ padding: "2rem" }}>
            <SkeletonBlock height={32} width="40%" style={{ marginBottom: 24 }} />
            <div style={{ display: "flex", gap: 24 }}>
              <SkeletonBlock width="30%" height={500} />
              <SkeletonBlock width="40%" height={500} />
              <SkeletonBlock width="30%" height={500} />
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ── Error / not found state ──────────────────────────────────────────────
  if (error || !talent) {
    return (
      <div className="detail-talent">
        <Sidebar />
        <main className="detail-talent__main">
          <Topbar />
          <section className="detail-talent__section">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>{error || "Data tidak ditemukan."}</p>
              <button
                onClick={() => navigate(-1)}
                className="detail-talent__back-btn"
                style={{ marginTop: "1rem" }}
              >
                <ArrowLeft size={18} /> Kembali
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ── Destructure response dari getCandidateDetail ─────────────────────────
  // Shape: { personal, academic, assessment, documents }
  const { personal, academic, assessment, documents } = talent;

  return (
    <div className="detail-talent">
      <Sidebar />

      <main className="detail-talent__main">
        <Topbar />

        <section className="detail-talent__section">

          {/* Breadcrumb */}
          <div className="detail-talent__breadcrumb">
            <span className="detail-talent__breadcrumb-muted">ADMIN</span>
            <span className="detail-talent__breadcrumb-muted">›</span>
            <span className="detail-talent__breadcrumb-muted">TALENT MANAGEMENT</span>
            <span className="detail-talent__breadcrumb-muted">›</span>
            <span className="detail-talent__breadcrumb-active">DETAIL PROFIL</span>
          </div>

          {/* Header */}
          <div className="detail-talent__header">
            <div className="detail-talent__header-left">
              <button
                onClick={() => navigate(-1)}
                className="detail-talent__back-btn"
              >
                <ArrowLeft size={28} />
              </button>
              <h1 className="detail-talent__page-title">Ringkasan Profil Lengkap</h1>
            </div>

            <div className="detail-talent__header-actions">
              <button
                className="detail-talent__outline-btn"
                onClick={() =>
                  personal?.email && (window.location.href = `mailto:${personal.email}`)
                }
              >
                <Mail size={18} />
                Undang ke Email
              </button>
              <button
                className="detail-talent__primary-btn"
                onClick={handleDownloadCv}
                disabled={!documents?.cv}
              >
                <Download size={18} />
                Unduh CV
              </button>
            </div>
          </div>

          <div className="detail-talent__grid">

            {/* ===== KOLOM KIRI — DATA PRIBADI ===== */}
            <div className="detail-talent__card detail-talent__card--personal">
              <div className="detail-talent__card-header detail-talent__card-header--with-border">
                <UserRound size={22} className="detail-talent__card-header-icon" />
                <h2 className="detail-talent__card-title">Data Pribadi</h2>
              </div>

              {/* Avatar + Nama */}
              <div className="detail-talent__profile-top">
                <div className="detail-talent__avatar-wrapper">
                  <div className="detail-talent__avatar">
                    {personal?.photo ? (
                      <img
                        src={personal.photo}
                        alt="Foto Kandidat"
                        className="detail-talent__avatar-image"
                      />
                    ) : (
                      <div className="detail-talent__avatar-fallback">
                        {String(personal?.name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="detail-talent__avatar-status" />
                </div>
                <div className="detail-talent__profile-meta">
                  <div className="detail-talent__profile-name">
                    {personal?.name || "-"}
                  </div>
                  <div className="detail-talent__profile-role">
                    {personal?.role || "Candidate"}
                  </div>
                </div>
              </div>

              {/* Biodata */}
              <div className="detail-talent__bio-box">
                <div className="detail-talent__bio-label">Biodata</div>
                <p className="detail-talent__bio-text">
                  "{personal?.biodata || "Belum ada biodata."}"
                </p>
              </div>

              {/* Info list */}
              <div className="detail-talent__info-list">
                <InfoLabel title="Jenis Kelamin"          value={personal?.gender} />
                <InfoLabel title="Tempat, Tanggal Lahir"  value={personal?.birth} />
                <InfoLabel title="Email"                  value={personal?.email} />
                <InfoLabel title="No Handphone"           value={personal?.phone} />
                <InfoLabel title="Alamat Domisili"        value={personal?.address} />
              </div>

              {/* Social media */}
              <div className="detail-talent__social-section">
                <div className="detail-talent__social-label">Social Media</div>
                <div className="detail-talent__social-row">
                  <button
                    className="detail-talent__social-btn"
                    disabled={!personal?.socials?.linkedin}
                    onClick={() =>
                      personal?.socials?.linkedin &&
                      window.open(personal.socials.linkedin, "_blank")
                    }
                  >
                    <FaLinkedinIn size={16} /> LinkedIn
                  </button>
                  <button
                    className="detail-talent__social-btn"
                    disabled={!personal?.socials?.instagram}
                    onClick={() =>
                      personal?.socials?.instagram &&
                      window.open(personal.socials.instagram, "_blank")
                    }
                  >
                    <FaInstagram size={16} /> Instagram
                  </button>
                </div>
              </div>
            </div>

            {/* ===== KOLOM TENGAH — AKADEMIK & ASSESSMENT ===== */}
            <div className="detail-talent__center-column">

              {/* Akademik */}
              <div className="detail-talent__card">
                <div className="detail-talent__card-header detail-talent__card-header--with-border">
                  <GraduationCap size={22} className="detail-talent__card-header-icon" />
                  <h2 className="detail-talent__card-title">Data Akademik</h2>
                </div>

                <div className="detail-talent__card-body-top">
                  <div className="detail-talent__section-heading">Pendidikan</div>

                  <div className="detail-talent__education-row">
                    <div className="detail-talent__education-icon">
                      <GraduationCap
                        size={16}
                        className="detail-talent__education-icon-inner"
                      />
                    </div>
                    <div>
                      <div className="detail-talent__education-title">
                        {academic?.university || "-"}
                      </div>
                      <div className="detail-talent__education-subtitle">
                        {academic?.major || "-"}
                        <br />
                        IPK {academic?.ipk ?? "0.00"}
                        {academic?.graduation ? ` • Lulus ${academic.graduation}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Skills (dari backend bisa ditambahkan jika ada) */}
                  {Array.isArray(personal?.skills) && personal.skills.length > 0 && (
                    <>
                      <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                        Keahlian (Skills)
                      </div>
                      <div className="detail-talent__chip-row">
                        {personal.skills.map((s, i) => (
                          <Chip key={s} blue={i < 3}>{s}</Chip>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Assessment */}
              <div className="detail-talent__card">
                <div className="detail-talent__assessment-header">
                  <div className="detail-talent__assessment-icon-box">
                    <ShieldCheck
                      size={20}
                      className="detail-talent__assessment-icon"
                    />
                  </div>
                  <div>
                    <div className="detail-talent__assessment-title">
                      Hasil Online Assessment
                    </div>
                    <div className="detail-talent__assessment-subtitle">
                      {assessment?.date
                        ? `Kandidat menyelesaikan tes pada ${assessment.date}`
                        : "Belum ada data assessment"}
                    </div>
                  </div>
                </div>

                {/* Skor */}
                {assessment?.score !== undefined && (
                  <div style={{ textAlign: "center", margin: "12px 0" }}>
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 700,
                        color: "#3267e3",
                      }}
                    >
                      {assessment.score}
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: 14 }}> / 100</span>
                  </div>
                )}

                <div className="detail-talent__assessment-summary">
                  {assessment?.summary || "Belum ada ringkasan assessment."}
                </div>

                <div className="detail-talent__assessment-action">
                  <button
                    onClick={goToAssessment}
                    className="detail-talent__assessment-btn"
                  >
                    Review Jawaban
                  </button>
                </div>
              </div>
            </div>

            {/* ===== KOLOM KANAN — DOKUMEN ===== */}
            <div className="detail-talent__card detail-talent__card--documents">
              <div className="detail-talent__card-header detail-talent__card-header--with-border">
                <FolderOpen size={22} className="detail-talent__card-header-icon" />
                <h2 className="detail-talent__card-title">Dokumen Pendukung</h2>
              </div>

              <p className="detail-talent__documents-desc">
                Dokumen yang telah divalidasi dan diunggah oleh kandidat.
              </p>

              <FileItem
                title="Curriculum Vitae"
                subtitle={documents?.cv ? "CV tersedia" : "Belum ada file"}
                color="orange"
                empty={!documents?.cv}
                onClick={() => documents?.cv && window.open(documents.cv, "_blank")}
              />
              <FileItem
                title="Portfolio"
                subtitle={documents?.portfolio ? "Portfolio tersedia" : "Belum ada file"}
                color="blue"
                empty={!documents?.portfolio}
                onClick={() =>
                  documents?.portfolio && window.open(documents.portfolio, "_blank")
                }
              />
              <FileItem
                title="KTP / Identitas Diri"
                subtitle={documents?.ktp ? "KTP tersedia" : "Belum ada file"}
                color="green"
                empty={!documents?.ktp}
                onClick={() => documents?.ktp && window.open(documents.ktp, "_blank")}
              />
              <FileItem
                title="Surat Rekomendasi"
                subtitle="Belum ada file"
                color="gray"
                empty
              />
              <FileItem
                title="Transkrip Nilai"
                subtitle="Belum ada file"
                color="gray"
                empty
              />
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
'''

with open("/tmp/DetailTalent.jsx", "w") as f:
    f.write(code)
print("Done:", len(code), "chars")