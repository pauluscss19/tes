code = '''import React from "react";
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
import {
  getCompanyCandidates,
  getSelectedCompanyCandidates,
  updateCompanyCandidateStatus,
} from "../services/companyTalent";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "PENDING",     label: "Pending" },
  { value: "REVIEWED",    label: "Reviewed" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW",   label: "Interviewing" },
  { value: "OFFER",       label: "Offered" },
  { value: "REJECTED",    label: "Rejected" },
];

const VALID_STATUSES = STATUS_OPTIONS.map((s) => s.value);

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Backend getAllCandidates  → { status, stats, candidates: [...] }
// Backend getSelected       → { status, data: [...] }
function extractCandidates(payload) {
  if (Array.isArray(payload?.candidates)) return payload.candidates; // getAllCandidates
  if (Array.isArray(payload?.data))       return payload.data;       // getSelected
  if (Array.isArray(payload))             return payload;
  return [];
}

function mapCandidate(item) {
  const statusRaw = String(item?.status || "PENDING").toUpperCase();
  const status    = VALID_STATUSES.includes(statusRaw) ? statusRaw : "PENDING";

  return {
    id:        item?.id,            // integer dari DB → untuk navigate & API call
    displayId: item?.candidate_id,  // "KDT-022"       → hanya untuk tampilan kolom ID
    name:      item?.name      || "Kandidat",
    email:     item?.email     || "-",
    role:      item?.position  || "-",
    workType:  item?.type      || "Internship",
    applyDate: item?.date_applied || "-",
    status,
    level:     "Junior",
    selected:  false,
    image:     null,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Badge({ children, className = "" }) {
  return <span className={`tm-badge ${className}`}>{children}</span>;
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

function AvatarCell({ image, name, className = "" }) {
  return image ? (
    <img src={image} alt={name} className={className} />
  ) : (
    <div
      className={className}
      style={{
        display: "grid", placeItems: "center",
        background: "#dbe7ff", color: "#3267e3", fontWeight: 700,
      }}
    >
      {String(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

function CandidateRow({
  id, displayId, name, email, role, level, workType,
  applyDate, status, image, selected,
  onEditStatus, onViewDetail,
}) {
  const statusMap = {
    PENDING:     "tm-badge--pending",
    REVIEWED:    "tm-badge--pending",
    SHORTLISTED: "tm-badge--shortlisted",
    INTERVIEW:   "tm-badge--interviewing",
    OFFER:       "tm-badge--offered",
    REJECTED:    "tm-badge--rejected",
  };
  const levelMap    = { Senior: "tm-text-green", "Mid-Level": "tm-text-orange", Junior: "tm-text-orange" };
  const workTypeMap = { Internship: "tm-badge--internship", "Full Time": "tm-badge--fulltime" };

  return (
    <tr className="tm-table__row">
      <td className="tm-table__cell tm-table__cell--checkbox">
        <div className="tm-center">
          <input type="checkbox" checked={selected} readOnly />
        </div>
      </td>

      {/* Tampilkan displayId (KDT-022), bukan id integer */}
      <td className="tm-table__cell tm-table__cell--muted">{displayId || id}</td>

      <td className="tm-table__cell">
        <div className="tm-candidate">
          <div className="tm-candidate__avatar-wrap">
            <AvatarCell image={image} name={name} className="tm-candidate__avatar" />
          </div>
          <div>
            <div className="tm-candidate__name">{name}</div>
            <div className="tm-candidate__email">{email}</div>
          </div>
        </div>
      </td>

      <td className="tm-table__cell">
        <div className="tm-role">{role}</div>
        <div className={`tm-role__level ${levelMap[level] || "tm-text-orange"}`}>{level}</div>
      </td>

      <td className="tm-table__cell">
        <Badge className={workTypeMap[workType] || ""}>{workType}</Badge>
      </td>

      <td className="tm-table__cell tm-table__cell--muted">{applyDate}</td>

      <td className="tm-table__cell">
        <Badge className={statusMap[status] || ""}>{getStatusLabel(status)}</Badge>
      </td>

      <td className="tm-table__cell">
        <div className="tm-actions">
          <button
            type="button"
            className="tm-actions__text-btn"
            onClick={(e) => { e.stopPropagation(); onEditStatus?.(); }}
          >
            Ubah<br />Status
          </button>
          <button
            type="button"
            className="tm-actions__icon-btn"
            title="Lihat Detail"
            onClick={(e) => { e.stopPropagation(); onViewDetail?.(); }}
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            className="tm-actions__icon-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail size={15} />
          </button>
          <button
            type="button"
            className="tm-actions__icon-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CandidateCard({ candidate, onEditStatus, onViewDetail }) {
  const statusMap   = {
    PENDING:     "tm-badge--pending",
    REVIEWED:    "tm-badge--pending",
    SHORTLISTED: "tm-badge--shortlisted",
    INTERVIEW:   "tm-badge--interviewing",
    OFFER:       "tm-badge--offered",
    REJECTED:    "tm-badge--rejected",
  };
  const workTypeMap = { Internship: "tm-badge--internship", "Full Time": "tm-badge--fulltime" };

  return (
    <div className="tm-mobile-card">
      <div className="tm-mobile-card__top">
        <div className="tm-candidate">
          <AvatarCell image={candidate.image} name={candidate.name} className="tm-candidate__avatar" />
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
          {/* Tampilkan displayId di mobile card juga */}
          <div className="tm-mobile-card__value">{candidate.displayId || candidate.id}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Posisi</span>
          <div className="tm-mobile-card__value">{candidate.role}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Tanggal Daftar</span>
          <div className="tm-mobile-card__value">{candidate.applyDate}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Tipe</span>
          <Badge className={workTypeMap[candidate.workType] || ""}>{candidate.workType}</Badge>
        </div>
      </div>

      <div className="tm-mobile-card__footer">
        <Badge className={statusMap[candidate.status] || ""}>{getStatusLabel(candidate.status)}</Badge>
        <button
          type="button"
          className="tm-mobile-card__status-btn"
          onClick={(e) => { e.stopPropagation(); onEditStatus?.(); }}
        >
          Ubah Status
        </button>
        <button
          type="button"
          className="tm-mobile-card__status-btn"
          onClick={(e) => { e.stopPropagation(); onViewDetail?.(); }}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

function ChangeStatusModal({
  open, candidate, selectedStatus, setSelectedStatus,
  autoNotify, setAutoNotify, onClose, onSave, isSaving,
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
            <AvatarCell
              image={candidate.image}
              name={candidate.name}
              className="tm-modal__candidate-avatar"
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
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <ChevronDown size={18} className="tm-select__icon" />
            </div>
          </div>

          <button type="button" onClick={() => setAutoNotify((p) => !p)} className="tm-toggle-row">
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
          <button type="button" onClick={onClose} className="tm-btn tm-btn--ghost">Batal</button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="tm-btn tm-btn--gold"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function TalentManagement({ mode = "all" }) {
  const navigate = useNavigate();

  const [candidateList,      setCandidateList]      = React.useState([]);
  const [stats,              setStats]              = React.useState({});
  const [isLoading,          setIsLoading]          = React.useState(true);
  const [errorMessage,       setErrorMessage]       = React.useState("");
  const [isStatusModalOpen,  setIsStatusModalOpen]  = React.useState(false);
  const [activeCandidate,    setActiveCandidate]    = React.useState(null);
  const [selectedStatus,     setSelectedStatus]     = React.useState("PENDING");
  const [autoNotify,         setAutoNotify]         = React.useState(true);
  const [isSaving,           setIsSaving]           = React.useState(false);

  const isShortlistedPage = mode === "shortlisted";

  // ── Fetch ──────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");

    const fetchFn = isShortlistedPage ? getSelectedCompanyCandidates : getCompanyCandidates;

    fetchFn()
      .then((res) => {
        // Backend selalu membungkus response dalam res.data (axios)
        const payload    = res?.data ?? {};
        const collection = extractCandidates(payload);
        setCandidateList(collection.map(mapCandidate));
        if (payload?.stats) setStats(payload.stats);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setErrorMessage("Gagal memuat data kandidat. Silakan coba lagi.");
      })
      .finally(() => setIsLoading(false));
  }, [isShortlistedPage]);

  // ── Detail — gunakan item.id (integer) ────────────────────────────────────
  const handleViewDetail = (item) => {
  console.log("ID yang dikirim:", item.id, item.displayId);
  navigate(`/talent/${item.id}/detail`);
};
  };

  // ── Status modal ───────────────────────────────────────────────────────────
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

  const handleSaveStatus = async () => {
    if (!activeCandidate) return;
    setIsSaving(true);
    try {
      await updateCompanyCandidateStatus(activeCandidate.id, {
        status:            selectedStatus,
        send_notification: autoNotify,
      });

      setCandidateList((prev) => {
        const updated = prev.map((c) =>
          c.id === activeCandidate.id ? { ...c, status: selectedStatus } : c
        );
        if (isShortlistedPage && !["SHORTLISTED", "INTERVIEW", "OFFER"].includes(selectedStatus)) {
          return updated.filter((c) => c.id !== activeCandidate.id);
        }
        return updated;
      });

      closeStatusModal();
    } catch (err) {
      console.error("Update status error:", err);
      setErrorMessage("Gagal mengubah status. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalShortlisted  = stats?.total_shortlisted  ?? candidateList.filter((c) => c.status === "SHORTLISTED").length;
  const totalInterviewing = stats?.total_interviews   ?? candidateList.filter((c) => c.status === "INTERVIEW").length;
  const totalHired        = stats?.accepted_this_month ?? candidateList.filter((c) => c.status === "OFFER").length;

  const pageTitle      = isShortlistedPage ? "Kandidat Terpilih" : "Semua Kandidat";
  const pageBreadcrumb = isShortlistedPage ? "KANDIDAT TERPILIH" : "SEMUA KANDIDAT";

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
              <button
                onClick={() => navigate("/tambah-kandidat")}
                className="tm-btn tm-btn--primary"
              >
                <Plus size={16} /> Add Candidate
              </button>
            )}
          </div>

          {errorMessage && (
            <div style={{ marginBottom: 16, color: "#d93025", fontWeight: 500 }}>
              {errorMessage}
            </div>
          )}

          <div className="tm-stats-grid">
            <StatCard
              title="Total Shortlisted"
              value={String(totalShortlisted)}
              subtitle="kandidat shortlisted"
              icon={<Star size={18} className="tm-text-blue" />}
              iconWrapClass="tm-bg-light-blue"
            />
            <StatCard
              title="Interview Dijadwalkan"
              value={String(totalInterviewing)}
              subtitle="kandidat tahap interview"
              extra={totalInterviewing > 0 && <Badge className="tm-badge--upcoming">Mendatang</Badge>}
              icon={<CalendarDays size={18} className="tm-text-purple" />}
              iconWrapClass="tm-bg-light-purple"
            />
            <StatCard
              title="Diterima Bulan Ini"
              value={String(totalHired)}
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
                      {["Teknologi Informasi","Desain Kreatif","Mekanik & Teknik","Administrasi Bisnis"].map((item, idx) => (
                        <label key={item} className="tm-radio-item">
                          <input type="radio" name="skill" defaultChecked={idx === 0} className="tm-radio" />
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
                    <div className="tm-talent-pool-card__number">{candidateList.length}</div>
                    <div className="tm-talent-pool-card__label">Total Kandidat</div>
                  </div>
                  <div className="tm-talent-pool-card__stats-right">
                    <div className="tm-talent-pool-card__number tm-talent-pool-card__number--gold">
                      {totalShortlisted}
                    </div>
                    <div className="tm-talent-pool-card__label">Shortlisted</div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="tm-table-card">
              <div className="tm-table-toolbar">
                <div className="tm-table-toolbar__left">
                  <label className="tm-select-all">
                    <input type="checkbox" />
                    <span>Pilih Semua ({candidateList.length})</span>
                  </label>
                </div>
                <div className="tm-table-toolbar__actions">
                  <button className="tm-btn tm-btn--invite"><Mail size={14} /> Undang</button>
                  <button className="tm-btn tm-btn--neutral"><FolderOpen size={14} /> Pindahkan</button>
                  <button className="tm-btn tm-btn--danger-soft"><Trash2 size={14} /> Arsip</button>
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                          Memuat data kandidat...
                        </td>
                      </tr>
                    ) : candidateList.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
                          Belum ada data kandidat.
                        </td>
                      </tr>
                    ) : (
                      candidateList.map((item) => (
                        <CandidateRow
                          key={item.id}
                          {...item}
                          onEditStatus={() => openStatusModal(item)}
                          onViewDetail={() => handleViewDetail(item)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="tm-mobile-list">
                {!isLoading && candidateList.map((item) => (
                  <CandidateCard
                    key={item.id}
                    candidate={item}
                    onEditStatus={() => openStatusModal(item)}
                    onViewDetail={() => handleViewDetail(item)}
                  />
                ))}
              </div>

              <div className="tm-table-footer">
                <div className="tm-table-footer__text">
                  Menampilkan {candidateList.length} dari {candidateList.length} hasil
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
        isSaving={isSaving}
      />
    </div>
  );
}
'''

with open("/tmp/TalentManagement_fixed.jsx", "w") as f:
    f.write(code)
print("Done:", len(code), "chars")