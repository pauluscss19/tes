import "../../../styles/admin/DetailTalent.css";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import {
  ArrowLeft, Mail, Download, UserRound, GraduationCap,
  FolderOpen, ShieldCheck, Folder, FileText, BadgeCheck,
  Briefcase, Award,
} from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyCandidateDetail } from "../../../services/companyTalent";

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
    <span className={`detail-talent__chip ${blue ? "detail-talent__chip--blue" : "detail-talent__chip--default"}`}>
      {children}
    </span>
  );
}

function FileItem({ title, subtitle, color = "orange", empty = false, fileUrl }) {
  const colorClassMap = {
    orange: "detail-talent__file-icon--orange",
    blue:   "detail-talent__file-icon--blue",
    green:  "detail-talent__file-icon--green",
    gray:   "detail-talent__file-icon--gray",
  };

  const getIcon = () => {
    if (title.includes("Curriculum")) return <FileText size={20} />;
    if (title.includes("Portfolio"))  return <Folder size={20} />;
    if (title.includes("KTP"))        return <BadgeCheck size={20} />;
    if (title.includes("Surat"))      return <FileText size={20} />;
    if (title.includes("Transkrip"))  return <GraduationCap size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div
      onClick={() => { if (!empty && fileUrl) window.open(fileUrl, "_blank", "noopener,noreferrer"); }}
      className={`detail-talent__file-item ${empty ? "detail-talent__file-item--empty" : "detail-talent__file-item--filled"}`}
    >
      <div className="detail-talent__file-item-left">
        <div className={`detail-talent__file-icon ${colorClassMap[color]}`}>
          {getIcon()}
        </div>
        <div>
          <div className={`detail-talent__file-title ${empty ? "detail-talent__file-title--empty" : "detail-talent__file-title--filled"}`}>
            {title}
          </div>
          <div className="detail-talent__file-subtitle">{subtitle}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); if (!empty && fileUrl) window.open(fileUrl, "_blank", "noopener,noreferrer"); }}
        className={`detail-talent__file-action ${empty ? "detail-talent__file-action--empty" : "detail-talent__file-action--filled"}`}
        disabled={empty}
      >
        {empty ? "Kosong" : "Lihat File"}
      </button>
    </div>
  );
}

export default function DetailTalent() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCompanyCandidateDetail(id)
      .then((res) => { setData(res.data.data); setLoading(false); })
      .catch((err) => { console.error(err); setError("Gagal memuat data kandidat."); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="detail-talent">
      <Sidebar />
      <main className="detail-talent__main">
        <Topbar />
        <section className="detail-talent__section">
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            Memuat data kandidat...
          </div>
        </section>
      </main>
    </div>
  );

  if (error || !data) return (
    <div className="detail-talent">
      <Sidebar />
      <main className="detail-talent__main">
        <Topbar />
        <section className="detail-talent__section">
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p>{error || "Data tidak ditemukan."}</p>
            <button onClick={() => navigate(-1)} className="detail-talent__back-btn" style={{ marginTop: "1rem" }}>
              <ArrowLeft size={18} /> Kembali
            </button>
          </div>
        </section>
      </main>
    </div>
  );

  const { personal, academic, assessment, documents, experience = [], licenses = [] } = data;

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
              <button onClick={() => navigate("/admin/mitra/talent/semua-kandidat")} className="detail-talent__back-btn">
                <ArrowLeft size={28} />
              </button>
              <h1 className="detail-talent__page-title">Ringkasan Profil Lengkap</h1>
            </div>
            <div className="detail-talent__header-actions">
              <button className="detail-talent__outline-btn">
                <Mail size={18} /> Undang ke Email
              </button>
              {documents?.cv && (
                <a href={documents.cv} target="_blank" rel="noopener noreferrer" className="detail-talent__primary-btn">
                  <Download size={18} /> Unduh CV
                </a>
              )}
            </div>
          </div>

          <div className="detail-talent__grid">

            {/* ── KIRI: Data Pribadi ── */}
            <div className="detail-talent__card detail-talent__card--personal">
              <div className="detail-talent__card-header detail-talent__card-header--with-border">
                <UserRound size={22} className="detail-talent__card-header-icon" />
                <h2 className="detail-talent__card-title">Data Pribadi</h2>
              </div>
              <div className="detail-talent__profile-top">
                <div className="detail-talent__avatar-wrapper">
                  <div className="detail-talent__avatar">
                    {personal?.foto ? (
                      <img src={personal.foto} alt={personal.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }} />
                    ) : (
                      <div className="detail-talent__avatar-fallback">{personal?.name?.charAt(0) || "?"}</div>
                    )}
                  </div>
                  <div className="detail-talent__avatar-status" />
                </div>
                <div className="detail-talent__profile-meta">
                  <div className="detail-talent__profile-name">{personal?.name}</div>
                  <div className="detail-talent__profile-role">{personal?.role}</div>
                </div>
              </div>
              <div className="detail-talent__bio-box">
                <div className="detail-talent__bio-label">Biodata</div>
                <p className="detail-talent__bio-text">"{personal?.biodata}"</p>
              </div>
              <div className="detail-talent__info-list">
                <InfoLabel title="Jenis Kelamin"         value={personal?.gender} />
                <InfoLabel title="Tempat, Tanggal Lahir" value={personal?.birth} />
                <InfoLabel title="Email"                  value={personal?.email} />
                <InfoLabel title="No Handphone"           value={personal?.phone} />
                <InfoLabel title="Alamat Domisili"        value={personal?.address} />
              </div>
              <div className="detail-talent__social-section">
                <div className="detail-talent__social-label">Social Media</div>
                <div className="detail-talent__social-row">
                  {personal?.socials?.linkedin && (
                    <a href={personal.socials.linkedin} target="_blank" rel="noopener noreferrer" className="detail-talent__social-btn">
                      <FaLinkedinIn size={16} /> LinkedIn
                    </a>
                  )}
                  {personal?.socials?.instagram && (
                    <a href={personal.socials.instagram} target="_blank" rel="noopener noreferrer" className="detail-talent__social-btn">
                      <FaInstagram size={16} /> Instagram
                    </a>
                  )}
                  {!personal?.socials?.linkedin && !personal?.socials?.instagram && (
                    <span style={{ color:"var(--color-text-muted)", fontSize:"0.85rem" }}>Tidak ada social media</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── TENGAH: Akademik + Experience + Lisensi + Assessment ── */}
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
                      <GraduationCap size={16} className="detail-talent__education-icon-inner" />
                    </div>
                    <div>
                      <div className="detail-talent__education-title">{academic?.university || "-"}</div>
                      <div className="detail-talent__education-subtitle">
                        {academic?.major || "-"} • Lulus {academic?.graduation || "-"}
                        <br />IPK {academic?.ipk || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">Posisi Dilamar</div>
                  <div className="detail-talent__chip-row">
                    <Chip blue>{personal?.role}</Chip>
                  </div>
                </div>
              </div>

              {/* Pengalaman Kerja */}
              <div className="detail-talent__card">
                <div className="detail-talent__card-header detail-talent__card-header--with-border">
                  <Briefcase size={22} className="detail-talent__card-header-icon" />
                  <h2 className="detail-talent__card-title">Pengalaman Kerja</h2>
                </div>
                <div className="detail-talent__card-body-top">
                  {experience.length === 0 ? (
                    <p style={{ color:"var(--color-text-muted)", fontSize:"0.875rem" }}>
                      Belum ada pengalaman kerja.
                    </p>
                  ) : (
                    experience.map((exp, i) => (
                      <div key={i} className="detail-talent__education-row" style={{ marginBottom: i < experience.length - 1 ? "1rem" : 0 }}>
                        <div className="detail-talent__education-icon">
                          <Briefcase size={16} className="detail-talent__education-icon-inner" />
                        </div>
                        <div>
                          <div className="detail-talent__education-title">{exp.position} — {exp.company}</div>
                          <div className="detail-talent__education-subtitle">
                            {exp.period}
                            {exp.desc && <><br />{exp.desc}</>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Lisensi & Sertifikasi */}
              <div className="detail-talent__card">
                <div className="detail-talent__card-header detail-talent__card-header--with-border">
                  <Award size={22} className="detail-talent__card-header-icon" />
                  <h2 className="detail-talent__card-title">Lisensi & Sertifikasi</h2>
                </div>
                <div className="detail-talent__card-body-top">
                  {licenses.length === 0 ? (
                    <p style={{ color:"var(--color-text-muted)", fontSize:"0.875rem" }}>
                      Belum ada lisensi atau sertifikasi.
                    </p>
                  ) : (
                    licenses.map((lic, i) => (
                      <div key={i} className="detail-talent__education-row" style={{ marginBottom: i < licenses.length - 1 ? "1rem" : 0 }}>
                        <div className="detail-talent__education-icon">
                          <Award size={16} className="detail-talent__education-icon-inner" />
                        </div>
                        <div>
                          <div className="detail-talent__education-title">{lic.name}</div>
                          <div className="detail-talent__education-subtitle">{lic.issuer} • {lic.year}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Assessment */}
              <div className="detail-talent__card">
                <div className="detail-talent__assessment-header">
                  <div className="detail-talent__assessment-icon-box">
                    <ShieldCheck size={20} className="detail-talent__assessment-icon" />
                  </div>
                  <div>
                    <div className="detail-talent__assessment-title">Hasil Online Assessment</div>
                    <div className="detail-talent__assessment-subtitle">
                      Kandidat menyelesaikan tes pada {assessment?.date || "-"}
                    </div>
                  </div>
                </div>
                <div className="detail-talent__assessment-summary">
                  {assessment?.summary || "Belum ada hasil assessment."}
                  {assessment?.score > 0 && (
                    <div style={{ marginTop:"0.5rem", fontWeight:600 }}>Skor: {assessment.score}</div>
                  )}
                </div>
                <div className="detail-talent__assessment-action">
                  <button
                    onClick={() => navigate(`/admin/mitra/talent/${id}/assessment-review`, {
                      state: { name: personal?.name, foto: personal?.foto, assessmentAnswers: assessment?.answers || [] }
                    })}
                    className="detail-talent__assessment-btn"
                  >
                    Review Jawaban
                  </button>
                </div>
              </div>
            </div>

            {/* ── KANAN: Dokumen ── */}
            <div className="detail-talent__card detail-talent__card--documents">
              <div className="detail-talent__card-header detail-talent__card-header--with-border">
                <FolderOpen size={22} className="detail-talent__card-header-icon" />
                <h2 className="detail-talent__card-title">Dokumen Pendukung</h2>
              </div>
              <p className="detail-talent__documents-desc">
                Dokumen yang telah divalidasi dan diunggah oleh kandidat.
              </p>
              <FileItem title="Curriculum Vitae"   subtitle={documents?.cv               ? "CV tersedia"          : "Belum ada file"} color={documents?.cv               ? "orange" : "gray"} empty={!documents?.cv}               fileUrl={documents?.cv} />
              <FileItem title="Portfolio"           subtitle={documents?.portfolio        ? "Portfolio tersedia"   : "Belum ada file"} color={documents?.portfolio        ? "blue"   : "gray"} empty={!documents?.portfolio}        fileUrl={documents?.portfolio} />
              <FileItem title="KTP / Identitas Diri" subtitle={documents?.ktp            ? "KTP tersedia"         : "Belum ada file"} color={documents?.ktp              ? "green"  : "gray"} empty={!documents?.ktp}              fileUrl={documents?.ktp} />
              <FileItem title="Surat Rekomendasi"   subtitle={documents?.surat_rekomendasi ? "Tersedia"           : "Belum ada file"} color={documents?.surat_rekomendasi ? "blue"  : "gray"} empty={!documents?.surat_rekomendasi} fileUrl={documents?.surat_rekomendasi} />
              <FileItem title="Transkrip Nilai"     subtitle={documents?.transkrip       ? "Tersedia"             : "Belum ada file"} color={documents?.transkrip        ? "green"  : "gray"} empty={!documents?.transkrip}        fileUrl={documents?.transkrip} />
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}