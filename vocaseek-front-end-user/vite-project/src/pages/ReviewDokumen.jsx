import "../../../styles/admin/ReviewDokumen.css";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  FolderOpen,
  BadgeCheck,
  GraduationCap,
  ShieldCheck,
  Search,
  ZoomIn,
  Printer,
  Download,
  FileBadge,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function DocMenuItem({ title, subtitle, active = false, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`review-dokumen__doc-menu-item ${
        active
          ? "review-dokumen__doc-menu-item--active"
          : "review-dokumen__doc-menu-item--default"
      }`}
    >
      <div
        className={`review-dokumen__doc-icon-box ${
          active
            ? "review-dokumen__doc-icon-box--active"
            : "review-dokumen__doc-icon-box--default"
        }`}
      >
        {icon}
      </div>
      <div>
        <div
          className={`review-dokumen__doc-title ${
            active
              ? "review-dokumen__doc-title--active"
              : "review-dokumen__doc-title--default"
          }`}
        >
          {title}
        </div>
        <div
          className={`review-dokumen__doc-subtitle ${
            active
              ? "review-dokumen__doc-subtitle--active"
              : "review-dokumen__doc-subtitle--default"
          }`}
        >
          {subtitle}
        </div>
      </div>
    </button>
  );
}

export default function ReviewDokumen() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ ambil id dari URL
  const location = useLocation();

  // ✅ Ambil data talent dari location.state (dikirim saat navigate dari DetailTalent)
  // Fallback ke placeholder kalau state kosong
  const talentFromState = location.state?.talent || null;

  const [talent, setTalent] = useState(talentFromState);
  const [activeDoc, setActiveDoc] = useState("cv");

  // Jika tidak ada state, bisa fetch dari API berdasarkan id
  useEffect(() => {
    if (!talent && id) {
      // TODO: ganti dengan API call sebenarnya
      // contoh: fetchTalentById(id).then(data => setTalent(data));
      // Sementara pakai placeholder agar tidak kosong
      setTalent({
        name: id.toUpperCase(),
        role: "Kandidat",
        photo: null,
        documents: {
          cv: { name: `CV_${id}.pdf`, size: "2.4 MB", date: "-" },
          portfolio: { name: `Portfolio_${id}.pdf`, size: "12.4 MB", date: "-" },
          ktp: { name: `KTP_${id}.jpg`, size: "1.2 MB", date: "-" },
          transkrip: { name: `Transkrip_${id}.pdf`, size: "4.8 MB", date: "-" },
        },
      });
    }
  }, [id, talent]);

  const docList = [
    {
      key: "cv",
      title: "Curriculum Vitae",
      subtitle: talent?.documents?.cv?.name || "PDF",
      icon: <FileText size={18} />,
    },
    {
      key: "portfolio",
      title: "Portfolio",
      subtitle: talent?.documents?.portfolio?.name || "PDF",
      icon: <FolderOpen size={18} />,
    },
    {
      key: "ktp",
      title: "KTP / ID Card",
      subtitle: talent?.documents?.ktp?.name || "JPG",
      icon: <BadgeCheck size={18} />,
    },
    {
      key: "transkrip",
      title: "Transkrip Nilai",
      subtitle: talent?.documents?.transkrip?.name || "PDF",
      icon: <GraduationCap size={18} />,
    },
  ];

  const activeDocData = talent?.documents?.[activeDoc];

  return (
    <div className="review-dokumen">
      <Sidebar />

      <main className="review-dokumen__main">
        <Topbar />

        <section className="review-dokumen__section">
          <div className="review-dokumen__breadcrumb">
            <span className="review-dokumen__breadcrumb-muted">ADMIN</span>
            <span className="review-dokumen__breadcrumb-muted">›</span>
            <span className="review-dokumen__breadcrumb-muted">TALENT MANAGEMENT</span>
            <span className="review-dokumen__breadcrumb-muted">›</span>
            <span className="review-dokumen__breadcrumb-muted">DETAIL PROFIL</span>
            <span className="review-dokumen__breadcrumb-muted">›</span>
            <span className="review-dokumen__breadcrumb-active">REVIEW DOKUMEN</span>
          </div>

          <div className="review-dokumen__header">
            <div className="review-dokumen__candidate">
              <div className="review-dokumen__avatar-box">
                {talent?.photo ? (
                  <img
                    src={talent.photo}
                    alt="Kandidat"
                    className="review-dokumen__avatar-image"
                  />
                ) : (
                  <div className="review-dokumen__avatar-fallback">
                    {talent?.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              <div>
                <h1 className="review-dokumen__title">
                  {talent?.name || "Memuat..."}
                </h1>
                <div className="review-dokumen__role-row">
                  <BriefcaseBusiness size={15} />
                  <span>{talent?.role || id?.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* ✅ tombol kembali ke detail talent dengan id yang sama */}
            <button
              onClick={() => navigate(`/admin/mitra/talent/${id}`)}
              className="review-dokumen__back-btn"
            >
              <ArrowLeft size={22} />
              Kembali
            </button>
          </div>

          <div className="review-dokumen__grid">
            {/* ===== KIRI — LIST DOKUMEN ===== */}
            <div className="review-dokumen__left-column">
              <div className="review-dokumen__menu-label">Application Documents</div>

              <div className="review-dokumen__menu-list">
                {docList.map((doc) => (
                  <DocMenuItem
                    key={doc.key}
                    title={doc.title}
                    subtitle={activeDoc === doc.key ? "Active Viewing" : doc.subtitle}
                    active={activeDoc === doc.key}
                    icon={doc.icon}
                    onClick={() => setActiveDoc(doc.key)}
                  />
                ))}
              </div>

              <div className="review-dokumen__verified-box">
                <div className="review-dokumen__verified-row">
                  <div className="review-dokumen__verified-icon-box">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="review-dokumen__verified-title">Verified Document</div>
                    <p className="review-dokumen__verified-text">
                      This document has been automatically verified by our system
                      for authenticity and malware safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== KANAN — PREVIEW DOKUMEN ===== */}
            <div className="review-dokumen__right-column">
              <div className="review-dokumen__toolbar">
                <div className="review-dokumen__toolbar-info">
                  <div className="review-dokumen__toolbar-file-icon">
                    <FileBadge size={20} />
                  </div>
                  <div>
                    <div className="review-dokumen__toolbar-file-name">
                      {activeDocData?.name || "-"}
                    </div>
                    <div className="review-dokumen__toolbar-file-meta">
                      Uploaded on: {activeDocData?.date || "-"}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      Size: {activeDocData?.size || "-"}
                    </div>
                  </div>
                </div>

                <div className="review-dokumen__toolbar-actions">
                  <div className="review-dokumen__zoom-box">
                    <button className="review-dokumen__icon-btn">
                      <Search size={16} />
                    </button>
                    <span className="review-dokumen__zoom-text">100%</span>
                    <button className="review-dokumen__icon-btn">
                      <ZoomIn size={16} />
                    </button>
                  </div>

                  <button className="review-dokumen__secondary-btn">
                    <Printer size={18} />
                    Print
                  </button>

                  <button className="review-dokumen__primary-btn">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>

              {/* Preview area — tampilkan nama file sementara */}
              <div className="review-dokumen__preview-shell">
                <div className="review-dokumen__preview-page">
                  <div className="review-dokumen__resume-top">
                    <div>
                      <h2 className="review-dokumen__resume-name">
                        {talent?.name || "Nama Kandidat"}
                      </h2>
                      <div className="review-dokumen__resume-role">
                        {talent?.role || "-"}
                      </div>
                      <div className="review-dokumen__resume-contact">
                        <span>✉ {talent?.email || "-"}</span>
                        <span>📞 {talent?.phone || "-"}</span>
                        <span>📍 {talent?.address || "-"}</span>
                      </div>
                    </div>

                    <div className="review-dokumen__resume-avatar">
                      {talent?.photo ? (
                        <img
                          src={talent.photo}
                          alt="Kandidat"
                          className="review-dokumen__resume-avatar-image"
                        />
                      ) : (
                        <div className="review-dokumen__avatar-fallback review-dokumen__avatar-fallback--lg">
                          {talent?.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-dokumen__resume-bar" />

                  <div className="review-dokumen__resume-grid">
                    <div>
                      <div className="review-dokumen__resume-section">
                        <div className="review-dokumen__resume-section-head">
                          <div className="review-dokumen__resume-section-bar" />
                          <h3 className="review-dokumen__resume-section-title">
                            Professional Summary
                          </h3>
                        </div>
                        <p className="review-dokumen__resume-text">
                          {talent?.summary || "Data belum tersedia."}
                        </p>
                      </div>

                      <div className="review-dokumen__resume-section">
                        <div className="review-dokumen__resume-section-head review-dokumen__resume-section-head--mb">
                          <div className="review-dokumen__resume-section-bar" />
                          <h3 className="review-dokumen__resume-section-title">
                            Experience
                          </h3>
                        </div>

                        <div className="review-dokumen__timeline">
                          {talent?.experiences?.length > 0 ? (
                            talent.experiences.map((exp, i) => (
                              <div key={i} className="review-dokumen__timeline-item">
                                <span
                                  className={`review-dokumen__timeline-dot ${
                                    i === 0
                                      ? "review-dokumen__timeline-dot--active"
                                      : "review-dokumen__timeline-dot--inactive"
                                  }`}
                                />
                                <div className="review-dokumen__timeline-title">
                                  {exp.title}
                                </div>
                                <div
                                  className={`review-dokumen__timeline-company ${
                                    i === 0
                                      ? "review-dokumen__timeline-company--active"
                                      : ""
                                  }`}
                                >
                                  {exp.company} | {exp.period}
                                </div>
                                <p className="review-dokumen__timeline-text">
                                  {exp.description}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="review-dokumen__resume-text">
                              Data pengalaman belum tersedia.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="review-dokumen__resume-side">
                      <div>
                        <div className="review-dokumen__resume-side-title">Skills</div>
                        <div className="review-dokumen__skill-list">
                          {talent?.skills?.length > 0 ? (
                            talent.skills.map((skill) => (
                              <div key={skill} className="review-dokumen__skill-chip">
                                {skill}
                              </div>
                            ))
                          ) : (
                            <p className="review-dokumen__resume-text">-</p>
                          )}
                        </div>
                      </div>

                      <div className="review-dokumen__resume-side-block">
                        <div className="review-dokumen__resume-side-title">Education</div>
                        <div className="review-dokumen__education-degree">
                          {talent?.education?.degree || "-"}
                        </div>
                        <div className="review-dokumen__education-meta">
                          {talent?.education?.institution || "-"} |{" "}
                          {talent?.education?.period || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="review-dokumen__resume-footer">
                    <span>Page 1 of 2</span>
                    <span>Generated via Vocaseek Portfolio Builder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}