import "../../../styles/admin/DetailTalent.css";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
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
    blue: "detail-talent__file-icon--blue",
    green: "detail-talent__file-icon--green",
    gray: "detail-talent__file-icon--gray",
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
          {title.includes("Portfolio") && <Folder size={20} />}
          {title.includes("KTP") && <BadgeCheck size={20} />}
          {title.includes("Surat") && <FileText size={20} />}
          {title.includes("Transkrip") && <GraduationCap size={20} />}
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

export default function DetailTalent() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ ambil id dari URL, misal "KDT-022"

  return (
    <div className="detail-talent">
      <Sidebar />

      <main className="detail-talent__main">
        <Topbar />

        <section className="detail-talent__section">
          <div className="detail-talent__breadcrumb">
            <span className="detail-talent__breadcrumb-muted">ADMIN</span>
            <span className="detail-talent__breadcrumb-muted">›</span>
            <span className="detail-talent__breadcrumb-muted">
              TALENT MANAGEMENT
            </span>
            <span className="detail-talent__breadcrumb-muted">›</span>
            <span className="detail-talent__breadcrumb-active">
              DETAIL PROFIL
            </span>
          </div>

          <div className="detail-talent__header">
            <div className="detail-talent__header-left">
              <button
                onClick={() => navigate("/admin/mitra/talent/semua-kandidat")}
                className="detail-talent__back-btn"
              >
                <ArrowLeft size={28} />
              </button>

              <h1 className="detail-talent__page-title">
                Ringkasan Profil Lengkap
              </h1>
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
                    <img
                      src="/Sarah_Jenkins.png"
                      alt="Foto Kandidat"
                      className="detail-talent__avatar-image"
                    />
                  </div>
                  <div className="detail-talent__avatar-status" />
                </div>

                <div className="detail-talent__profile-meta">
                  <div className="detail-talent__profile-name">Sarah Jenkins</div>
                  <div className="detail-talent__profile-role">Mechanical Engineer</div>
                </div>
              </div>

              <div className="detail-talent__bio-box">
                <div className="detail-talent__bio-label">Biodata</div>
                <p className="detail-talent__bio-text">
                  "Saya adalah insinyur mesin yang berdedikasi dengan pengalaman
                  lebih dari 4 tahun dalam desain sistem hidrolik dan manajemen
                  proyek. Saya memiliki semangat tinggi dalam memecahkan masalah
                  kompleks."
                </p>
              </div>

              <div className="detail-talent__info-list">
                <InfoLabel title="ID Kandidat" value={id?.toUpperCase()} />
                <InfoLabel title="Jenis Kelamin" value="Perempuan" />
                <InfoLabel title="Tempat, Tanggal Lahir" value="Bandung, 12 Mei 1997" />
                <InfoLabel title="Email" value="sarah.j@example.com" />
                <InfoLabel title="No Handphone" value="+62 812 3456 7890" />
                <InfoLabel
                  title="Alamat Domisili"
                  value="Jl. Ir. H. Juanda No. 100, Dago, Bandung, Jawa Barat"
                />
              </div>

              <div className="detail-talent__social-section">
                <div className="detail-talent__social-label">Social Media</div>
                <div className="detail-talent__social-row">
                  <button className="detail-talent__social-btn">
                    <FaLinkedinIn size={16} />
                    LinkedIn
                  </button>
                  <button className="detail-talent__social-btn">
                    <FaInstagram size={16} />
                    Instagram
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
                        Institut Teknologi Bandung (ITB)
                      </div>
                      <div className="detail-talent__education-subtitle">
                        Sarjana Teknik Mesin • 2015 - 2019
                        <br />
                        IPK 3.65
                      </div>
                    </div>
                  </div>

                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                    Pengalaman Kerja
                  </div>

                  <div className="detail-talent__timeline">
                    <div className="detail-talent__timeline-item">
                      <span className="detail-talent__timeline-dot detail-talent__timeline-dot--active" />
                      <div className="detail-talent__timeline-title">
                        Senior Mechanical Engineer
                      </div>
                      <div className="detail-talent__timeline-subtitle">
                        PT. Industri Maju Jaya
                        <br />
                        2021 - Sekarang
                      </div>
                    </div>

                    <div className="detail-talent__timeline-item">
                      <span className="detail-talent__timeline-dot detail-talent__timeline-dot--inactive" />
                      <div className="detail-talent__timeline-title">Junior Engineer</div>
                      <div className="detail-talent__timeline-subtitle">
                        CV. Teknik Prima
                        <br />
                        2019 - 2021
                      </div>
                    </div>
                  </div>

                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                    Lisensi & Sertifikasi
                  </div>
                  <div className="detail-talent__chip-row">
                    <Chip>Certified Solidworks Professional</Chip>
                    <Chip>Project Management Professional (PMP)</Chip>
                  </div>

                  <div className="detail-talent__section-heading detail-talent__section-heading--mt">
                    Keahlian (Skills)
                  </div>
                  <div className="detail-talent__chip-row">
                    <Chip blue>AutoCAD</Chip>
                    <Chip blue>Solidworks</Chip>
                    <Chip blue>MATLAB</Chip>
                    <Chip>Team Leadership</Chip>
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
                      Kandidat menyelesaikan tes pada 24 Okt 2023
                    </div>
                  </div>
                </div>

                <div className="detail-talent__assessment-summary">
                  Sarah menunjukkan kemampuan analitis yang sangat kuat,
                  terutama dalam pemecahan masalah teknis. Ia cenderung
                  mengambil keputusan berdasarkan data dan fakta. Meskipun sisi
                  kreatifnya lebih rendah, pendekatannya yang sistematis sangat
                  cocok untuk peran teknis yang membutuhkan presisi tinggi.
                </div>

                <div className="detail-talent__assessment-action">
                  {/* ✅ navigasi dinamis pakai id */}
                  <button
                    onClick={() =>
                      navigate(`/admin/mitra/talent/${id}/assessment-review`)
                    }
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

              {/* ✅ semua navigate pakai id dinamis */}
              <FileItem
                title="Curriculum Vitae"
                subtitle="CV - SarahJenkins.pdf"
                color="orange"
                onClick={() => navigate(`/admin/mitra/talent/${id}/review-dokumen`)}
              />
              <FileItem
                title="Portfolio"
                subtitle="Portfolio-Sarah.pdf"
                color="blue"
                onClick={() => navigate(`/admin/mitra/talent/${id}/review-dokumen`)}
              />
              <FileItem
                title="KTP / Identitas Diri"
                subtitle="KTP_3#ficial.pdf"
                color="green"
                onClick={() => navigate(`/admin/mitra/talent/${id}/review-dokumen`)}
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