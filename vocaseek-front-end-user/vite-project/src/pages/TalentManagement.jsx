import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  CalendarDays,
  CircleCheck,
  Plus,
  Filter,
  Eye,
  Mail,
  Trash2,
  FolderOpen,
  ChevronDown,
  X,
  Check,
  SquarePen,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/TalentManagement.css";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFERED", label: "Offered" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

function StatCard({ title, value, subtitle, icon, iconWrapClass = "", extra = null }) {
  return (
    <div className="tm-stat-card">
      <div className="tm-stat-card__inner">
        <div>
          <div className="tm-stat-card__title">{title}</div>

          <div className="tm-stat-card__value-row">
            <div className="tm-stat-card__value">{value}</div>
            {extra}
          </div>

          <div className="tm-stat-card__subtitle">{subtitle}</div>
        </div>

        <div className={`tm-stat-card__icon ${iconWrapClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function Badge({ children, className = "" }) {
  return <span className={`tm-badge ${className}`}>{children}</span>;
}

function CandidateRow({
  selected = false,
  id,
  name,
  email,
  role,
  level,
  workType,
  applyDate,
  status,
  image,
  onClick,
  onEditStatus,
  onViewDetail, 
}) {
  const statusMap = {
    PENDING: "tm-badge--pending",
    SHORTLISTED: "tm-badge--shortlisted",
    REJECTED: "tm-badge--rejected",
    INTERVIEWING: "tm-badge--interviewing",
    OFFERED: "tm-badge--offered",
    HIRED: "tm-badge--hired",
  };

  const levelMap = {
    Senior: "tm-text-green",
    "Mid-Level": "tm-text-orange",
    Junior: "tm-text-orange",
  };

  const workTypeMap = {
    Internship: "tm-badge--internship",
    "Full Time": "tm-badge--fulltime",
  };

  return (
    <tr className={`tm-table__row ${onClick ? "tm-table__row--clickable" : ""}`} onClick={onClick}>
      <td className="tm-table__cell tm-table__cell--checkbox">
        <div className="tm-center">
          <input type="checkbox" checked={selected} readOnly />
        </div>
      </td>

      <td className="tm-table__cell tm-table__cell--muted tm-whitespace-pre">{id}</td>

      <td className="tm-table__cell">
        <div className="tm-candidate">
          <div className="tm-candidate__avatar-wrap">
            <img src={image} alt={name} className="tm-candidate__avatar" />
          </div>

          <div>
            <div className="tm-candidate__name">{name}</div>
            <div className="tm-candidate__email">{email}</div>
          </div>
        </div>
      </td>

      <td className="tm-table__cell">
        <div className="tm-role">{role}</div>
        <div className={`tm-role__level ${levelMap[level]}`}>{level}</div>
      </td>

      <td className="tm-table__cell">
        <Badge className={workTypeMap[workType]}>{workType}</Badge>
      </td>

      <td className="tm-table__cell tm-table__cell--muted tm-whitespace-pre">{applyDate}</td>

      <td className="tm-table__cell">
        <Badge className={statusMap[status]}>{getStatusLabel(status)}</Badge>
      </td>

      <td className="tm-table__cell">
        <div className="tm-actions">
          <button
            type="button"
            className="tm-actions__text-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditStatus?.();
            }}
          >
            Ubah
            <br />
            Status
          </button>

        <button
          type="button"
          className="tm-actions__icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail?.();
          }}
        >
          <Eye size={15} />
        </button>

          <button type="button" className="tm-actions__icon-btn" onClick={(e) => e.stopPropagation()}>
            <Mail size={15} />
          </button>

          <button type="button" className="tm-actions__icon-btn" onClick={(e) => e.stopPropagation()}>
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CandidateCard({ candidate, onClick, onEditStatus,  onViewDetail }) {
  const statusMap = {
    PENDING: "tm-badge--pending",
    SHORTLISTED: "tm-badge--shortlisted",
    REJECTED: "tm-badge--rejected",
    INTERVIEWING: "tm-badge--interviewing",
    OFFERED: "tm-badge--offered",
    HIRED: "tm-badge--hired",
  };

  const workTypeMap = {
    Internship: "tm-badge--internship",
    "Full Time": "tm-badge--fulltime",
  };

  return (
    <div className="tm-mobile-card" onClick={onClick}>
      <div className="tm-mobile-card__top">
        <div className="tm-candidate">
          <img src={candidate.image} alt={candidate.name} className="tm-candidate__avatar" />
          <div>
            <div className="tm-candidate__name">{candidate.name}</div>
            <div className="tm-candidate__email">{candidate.email}</div>
          </div>
        </div>
        <input type="checkbox" checked={candidate.selected} readOnly onClick={(e) => e.stopPropagation()} />
      </div>

      <div className="tm-mobile-card__grid">
        <div>
          <span className="tm-mobile-card__label">ID</span>
          <div className="tm-mobile-card__value tm-whitespace-pre">{candidate.id}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Posisi</span>
          <div className="tm-mobile-card__value tm-whitespace-pre">{candidate.role}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Tanggal Daftar</span>
          <div className="tm-mobile-card__value tm-whitespace-pre">{candidate.applyDate}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Tipe</span>
          <div className="tm-mobile-card__value">
            <Badge className={workTypeMap[candidate.workType]}>{candidate.workType}</Badge>
          </div>
        </div>
      </div>

      <div className="tm-mobile-card__footer">
        <Badge className={statusMap[candidate.status]}>{getStatusLabel(candidate.status)}</Badge>
        <button
          type="button"
          className="tm-mobile-card__status-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEditStatus?.();
            onViewDetail?.();
          }}
        >
          Ubah Status
        </button>
      </div>
    </div>
  );
}

function ChangeStatusModal({
  open,
  candidate,
  selectedStatus,
  setSelectedStatus,
  autoNotify,
  setAutoNotify,
  onClose,
  onSave,
}) {
  if (!open || !candidate) return null;

  return (
    <div className="tm-modal-overlay">
      <div className="tm-modal">
        <div className="tm-modal__header">
          <div className="tm-modal__title-wrap">
            <SquarePen size={20} className="tm-text-gold" />
            <h2 className="tm-modal__title">Ubah Status Kandidat</h2>
          </div>

          <button type="button" onClick={onClose} aria-label="Tutup popup" className="tm-modal__close">
            <X size={22} />
          </button>
        </div>

        <div className="tm-modal__body">
          <div className="tm-modal__candidate-card">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="tm-modal__candidate-avatar"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />

            <div>
              <div className="tm-modal__candidate-name">{candidate.name}</div>
              <div className="tm-modal__candidate-role">
                {candidate.role} • {candidate.level}
              </div>
            </div>
          </div>

          <div className="tm-modal__field">
            <label className="tm-modal__label">Pilih Status Baru</label>

            <div className="tm-select-wrap">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="tm-select"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <ChevronDown size={18} className="tm-select__icon" />
            </div>
          </div>

          <button type="button" onClick={() => setAutoNotify((prev) => !prev)} className="tm-toggle-row">
            <span className={`tm-toggle ${autoNotify ? "tm-toggle--active" : ""}`}>
              {autoNotify && <Check size={15} className="tm-text-white" />}
            </span>

            <span>
              <div className="tm-toggle__title">Kirim notifikasi otomatis ke kandidat</div>
              <div className="tm-toggle__desc">
                Informasikan pelamar mengenai perubahan tahapan rekrutmen ini melalui email.
              </div>
            </span>
          </button>
        </div>

        <div className="tm-modal__footer">
          <button type="button" onClick={onClose} className="tm-btn tm-btn--ghost">
            Batal
          </button>

          <button type="button" onClick={onSave} className="tm-btn tm-btn--gold">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TalentManagement({ mode = "all" }) {
  const navigate = useNavigate();

  const [candidateList, setCandidateList] = React.useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [activeCandidate, setActiveCandidate] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState("SHORTLISTED");
  const [autoNotify, setAutoNotify] = React.useState(true);

  const isShortlistedPage = mode === "shortlisted";

  const allCandidates = [
    {
      id: "KDT-001",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: "Mechanical Engineer",
      level: "Mid-Level",
      workType: "Internship",
      applyDate: "12 Okt 2023",
      status: "PENDING",
      selected: true,
      image: "/Sarah_Jenkins.png",
      link: "/talent/kdt-001",
    },
    {
      id: "KDT-002",
      name: "Bagus Setiawan",
      email: "bagus.set@example.com",
      role: "UI/UX Designer",
      level: "Senior",
      workType: "Internship",
      applyDate: "14 Okt 2023",
      status: "SHORTLISTED",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
    {
      id: "KDT-003",
      name: "Rizky Pratama",
      email: "rizky.p@example.com",
      role: "Frontend Developer",
      level: "Junior",
      workType: "Full Time",
      applyDate: "15 Okt 2023",
      status: "REJECTED",
      selected: true,
      image: "/Sarah_Jenkins.png",
    },
    {
      id: "KDT-004",
      name: "Adi Wijaya",
      email: "adi.wijaya@example.com",
      role: "DevOps Engineer",
      level: "Senior",
      workType: "Full Time",
      applyDate: "18 Okt 2023",
      status: "SHORTLISTED",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
    {
      id: "KDT-005",
      name: "Linda Kusuma",
      email: "linda.kus@example.com",
      role: "Project Manager",
      level: "Senior",
      workType: "Internship",
      applyDate: "20 Okt 2023",
      status: "SHORTLISTED",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
  ];

  const shortlistedCandidates = [
    {
      id: "KDT-\n001",
      name: "Bagus Setiawan",
      email: "bagus.s@gmail.com",
      role: "Senior\nUI/UX\nDesigner",
      level: "Senior",
      workType: "Internship",
      applyDate: "12 Jan\n2024",
      status: "INTERVIEWING",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
    {
      id: "KDT-\n002",
      name: "Rizky Pratama",
      email: "rizky.dev@yahoo.com",
      role: "Frontend\nEngineer",
      level: "Mid-Level",
      workType: "Full Time",
      applyDate: "10 Jan\n2024",
      status: "SHORTLISTED",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
    {
      id: "KDT-\n003",
      name: "Jessica Tan",
      email: "j.tan@creative.io",
      role: "Product\nManager",
      level: "Senior",
      workType: "Internship",
      applyDate: "08 Jan\n2024",
      status: "PENDING",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
    {
      id: "KDT-\n004",
      name: "Ahmad Fauzi",
      email: "fauzi.code@gmail.com",
      role: "DevOps\nSpecialist",
      level: "Mid-Level",
      workType: "Full Time",
      applyDate: "05 Jan\n2024",
      status: "SHORTLISTED",
      selected: false,
      image: "/Sarah_Jenkins.png",
    },
  ];

  React.useEffect(() => {
    setCandidateList(isShortlistedPage ? shortlistedCandidates : allCandidates);
  }, [isShortlistedPage]);

  const openStatusModal = (candidate) => {
    setActiveCandidate(candidate);
    setSelectedStatus(candidate.status || "PENDING");
    setAutoNotify(true);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setActiveCandidate(null);
  };

  const handleSaveStatus = () => {
    if (!activeCandidate) return;

    setCandidateList((prev) => {
      const updated = prev.map((item) =>
        item.id === activeCandidate.id ? { ...item, status: selectedStatus } : item
      );

      if (isShortlistedPage && selectedStatus !== "SHORTLISTED") {
        return updated.filter((item) => item.id !== activeCandidate.id);
      }

      return updated;
    });

    closeStatusModal();
  };

  const pageTitle = isShortlistedPage ? "Kandidat Terpilih" : "Semua Kandidat";
  const pageBreadcrumb = isShortlistedPage ? "KANDIDAT TERPILIH" : "SEMUA KANDIDAT";
  const totalLabel = isShortlistedPage ? "Pilih Semua (42)" : "Select All (124)";
  const selectedLabel = isShortlistedPage ? "2 terpilih" : "2 selected";
  const topSummary = isShortlistedPage ? null : "Showing 1 to 6 of 124 results";
  const bottomSummary = isShortlistedPage
    ? "Menampilkan 1 sampai 5 dari 42 hasil"
    : "Menampilkan 1 sampai 5 dari 124 hasil";

  return (
    <div className="tm-layout">
      <Sidebar />

      <main className="tm-main">
        <Topbar placeholder="Cari kandidat, pekerjaan, atau meeting..." />

        <section className="tm-page">
          <div className="tm-breadcrumbs">
            <span>ADMIN</span>
            <span>›</span>
            <span>MANAJEMEN TALENT</span>
            <span>›</span>
            <span className="tm-breadcrumbs__active">{pageBreadcrumb}</span>
          </div>

          <div className="tm-header">
            <h1 className="tm-page__title">{pageTitle}</h1>

            {!isShortlistedPage && (
              <button onClick={() => navigate("/tambah-kandidat")} className="tm-btn tm-btn--primary">
                <Plus size={16} />
                Add Candidate
              </button>
            )}
          </div>

          {topSummary && (
            <div className="tm-pagination-bar">
              <div className="tm-pagination-bar__text">{topSummary}</div>
              <div className="tm-pagination">
                <button className="tm-pagination__btn tm-pagination__btn--edge">‹</button>
                <button className="tm-pagination__btn tm-pagination__btn--active">1</button>
                <button className="tm-pagination__btn">2</button>
                <button className="tm-pagination__btn">3</button>
                <button className="tm-pagination__btn">...</button>
                <button className="tm-pagination__btn">8</button>
                <button className="tm-pagination__btn">9</button>
                <button className="tm-pagination__btn tm-pagination__btn--edge">›</button>
              </div>
            </div>
          )}

          <div className="tm-stats-grid">
            <StatCard
              title="Total Shortlisted"
              value="42"
              subtitle="vs bulan lalu"
              extra={<span className="tm-growth">+12%</span>}
              icon={<Star size={18} className="tm-text-blue" />}
              iconWrapClass="tm-bg-light-blue"
            />

            <StatCard
              title="Interview Dijadwalkan"
              value="18"
              subtitle="5 terjadwal hari ini"
              extra={<Badge className="tm-badge--upcoming">Mendatang</Badge>}
              icon={<CalendarDays size={18} className="tm-text-purple" />}
              iconWrapClass="tm-bg-light-purple"
            />

            <StatCard
              title="Diterima Bulan Ini"
              value="7"
              subtitle="Dari pool shortlisted"
              extra={<span className="tm-extra-text">kandidat</span>}
              icon={<CircleCheck size={18} className="tm-text-green" />}
              iconWrapClass="tm-bg-light-green"
            />
          </div>

          <div className="tm-content-grid">
            <aside className="tm-sidebar-panel-wrap">
              <div className="tm-filter-panel">
                <div className="tm-filter-panel__header">
                  <div className="tm-filter-panel__title-wrap">
                    <Filter size={18} className="tm-text-dark" />
                    <h2 className="tm-filter-panel__title">Filter</h2>
                  </div>

                  <button className="tm-reset-btn">Reset Semua</button>
                </div>

                <div className="tm-filter-panel__body">
                  <div>
                    <label className="tm-input-label">Kata Kunci</label>
                    <input
                      type="text"
                      placeholder="Nama, keahlian, atau tag..."
                      className="tm-input"
                    />
                  </div>

                  <div>
                    <label className="tm-input-label">Keahlian Vokasi</label>

                    <div className="tm-radio-list">
                      {[
                        "Teknologi Informasi",
                        "Desain Kreatif",
                        "Mekanik & Teknik",
                        "Administrasi Bisnis",
                      ].map((item, idx) => (
                        <label key={item} className="tm-radio-item">
                          <input type="radio" name="skill" defaultChecked={idx === 2} className="tm-radio" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="tm-input-label">Pengalaman</label>

                    <div className="tm-select-wrap">
                      <select className="tm-input tm-input--select">
                        <option>Semua Pengalaman</option>
                      </select>

                      <ChevronDown size={16} className="tm-select__icon" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="tm-talent-pool-card">
                <div className="tm-talent-pool-card__bubble" />

                <div className="tm-talent-pool-card__title">Status Talent Pool</div>
                <div className="tm-talent-pool-card__subtitle">Snapshot basis data saat ini.</div>

                <div className="tm-talent-pool-card__stats">
                  <div>
                    <div className="tm-talent-pool-card__number">2,840</div>
                    <div className="tm-talent-pool-card__label">Total Talenta</div>
                  </div>

                  <div className="tm-talent-pool-card__stats-right">
                    <div className="tm-talent-pool-card__number tm-talent-pool-card__number--gold">156</div>
                    <div className="tm-talent-pool-card__label">Baru minggu ini</div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="tm-table-card">
              <div className="tm-table-toolbar">
                <div className="tm-table-toolbar__left">
                  <label className="tm-select-all">
                    <input type="checkbox" />
                    <span>{totalLabel}</span>
                  </label>
                  <span className="tm-divider">|</span>
                  <span className="tm-toolbar-muted">{selectedLabel}</span>
                </div>

                <div className="tm-table-toolbar__actions">
                  <button className="tm-btn tm-btn--invite">
                    <Mail size={14} />
                    Undang
                  </button>

                  <button className="tm-btn tm-btn--neutral">
                    <FolderOpen size={14} />
                    Pindahkan
                  </button>

                  <button className="tm-btn tm-btn--danger-soft">
                    <Trash2 size={14} />
                    Arsip
                  </button>
                </div>
              </div>

              <div className="tm-table-wrap">
                <table className="tm-table">
                  <thead className="tm-table__head">
                    <tr className="tm-table__head-row">
                      <th className="tm-table__heading tm-table__heading--checkbox"></th>
                      <th className="tm-table__heading">ID</th>
                      <th className="tm-table__heading">Kandidat</th>
                      <th className="tm-table__heading">Posisi</th>
                      <th className="tm-table__heading">Tipe Pekerjaan</th>
                      <th className="tm-table__heading">Tanggal Daftar</th>
                      <th className="tm-table__heading">Status</th>
                      <th className="tm-table__heading">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {candidateList.map((item) => (
                      <CandidateRow
                        key={item.id}
                        {...item}
                        onClick={item.link ? () => navigate(item.link) : undefined}
                        onEditStatus={() => openStatusModal(item)}
                        onViewDetail={() => handleViewDetail(item)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="tm-mobile-list">
                {candidateList.map((item) => (
                  <CandidateCard
                    key={item.id}
                    candidate={item}
                    onClick={item.link ? () => navigate(item.link) : undefined}
                    onEditStatus={() => openStatusModal(item)}
                    onViewDetail={() => handleViewDetail(item)}
                  />
                ))}
              </div>

              <div className="tm-table-footer">
                <div className="tm-table-footer__text">{bottomSummary}</div>

                <div className="tm-pagination">
                  <button className="tm-pagination__btn tm-pagination__btn--edge">‹</button>
                  <button className="tm-pagination__btn tm-pagination__btn--active">1</button>
                  <button className="tm-pagination__btn">2</button>
                  <button className="tm-pagination__btn">3</button>
                  <button className="tm-pagination__btn">...</button>
                  <button className="tm-pagination__btn">9</button>
                  <button className="tm-pagination__btn tm-pagination__btn--edge">›</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChangeStatusModal
        open={isStatusModalOpen}
        candidate={activeCandidate}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        autoNotify={autoNotify}
        setAutoNotify={setAutoNotify}
        onClose={closeStatusModal}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
