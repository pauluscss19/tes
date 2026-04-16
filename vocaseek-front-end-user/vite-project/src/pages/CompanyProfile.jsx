import "../styles/CompanyProfile.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MapComponent from "../components/MapComponent";
import {
  Eye,
  MapPin,
  Building2,
  Users,
  Globe,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  ShieldCheck,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function InfoCard({ children, className = "" }) {
  return <div className={`company-profile__info-card ${className}`}>{children}</div>;
}

function ActiveJobCard({ type, time, title, location, meta }) {
  return (
    <div className="company-profile__job-card">
      <div className="company-profile__job-card-content">
        <div className="company-profile__job-meta">
          <span
            className={`company-profile__job-type ${
              type === "Internship"
                ? "company-profile__job-type--internship"
                : "company-profile__job-type--fulltime"
            }`}
          >
            {type}
          </span>
          <span>• {time}</span>
        </div>

        <div className="company-profile__job-title">{title}</div>

        <div className="company-profile__job-info">
          <div className="company-profile__job-info-item">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="company-profile__job-info-item">
            <Clock3 size={14} />
            <span>{meta}</span>
          </div>
        </div>
      </div>

      <button className="company-profile__apply-btn">Lamar Sekarang</button>
    </div>
  );
}

export default function CompanyProfile() {
  const navigate = useNavigate();

  return (
    <div className="company-profile">
      <Sidebar />

      <main className="company-profile__main">
        <Topbar placeholder="Global search for talents, partners, or meetings..." />

        <section className="company-profile__section">
          <div className="company-profile__breadcrumb">
            <span className="company-profile__breadcrumb-muted">ADMIN</span>
            <span className="company-profile__breadcrumb-muted">›</span>
            <span className="company-profile__breadcrumb-active">
              COMPANY PROFILE
            </span>
          </div>

          <div className="company-profile__actions">
            <button
              onClick={() => navigate("/company-profile/settings")}
              className="company-profile__edit-btn"
            >
              <Eye size={16} />
              Edit Profile
            </button>
          </div>

          <InfoCard className="company-profile__header-card">
            <div className="company-profile__banner">
              <div className="company-profile__banner-overlay" />
            </div>

            <div className="company-profile__header-body">
              <div className="company-profile__header-content">
                <div className="company-profile__header-left">
                  <div className="company-profile__logo-box">
                    <div className="company-profile__logo-inner">
                      <img
                        src="/Bank_Mandiri_Logo.png"
                        alt="Bank Mandiri"
                        className="company-profile__logo-image"
                      />
                    </div>
                  </div>

                  <div className="company-profile__company-info">
                    <h1 className="company-profile__company-name">
                      PT Bank Mandiri (Persero)
                    </h1>

                    <div className="company-profile__company-meta">
                      <span className="company-profile__industry-badge">
                        Jasa Keuangan
                      </span>
                      <div className="company-profile__location-inline">
                        <MapPin size={14} />
                        <span>Jakarta Selatan</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="company-profile__header-right">
                  <div className="company-profile__active-job-badge">
                    <BriefcaseBusiness size={16} />
                    12 Lowongan Aktif
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <div className="company-profile__grid">
            <div className="company-profile__left-column">
              <InfoCard className="company-profile__card-padding-lg">
                <h2 className="company-profile__section-title-blue">
                  Tentang Perusahaan
                </h2>

                <div className="company-profile__about-text">
                  <p>
                    Bank Mandiri didirikan pada 2 Oktober 1998, sebagai bagian dari
                    program restrukturisasi perbankan yang dijalankan oleh Pemerintah
                    Indonesia. Pada bulan Juli 1999, empat bank milik Pemerintah yaitu
                    Bank Bumi Daya, Bank Dagang Negara, Bank Ekspor Impor Indonesia dan
                    Bank Pembangunan Indonesia dilebur menjadi Bank Mandiri.
                  </p>
                  <p>
                    Kini, Bank Mandiri menjadi salah satu bank terbesar di Indonesia
                    yang memberikan pelayanan kepada nasabah yang mencakup segmen usaha
                    Corporate, Commercial, Micro & Retail, Consumer Loans serta
                    Treasury, Financial Institution & Special Asset Management.
                  </p>
                  <p>
                    Kami terus berinovasi dalam transformasi digital untuk menghadirkan
                    solusi perbankan modern yang memudahkan setiap transaksi nasabah di
                    seluruh Indonesia dan global.
                  </p>
                </div>

                <div className="company-profile__vision-mission-grid">
                  <div className="company-profile__mini-card">
                    <div className="company-profile__mini-icon">
                      <Eye size={18} />
                    </div>
                    <h3 className="company-profile__mini-title">Visi</h3>
                    <p className="company-profile__mini-text">
                      Menjadi partner finansial pilihan utama Anda.
                    </p>
                  </div>

                  <div className="company-profile__mini-card">
                    <div className="company-profile__mini-icon">
                      <ShieldCheck size={18} />
                    </div>
                    <h3 className="company-profile__mini-title">Misi</h3>
                    <div className="company-profile__mini-list">
                      <p>Menyediakan solusi perbankan digital yang handal.</p>
                      <p>Membangun sumber daya manusia yang profesional.</p>
                      <p>Memberikan kontribusi positif bagi Indonesia.</p>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard className="company-profile__card-padding-lg">
                <div className="company-profile__office-title-row">
                  <MapPin size={18} className="company-profile__office-title-icon" />
                  <h2 className="company-profile__section-title">
                    Office Locations
                  </h2>
                </div>

                <div className="company-profile__label-small">Headquarters</div>
                <div className="company-profile__headquarter-address">
                  123 Innovation Drive, Silicon Valley, CA 94025
                </div>

                <div className="company-profile__map-wrapper">
                  <MapComponent />

                  <div className="company-profile__map-label-wrapper">
                    <div className="company-profile__map-label">TechNova HQ</div>
                  </div>

                  <button className="company-profile__directions-btn">
                    Get Directions
                  </button>
                </div>

                <div className="company-profile__label-small company-profile__label-small--top">
                  Branch Offices
                </div>

                <div className="company-profile__branch-grid">
                  <div className="company-profile__branch-item">
                    <div className="company-profile__branch-icon">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div className="company-profile__branch-name">
                        New York Office
                      </div>
                      <div className="company-profile__branch-address">
                        456 Broadway, NY 10012
                      </div>
                    </div>
                  </div>

                  <div className="company-profile__branch-item">
                    <div className="company-profile__branch-icon">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div className="company-profile__branch-name">London Hub</div>
                      <div className="company-profile__branch-address">
                        10 Downing St, London SW1A 2AA
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <div className="company-profile__jobs-section">
                <div className="company-profile__jobs-header">
                  <h2 className="company-profile__jobs-title">Lowongan Aktif</h2>
                  <button className="company-profile__see-all-btn">
                    Lihat Semua →
                  </button>
                </div>

                <div className="company-profile__jobs-list">
                  <ActiveJobCard
                    type="Internship"
                    time="Diposting 2 hari lalu"
                    title="Digital Banking Staff Internship"
                    location="Jakarta Selatan"
                    meta="Paid Internship"
                  />

                  <ActiveJobCard
                    type="Full Time"
                    time="Diposting 5 hari lalu"
                    title="Officer Development Program (ODP) - IT"
                    location="Nasional"
                    meta="Fresh Graduate"
                  />

                  <ActiveJobCard
                    type="Internship"
                    time="Diposting 1 minggu lalu"
                    title="Data Analyst Intern"
                    location="Jakarta Selatan"
                    meta="3 Bulan"
                  />
                </div>
              </div>
            </div>

            <div className="company-profile__right-column">
              <InfoCard className="company-profile__card-padding-md">
                <div className="company-profile__profile-top">
                  <div className="company-profile__profile-logo-box">
                    <img
                      src="/bank_mandiri_logo_small.png"
                      alt="Bank Mandiri"
                      className="company-profile__profile-logo-image"
                    />
                  </div>

                  <div>
                    <div className="company-profile__profile-name">Bank Mandiri</div>
                    <div className="company-profile__profile-rating">
                      ★★★★★ (5.0)
                    </div>
                  </div>
                </div>

                <div className="company-profile__profile-info-list">
                  <div className="company-profile__profile-info-item">
                    <Building2
                      size={16}
                      className="company-profile__profile-info-icon-muted"
                    />
                    <div>
                      <div className="company-profile__info-label">Industri</div>
                      <div className="company-profile__info-value">
                        Perbankan & Jasa Keuangan
                      </div>
                    </div>
                  </div>

                  <div className="company-profile__profile-info-item">
                    <Users
                      size={16}
                      className="company-profile__profile-info-icon-muted"
                    />
                    <div>
                      <div className="company-profile__info-label">
                        Ukuran Perusahaan
                      </div>
                      <div className="company-profile__info-value">
                        10,000+ Karyawan
                      </div>
                    </div>
                  </div>

                  <div className="company-profile__profile-info-item">
                    <Globe
                      size={16}
                      className="company-profile__profile-info-icon-muted"
                    />
                    <div>
                      <div className="company-profile__info-label">Website</div>
                      <div className="company-profile__info-value-highlight">
                        bankmandiri.co.id
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard className="company-profile__card-padding-md">
                <h3 className="company-profile__side-title">Informasi Kontak</h3>

                <div className="company-profile__contact-list">
                  <div className="company-profile__contact-item">
                    <Phone
                      size={16}
                      className="company-profile__contact-icon-accent"
                    />
                    <div>
                      <div className="company-profile__contact-label">Telepon</div>
                      <div className="company-profile__contact-value">
                        14000 (Mandiri Call)
                      </div>
                    </div>
                  </div>

                  <div className="company-profile__contact-item">
                    <Mail
                      size={16}
                      className="company-profile__contact-icon-accent"
                    />
                    <div>
                      <div className="company-profile__contact-label">
                        Email Karir
                      </div>
                      <div className="company-profile__contact-value">
                        recruitment@bankmandiri.co.id
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard className="company-profile__card-padding-md">
                <h3 className="company-profile__side-title">Social Presence</h3>

                <div className="company-profile__social-row">
                  <button className="company-profile__social-btn company-profile__social-btn--linkedin">
                    <Linkedin size={18} />
                  </button>
                  <button className="company-profile__social-btn company-profile__social-btn--twitter">
                    <Twitter size={18} />
                  </button>
                  <button className="company-profile__social-btn company-profile__social-btn--facebook">
                    <Facebook size={18} />
                  </button>
                </div>
              </InfoCard>

              <InfoCard className="company-profile__card-padding-md">
                <div className="company-profile__verification-label">
                  Verification
                </div>

                <div className="company-profile__verification-status">
                  <ShieldCheck size={18} />
                  <span>Business License Verified</span>
                </div>
              </InfoCard>
            </div>
          </div>

          <div className="company-profile__footer">
            <div className="company-profile__footer-text">
              <span className="company-profile__footer-dot">◉</span> Last saved 2
              minutes ago
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}