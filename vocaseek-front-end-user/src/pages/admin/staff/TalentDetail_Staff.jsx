import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import {
  ArrowLeft, Mail, Download, UserRound, GraduationCap,
  FolderOpen, Link as LinkIcon, Camera, ShieldCheck,
  Folder, FileText, BadgeCheck, User, CreditCard,
} from "lucide-react";
import "../../../styles/TalentDetail.css";
import { getAdminTalentDetail } from "../../../services/admin";
import { getApiErrorMessage } from "../../../services/auth";
import { mapTalentDetailPayload } from "../../../utils/talentProfile";

// ─── Sub-components ────────────────────────────────────────────────────────────

function InfoLabel({ title, value }) {
  return (
    <div className="detail-info-item">
      <div className="detail-info-label">{title}</div>
      <div className="detail-info-value">{value || "-"}</div>
    </div>
  );
}

function Chip({ children, blue = false }) {
  return (
    <span className={`detail-chip ${blue ? "blue" : "default"}`}>
      {children}
    </span>
  );
}

function FileItem({ document, color = "orange", onDownload }) {
  const colorClass = { orange: "orange", blue: "blue", green: "green", gray: "gray" };
  const { title, subtitle, available, url } = document;

  const handleOpen = () => {
    if (!available || !url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!available || !url) return;
    if (onDownload) { onDownload(); return; }
    const a    = document.createElement("a");
    a.href     = url;
    a.download = subtitle || title;
    a.target   = "_blank";
    a.rel      = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderIcon = () => {
    if (title.includes("Curriculum") || title.includes("CV"))         return <FileText size={20} />;
    if (title.includes("Portfolio")  || title.includes("Portofolio")) return <Folder size={20} />;
    if (title.includes("KTP"))                                         return <BadgeCheck size={20} />;
    if (title.includes("KTM")        || title.includes("Mahasiswa"))   return <CreditCard size={20} />;
    if (title.includes("Surat"))                                       return <FileText size={20} />;
    if (title.includes("Transkrip"))                                   return <GraduationCap size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div
      onClick={handleOpen}
      className={`detail-file-item ${available ? "clickable" : "empty"}`}
    >
      <div className="detail-file-left">
        <div className={`detail-file-icon ${colorClass[color]}`}>
          {renderIcon()}
        </div>
        <div className="detail-file-text">
          <div className={`detail-file-title ${available ? "" : "empty"}`}>{title}</div>
          <div className="detail-file-subtitle">{subtitle}</div>
        </div>
      </div>
      <div className="detail-file-actions">
        {available ? (
          <>
            <button
              type="button"
              className="detail-file-action detail-file-action--view"
              onClick={(e) => { e.stopPropagation(); handleOpen(); }}
            >
              Lihat
            </button>
            <button
              type="button"
              className="detail-file-action detail-file-action--download"
              onClick={handleDownload}
            >
              <Download size={14} />
              Unduh
            </button>
          </>
        ) : (
          <span className="detail-file-action detail-file-action--empty">Kosong</span>
        )}
      </div>
    </div>
  );
}

function makeEmptyDoc(title) {
  return { title, subtitle: "Belum ada file", available: false, url: "" };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TalentDetailStaff() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [talent,       setTalent]       = useState(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadTalentDetail = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAdminTalentDetail(id);
        const raw = response?.data?.data ?? response?.data ?? {};

        if (!isMounted) return;

        if (!raw || Object.keys(raw).length === 0) {
          setTalent(null);
          setErrorMessage("Data talent tidak ditemukan.");
          return;
        }

        setTalent(mapTalentDetailPayload(raw));
      } catch (error) {
        if (!isMounted) return;
        setTalent(null);
        setErrorMessage(getApiErrorMessage(error, "Gagal memuat detail talent."));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTalentDetail();
    return () => { isMounted = false; };
  }, [id]);

  const profileImage   = useMemo(() => talent?.photo || "", [talent]);
  const documents      = talent?.documents      || {};
  const experiences    = talent?.experiences    || [];
  const certifications = talent?.certifications || [];
  const skills         = talent?.skills         || [];

  const handleDownloadCV = () => {
    if (!documents.cv?.available || !documents.cv?.url) return;
    const a    = document.createElement("a");
    a.href     = documents.cv.url;
    a.download = documents.cv.subtitle || "CV.pdf";
    a.target   = "_blank";
    a.rel      = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="detail-talent-layout">
      <Sidebar />
      <main className="detail-talent-main">
        <Topbar />
        <section className="detail-talent-content">

          {/* Breadcrumb */}
          <div className="detail-breadcrumb">
            <span>ADMIN</span>
            <span>&rsaquo;</span>
            <span>TALENT MANAGEMENT</span>
            <span>&rsaquo;</span>
            <span className="active">DETAIL PROFIL</span>
          </div>

          {/* Header */}
          <div className="detail-header">
            <div className="detail-header-left">
              <button
                onClick={() => navigate("/admin/staff/talent-management")}
                className="detail-back-button"
                type="button"
              >
                <ArrowLeft size={28} />
              </button>
              <h1 className="detail-page-title">Ringkasan Profil Lengkap</h1>
            </div>

            <div className="detail-header-actions">
              <button
                type="button"
                className="detail-outline-button"
                onClick={() => {
                  if (talent?.email && talent.email !== "-") {
                    window.location.href = `mailto:${talent.email}`;
                  }
                }}
              >
                <Mail size={18} />
                Undang ke Email
              </button>

              <button
                type="button"
                className="detail-primary-button"
                onClick={handleDownloadCV}
                disabled={!documents.cv?.available}
                style={{
                  opacity: documents.cv?.available ? 1 : 0.5,
                  cursor:  documents.cv?.available ? "pointer" : "not-allowed",
                }}
              >
                <Download size={18} />
                {documents.cv?.available ? "Unduh CV" : "CV Belum Ada"}
              </button>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div style={{ marginBottom: 16, color: "#d93025", fontWeight: 500 }}>
              {errorMessage}
            </div>
          )}

          <div className="detail-grid">

            {/* ── KOLOM KIRI: Data Pribadi ───────────────────────────────── */}
            <div className="detail-card">
              <div className="detail-card-header">
                <UserRound size={22} className="detail-card-header-icon" />
                <h2>Data Pribadi</h2>
              </div>

              <div className="detail-profile-section">
                <div className="detail-avatar-wrapper">
                  <div className={`detail-avatar-frame ${profileImage ? "" : "detail-avatar-empty"}`}>
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={talent?.name || "Foto Kandidat"}
                        className="detail-avatar-image"
                      />
                    ) : (
                      <div className="detail-avatar-placeholder">
                        <User size={44} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="detail-profile-name">
                  {isLoading ? "Memuat..." : talent?.name || "-"}
                </div>
                <div className="detail-profile-role">
                  {isLoading ? "Memuat data posisi..." : talent?.position || "-"}
                </div>
              </div>

              <div className="detail-biodata-box">
                <div className="detail-box-label">Biodata</div>
                <p>
                  {isLoading
                    ? "Memuat biodata..."
                    : talent?.about || "Belum ada biodata dari backend."}
                </p>
              </div>

              <div className="detail-info-list">
                <InfoLabel title="Jenis Kelamin"         value={talent?.gender} />
                <InfoLabel title="Tempat, Tanggal Lahir" value={talent?.birthPlaceAndDate} />
                <InfoLabel title="Email"                 value={talent?.email} />
                <InfoLabel title="No Handphone"          value={talent?.phone} />
                <InfoLabel title="Alamat Domisili"       value={talent?.address} />
                <InfoLabel title="Terdaftar Sejak"       value={talent?.registeredAt} />
              </div>

              <div className="detail-social-section">
                <div className="detail-box-label">Social Media</div>
                <div className="detail-social-buttons">
                  <button
                    type="button"
                    className="detail-social-button"
                    disabled={!talent?.linkedin}
                    onClick={() =>
                      talent?.linkedin &&
                      window.open(talent.linkedin, "_blank", "noopener,noreferrer")
                    }
                  >
                    <LinkIcon size={16} /> LinkedIn
                  </button>
                  <button
                    type="button"
                    className="detail-social-button"
                    disabled={!talent?.instagram}
                    onClick={() =>
                      talent?.instagram &&
                      window.open(talent.instagram, "_blank", "noopener,noreferrer")
                    }
                  >
                    <Camera size={16} /> Instagram
                  </button>
                </div>
              </div>
            </div>

            {/* ── KOLOM TENGAH: Akademik + Assessment ───────────────────── */}
            <div className="detail-middle-column">

              <div className="detail-card">
                <div className="detail-card-header">
                  <GraduationCap size={22} className="detail-card-header-icon" />
                  <h2>Data Akademik</h2>
                </div>

                <div className="detail-card-body">
                  <div className="detail-section-title">Pendidikan</div>
                  <div className="detail-education-row">
                    <div className="detail-education-icon">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <div className="detail-education-title">
                        {isLoading ? "Memuat..." : talent?.university || "Belum ada data pendidikan"}
                      </div>
                      <div className="detail-education-subtitle">
                        {talent?.major && talent.major !== "-"
                          ? `${talent.major}${talent.ipk ? ` • IPK ${talent.ipk}` : ""}`
                          : "-"}
                      </div>
                    </div>
                  </div>

                  <div className="detail-section-title work">Pengalaman Kerja</div>
                  <div className="detail-timeline">
                    {experiences.length > 0 ? (
                      experiences.map((exp, i) => (
                        <div key={i} className="detail-timeline-item">
                          <span className="detail-timeline-dot" />
                          <div className="detail-timeline-content">
                            <div className="detail-job-title">
                              {exp?.posisi || exp?.jabatan || exp?.title || "Pengalaman Kerja"}
                            </div>
                            <div className="detail-job-subtitle">
                              {exp?.perusahaan || exp?.company || exp?.deskripsi || "-"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="detail-timeline-item">
                        <span className="detail-timeline-dot inactive" />
                        <div className="detail-timeline-content">
                          <div className="detail-job-title">Belum ada pengalaman kerja</div>
                          <div className="detail-job-subtitle">-</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="detail-section-title work">Lisensi &amp; Sertifikasi</div>
                  <div className="detail-chip-group">
                    {certifications.length > 0 ? (
                      certifications.map((cert, i) => (
                        <Chip key={i}>
                          {/* ← PERUBAHAN: tambah cert?.name */}
                          {cert?.name || cert?.nama || cert?.title || cert?.sertifikasi || "Sertifikasi"}
                        </Chip>
                      ))
                    ) : (
                      <Chip>Belum ada data</Chip>
                    )}
                  </div>

                  <div className="detail-section-title work">Keahlian (Skills)</div>
                  <div className="detail-chip-group">
                    {skills.length > 0 ? (
                      skills.map((skill, i) => (
                        <Chip key={i} blue>
                          {skill?.nama || skill?.name || skill}
                        </Chip>
                      ))
                    ) : (
                      <Chip blue>Belum ada data</Chip>
                    )}
                  </div>
                </div>
              </div>

              {/* Hasil Online Assessment */}
              <div className="detail-card">
                <div className="detail-assessment-header">
                  <div className="detail-assessment-icon-box">
                    <ShieldCheck size={20} className="detail-assessment-icon" />
                  </div>
                  <div>
                    <div className="detail-assessment-title">Hasil Online Assessment</div>
                    <div className="detail-assessment-subtitle">
                      {talent?.assessment?.subtitle || "Belum ada hasil assessment"}
                    </div>
                  </div>
                </div>

                <div className="detail-assessment-box">
                  {talent?.assessment?.score && (
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>
                      Skor: {talent.assessment.score}
                    </div>
                  )}
                  {talent?.assessment?.summary || "Belum ada hasil assessment untuk ditampilkan."}
                </div>

                <div className="detail-assessment-footer">
                  <button
                    type="button"
                    className="detail-review-button"
                    onClick={() =>
                      navigate(
                        `/admin/staff/talent/${id}/assessment-review`,
                        { state: { email: talent?.email, name: talent?.name } },
                      )
                    }
                  >
                    Review Jawaban
                  </button>
                </div>
              </div>
            </div>

            {/* ── KOLOM KANAN: Dokumen Pendukung ────────────────────────── */}
            <div className="detail-card">
              <div className="detail-card-header">
                <FolderOpen size={22} className="detail-card-header-icon" />
                <h2>Dokumen Pendukung</h2>
              </div>

              <p className="detail-document-description">
                Dokumen yang telah divalidasi dan diunggah oleh kandidat.
              </p>

              <FileItem document={documents.cv             || makeEmptyDoc("Curriculum Vitae")}            color="orange" />
              <FileItem document={documents.portfolio      || makeEmptyDoc("Portofolio")}                  color="blue"   />
              <FileItem document={documents.identity       || makeEmptyDoc("KTP / Identitas Diri")}        color="green"  />
              <FileItem document={documents.recommendation || makeEmptyDoc("Surat Rekomendasi")}           color="gray"   />
              <FileItem document={documents.transcript     || makeEmptyDoc("Transkrip Nilai")}             color="blue"   />
              <FileItem document={documents.ktm            || makeEmptyDoc("Kartu Tanda Mahasiswa (KTM)")} color="green"  />
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}