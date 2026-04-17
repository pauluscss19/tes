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

function InfoLabel({ title, value }) {
  return (
    <div className="detail-talent__info-label">
      <div className="detail-talent__info-label-title">{title}</div>
      <div className="detail-talent__info-label-value">{value}</div>
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
      onClick={!empty ? onClick : undefined}
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

// ── Data dummy per ID — nanti ganti dengan API call ──────────────────────────
const TALENT_DATA = {
  "kdt-001": {
    name: "Sarah Jenkins",
    role: "Mechanical Engineer",
    photo: "/Sarah_Jenkins.png",
    gender: "Perempuan",
    birthplace: "Bandung, 12 Mei 1997",
    email: "sarah.j@example.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Ir. H. Juanda No. 100, Dago, Bandung, Jawa Barat",
    bio: "Saya adalah insinyur mesin yang berdedikasi dengan pengalaman lebih dari 4 tahun dalam desain sistem hidrolik dan manajemen proyek.",
    education: { name: "Institut Teknologi Bandung (ITB)", degree: "Sarjana Teknik Mesin • 2015 - 2019", gpa: "IPK 3.65" },
    experiences: [
      { title: "Senior Mechanical Engineer", company: "PT. Industri Maju Jaya", period: "2021 - Sekarang", active: true },
      { title: "Junior Engineer", company: "CV. Teknik Prima", period: "2019 - 2021", active: false },
    ],
    certifications: ["Certified Solidworks Professional", "Project Management Professional (PMP)"],
    skills: ["AutoCAD", "Solidworks", "MATLAB", "Team Leadership"],
    assessment: "Sarah menunjukkan kemampuan analitis yang sangat kuat, terutama dalam pemecahan masalah teknis. Pendekatannya yang sistematis sangat cocok untuk peran teknis yang membutuhkan presisi tinggi.",
    assessmentDate: "24 Okt 2023",
    documents: {
      cv:         { name: "CV - SarahJenkins.pdf",  size: "2.4 MB",  date: "12 Okt 2023", filled: true },
      portfolio:  { name: "Portfolio-Sarah.pdf",     size: "12.4 MB", date: "12 Okt 2023", filled: true },
      ktp:        { name: "KTP_3official.pdf",       size: "1.2 MB",  date: "12 Okt 2023", filled: true },
      surat:      { name: "Belum ada file",          size: "",        date: "",             filled: false },
      transkrip:  { name: "Belum ada file",          size: "",        date: "",             filled: false },
    },
  },
  // tambahkan ID lain di sini atau ganti dengan fetch API
};

export default function DetailTalent() {
  const navigate  = useNavigate();
  const { id }    = useParams(); // ✅ "kdt-001", "kdt-022", dst

  // Cari data berdasarkan id (case-insensitive)
  const talent = TALENT_DATA[id?.toLowerCase()] || null;

  const buildTalentState = () => ({ talent: talent ? { ...talent, id } : null });

  // Navigasi ke review-dokumen dengan membawa data talent
  const goToReviewDokumen = () =>
    navigate(`/talent/${id}/review-dokumen`, { state: buildTalentState() });

  const goToAssessment = () =>
    navigate(`/talent/${id}/assessment-review`, { state: buildTalentState() });

  // Fallback kalau ID tidak ditemukan
  if (!talent) {
    return (
      <div className="detail-talent">
        <Sidebar />
        <main className="detail-talent__main">
          <Topbar />
          <section className="detail-talent__section">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>Data kandidat <strong>{id?.toUpperCase()}</strong> tidak ditemukan.</p>
              <button
                onClick={() => navigate("/talent/semua-kandidat")}
                className="detail-talent__back-btn"
                style={{ marginTop: "1rem" }}
              >
                <ArrowLeft size={18} /> Kembali ke Daftar
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="detail-talent">
      <Sidebar />

      <main className="detail-talent__main">
        <Topbar />

        <section className="detail-talent__section">
          <div className="detail-talent__breadcrumb">
            <span className="detail-talent__breadcrumb-muted">ADMIN</span>
            <span className="detail-talent__breadcrumb-muted">›</span>
            <span className="detail-talent__breadcrumb-muted">TALENT MANAGEMENT</span>
            <span className="detail-talent__breadcrumb-muted">›</span>
            <span className="detail-talent__breadcrumb-active">DETAIL PROFIL</span>
          </div>

          <div className="detail-talent__header">
            <div className="detail-talent__header-left">
              <button
                onClick={() => navigate("/talent/semua-kandidat")}
                className="detail-talent__back-btn"
              >
                <ArrowLeft size={28} />
              </button>
              <h1 className="detail-talent__page-title">Ringkasan Profil Lengkap</h1>
            </div>

            <div className="detail-talent__header-actions">
              <button className="detail-talent__outline-btn">
                <Mail size={18} />
                Undang ke Email
              </button>
              <button className="detail-talent__primary-btn">
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

              <div className="detail-talent__profile-top">
                <div className="detail-talent__avatar-wrapper">
                  <div className="detail-talent__avatar">
                    {talent.photo ? (
                      <img
                        src={talent.photo}
                        alt="Foto Kandidat"
                        className="detail-talent__avatar-image"
                      />
                    ) : (
                      <div className="detail-talent__avatar-fallback">
                        {talent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="detail-talent__avatar-status" />
                </div>

                <div className="detail-talent__profile-meta">
                  <div className="detail-talent__profile-name">{talent.name}</div>
                  <div className="detail-talent__profile-role">{talent.role}</div>
                </div>
              </div>

              <div className="detail-talent__bio-box">
                <div className="detail-talent__bio-label">Biodata</div>
                <p className="detail-talent__bio-text">"{talent.bio}"</p>
              </div>

              <div className="detail-talent__info-list">
                <InfoLabel title="ID Kandidat"          value={id?.toUpperCase()} />
                <InfoLabel title="Jenis Kelamin"         value={talent.gender} />
                <InfoLabel title="Tempat, Tanggal Lahir" value={talent.birthplace} />
                <InfoLabel title="Email"                 value={talent.email} />
                <InfoLabel title="No Handphone"          value={talent.phone} />
                <InfoLabel title="Alamat Domisili"       value={talent.address} />
              </div>

              <div className="detail-talent__social-section">
                <div className="detail-talent__social-label">Social Media</div>
                <div className="detail-talent__social-row">
                  <button className="detail-talent__social-btn">
                    <FaLinkedinIn size={16} /> LinkedIn
                  </button>
                  <button className="detail-talent__social-btn">
                    <FaInstagram size={16} /> Instagram
                  </button>
                </div>
              </div>
            </div>

            {/* ===== KOLOM TENGAH — AKADEMIK & ASSESSMENT ===== */}
            <div className="detail-talent__center-column">
              <div className="detail-talent__card">
                <div className="detail-talent__card-header detail-talent__card-header--with-border">
                  <GraduationCap size={22} className="detail-talent__card-header-icon" />
                  <h2 className="detail-talent__card-title">Data Akademik</h2>
                </div>

                <div className="detail-talent__card-body-top">
                  <div className="detail-talent__section-heading">Pendidikan</div>

                  <div className="detail-talent__education-row">
                    <div className="detail-talent__education-icon">
                      <GraduationCap size={16} className="detail-talent__education-icon-inner" />
                    </div>
                    <div>
                      <div className="detail-talent__education-title">
                        {talent.education.name}
                      </div>
                      <div className="detail-talent__education-subtitle">
                        {talent.education.degree}
                        <br />
                        {talent.education.gpa}
                      </div>
                    </div>
                  </div>

                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                    Pengalaman Kerja
                  </div>

                  <div className="detail-talent__timeline">
                    {talent.experiences.map((exp, i) => (
                      <div key={i} className="detail-talent__timeline-item">
                        <span
                          className={`detail-talent__timeline-dot ${
                            exp.active
                              ? "detail-talent__timeline-dot--active"
                              : "detail-talent__timeline-dot--inactive"
                          }`}
                        />
                        <div className="detail-talent__timeline-title">{exp.title}</div>
                        <div className="detail-talent__timeline-subtitle">
                          {exp.company}
                          <br />
                          {exp.period}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                    Lisensi & Sertifikasi
                  </div>
                  <div className="detail-talent__chip-row">
                    {talent.certifications.map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </div>

                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                    Keahlian (Skills)
                  </div>
                  <div className="detail-talent__chip-row">
                    {talent.skills.map((s, i) => (
                      <Chip key={s} blue={i < 3}>{s}</Chip>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-talent__card">
                <div className="detail-talent__assessment-header">
                  <div className="detail-talent__assessment-icon-box">
                    <ShieldCheck size={20} className="detail-talent__assessment-icon" />
                  </div>
                  <div>
                    <div className="detail-talent__assessment-title">
                      Hasil Online Assessment
                    </div>
                    <div className="detail-talent__assessment-subtitle">
                      Kandidat menyelesaikan tes pada {talent.assessmentDate}
                    </div>
                  </div>
                </div>

                <div className="detail-talent__assessment-summary">
                  {talent.assessment}
                </div>

                <div className="detail-talent__assessment-action">
                  {/* ✅ navigasi dinamis */}
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
                subtitle={talent.documents.cv.name}
                color="orange"
                empty={!talent.documents.cv.filled}
                onClick={goToReviewDokumen}
              />
              <FileItem
                title="Portfolio"
                subtitle={talent.documents.portfolio.name}
                color="blue"
                empty={!talent.documents.portfolio.filled}
                onClick={goToReviewDokumen}
              />
              <FileItem
                title="KTP / Identitas Diri"
                subtitle={talent.documents.ktp.name}
                color="green"
                empty={!talent.documents.ktp.filled}
                onClick={goToReviewDokumen}
              />
              <FileItem
                title="Surat Rekomendasi"
                subtitle={talent.documents.surat.name}
                color="gray"
                empty={!talent.documents.surat.filled}
              />
              <FileItem
                title="Transkrip Nilai"
                subtitle={talent.documents.transkrip.name}
                color="gray"
                empty={!talent.documents.transkrip.filled}
              />
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}