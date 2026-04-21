import React from "react";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import "../../../styles/admin/TalentManagementMitra.css";
import {
  getPageNumbers,
  getPaginationMeta,
  paginateItems,
} from "../../../utils/pagination";
import { getApiErrorMessage } from "../../../services/auth";
import {
  getCompanyCandidates,
  getSelectedCompanyCandidates,
  updateCompanyCandidateStatus,
} from "../../../services/companyTalent";

import { useNavigate } from "react-router-dom";
import {
  Star, CalendarDays, CircleCheck, Plus, Filter,
  Eye, Mail, Trash2, FolderOpen, ChevronDown,
  X, Check, SquarePen,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL",         label: "Semua Status" },
  { value: "PENDING",     label: "Pending" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW",   label: "Interview" },
  { value: "OFFER",       label: "Offered" },
  { value: "REJECTED",    label: "Rejected" },
];

const WORK_TYPE_OPTIONS = [
  { value: "ALL",        label: "Semua Tipe" },
  { value: "Internship", label: "Internship" },
  { value: "Full Time",  label: "Full Time" },
];

const POSITION_OPTIONS = [
  { value: "ALL",                 label: "Semua Posisi" },
  { value: "Mechanical Engineer", label: "Mechanical Engineer" },
  { value: "UI/UX Designer",      label: "UI/UX Designer" },
  { value: "Frontend Developer",  label: "Frontend Developer" },
  { value: "DevOps Engineer",     label: "DevOps Engineer" },
  { value: "Project Manager",     label: "Project Manager" },
  { value: "DevOps Specialist",   label: "DevOps Specialist" },
  { value: "Frontend Engineer",   label: "Frontend Engineer" },
  { value: "Product Manager",     label: "Product Manager" },
];

const ITEMS_PER_PAGE = 5;

// ─── helpers ──────────────────────────────────────────────────────────────────

function isValidImageUrl(str) {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("/");
}

function extractCandidateCollection(payload) {
  if (Array.isArray(payload))             return payload;
  if (Array.isArray(payload?.data))       return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.candidates)) return payload.candidates;
  if (Array.isArray(payload?.talents))    return payload.talents;
  return [];
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function normalizeCandidateStatus(value) {
  const normalized = String(value || "PENDING").toUpperCase();
  const aliases = {
    REVIEW:       "PENDING",
    ACCEPTED:     "OFFER",
    INTERVIEWING: "INTERVIEW",
    OFFERED:      "OFFER",
    HIRED:        "OFFER",
  };
  return aliases[normalized] || normalized;
}

function mapCandidate(item, index) {
  const user    = item?.user || item?.intern || item?.candidate || {};
  const profile = user?.intern_profile || user?.internProfile || item?.intern_profile || {};
  const rawId   = item?.id ?? item?.application_id ?? user?.user_id ?? null;
  // Hindari link /null jika rawId tidak valid
  const validId = (rawId != null && rawId !== 0 && String(rawId) !== "null") ? rawId : null;
  const displayId = validId
    ? `KDT-${String(validId).padStart(3, "0")}`
    : `KDT-${String(index + 1).padStart(3, "0")}`;

  const rawImage =
    profile?.foto ||
    user?.foto    ||
    item?.foto    ||
    null;

  return {
    raw:       item,
    backendId: validId ?? index + 1,
    id:        displayId,
    name:      item?.name  || user?.nama  || item?.nama  || "Kandidat",
    email:     item?.email || user?.email || "Email belum tersedia",
    role:
      item?.position               ||
      item?.posisi                 ||
      item?.lowongan?.judul_posisi ||
      item?.job?.judul_posisi      ||
      "Kandidat",
    level:    item?.level    || profile?.jenjang || "Junior",
    workType:
      item?.type           ||
      item?.work_type      ||
      item?.tipe_pekerjaan ||
      "Internship",
    applyDate: formatDate(
      item?.date_applied   ||
      item?.created_at     ||
      item?.apply_date     ||
      item?.tanggal_daftar
    ),
    status: normalizeCandidateStatus(item?.status || item?.candidate_status),
    // ✅ validasi URL — kalau null/kosong langsung default, tidak coba load
    image: isValidImageUrl(rawImage) ? rawImage : "/default-avatar.png",
    link:  validId ? `/admin/mitra/talent/${validId}` : null,
  };
}

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label || status;
}

function computeStats(list) {
  return {
    total_shortlisted:   list.filter((c) => c.status === "SHORTLISTED").length,
    total_interviews:    list.filter((c) => c.status === "INTERVIEW").length,
    accepted_this_month: list.filter((c) => c.status === "OFFER").length,
  };
}

// ─── AvatarImg — komponen stabil, tidak re-render karena parent ───────────────
// ✅ KUNCI FIX KEDIP: simpan imgSrc di state lokal → tidak terpengaruh
//    re-render parent. React.memo → tidak render ulang kalau src tidak berubah.
const AvatarImg = React.memo(function AvatarImg({ src, alt, className }) {
  const [imgSrc, setImgSrc] = React.useState(
    src && src !== "" ? src : "/default-avatar.png"
  );

  // Sync kalau src berubah (misal data refetch)
  React.useEffect(() => {
    setImgSrc(src && src !== "" ? src : "/default-avatar.png");
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc("/default-avatar.png")}
    />
  );
});

// ─── sub-components ───────────────────────────────────────────────────────────

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

// ✅ React.memo — tidak re-render kalau props tidak berubah
const CandidateRow = React.memo(function CandidateRow({
  selected = false,
  id, name, email, role, level, workType, applyDate, status, image, backendId,
  onToggleSelect, onClick, onEditStatus, onViewDetail,
}) {
  const statusMap = {
    PENDING:     "tm-badge--pending",
    SHORTLISTED: "tm-badge--shortlisted",
    REJECTED:    "tm-badge--rejected",
    INTERVIEW:   "tm-badge--interviewing",
    OFFER:       "tm-badge--offered",
  };
  const levelMap = {
    Senior:      "tm-text-green",
    "Mid-Level": "tm-text-orange",
    Junior:      "tm-text-orange",
  };
  const workTypeMap = {
    Internship:  "tm-badge--internship",
    "Full Time": "tm-badge--fulltime",
  };

  return (
    <tr
      className={`tm-table__row ${onClick ? "tm-table__row--clickable" : ""}`}
      onClick={onClick}
    >
      <td className="tm-table__cell tm-table__cell--checkbox">
        <div className="tm-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </td>
      <td className="tm-table__cell tm-table__cell--muted tm-whitespace-pre">{id}</td>
      <td className="tm-table__cell">
        <div className="tm-candidate">
          <div className="tm-candidate__avatar-wrap">
            {/* ✅ Pakai AvatarImg — tidak kedip */}
            <AvatarImg src={image} alt={name} className="tm-candidate__avatar" />
          </div>
          <div>
            <div className="tm-candidate__name">{name}</div>
            <div className="tm-candidate__email">{email}</div>
          </div>
        </div>
      </td>
      <td className="tm-table__cell">
        <div className="tm-role">{role}</div>
        <div className={`tm-role__level ${levelMap[level] || ""}`}>{level}</div>
      </td>
      <td className="tm-table__cell">
        <Badge className={workTypeMap[workType] || ""}>{workType}</Badge>
      </td>
      <td className="tm-table__cell tm-table__cell--muted tm-whitespace-pre">{applyDate}</td>
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
            onClick={(e) => { e.stopPropagation(); onViewDetail?.(); }}
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
});

// ✅ React.memo pada CandidateCard juga
const CandidateCard = React.memo(function CandidateCard({
  candidate, onClick, onEditStatus, onViewDetail, onToggleSelect,
}) {
  const statusMap = {
    PENDING:     "tm-badge--pending",
    SHORTLISTED: "tm-badge--shortlisted",
    REJECTED:    "tm-badge--rejected",
    INTERVIEW:   "tm-badge--interviewing",
    OFFER:       "tm-badge--offered",
  };
  const workTypeMap = {
    Internship:  "tm-badge--internship",
    "Full Time": "tm-badge--fulltime",
  };

  return (
    <div className="tm-mobile-card" onClick={onClick}>
      <div className="tm-mobile-card__top">
        <div className="tm-candidate">
          <AvatarImg src={candidate.image} alt={candidate.name} className="tm-candidate__avatar" />
          <div>
            <div className="tm-candidate__name">{candidate.name}</div>
            <div className="tm-candidate__email">{candidate.email}</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={candidate.selected}
          readOnly
          onClick={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
        />
      </div>
      <div className="tm-mobile-card__grid">
        <div>
          <span className="tm-mobile-card__label">ID</span>
          <div className="tm-mobile-card__value tm-whitespace-pre">{candidate.id}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Posisi</span>
          <div className="tm-mobile-card__value">{candidate.role}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Tanggal Daftar</span>
          <div className="tm-mobile-card__value tm-whitespace-pre">{candidate.applyDate}</div>
        </div>
        <div>
          <span className="tm-mobile-card__label">Tipe</span>
          <div className="tm-mobile-card__value">
            <Badge className={workTypeMap[candidate.workType] || ""}>{candidate.workType}</Badge>
          </div>
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
      </div>
    </div>
  );
});

// ✅ Modal menerima snapshot candidate (bukan referensi dari candidateList)
function ChangeStatusModal({
  open, candidate, selectedStatus, setSelectedStatus,
  autoNotify, setAutoNotify, onClose, onSave,
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
            <AvatarImg
              src={candidate.image}
              alt={candidate.name}
              className="tm-modal__candidate-avatar"
            />
            <div>
              <div className="tm-modal__candidate-name">{candidate.name}</div>
              <div className="tm-modal__candidate-role">{candidate.role} • {candidate.level}</div>
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
                {STATUS_OPTIONS.filter((o) => o.value !== "ALL").map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={18} className="tm-select__icon" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAutoNotify((prev) => !prev)}
            className="tm-toggle-row"
          >
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
          <button type="button" onClick={onSave} className="tm-btn tm-btn--gold">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function TalentManagement({ mode = "all" }) {
  const navigate = useNavigate();

  const [candidateList, setCandidateList] = React.useState([]);
  const [stats, setStats] = React.useState({
    total_shortlisted: 0, total_interviews: 0, accepted_this_month: 0,
  });
  const [selectedIds,    setSelectedIds]    = React.useState([]);
  const [keyword,        setKeyword]        = React.useState("");
  const [positionFilter, setPositionFilter] = React.useState("ALL");
  const [workTypeFilter, setWorkTypeFilter] = React.useState("ALL");
  const [statusFilter,   setStatusFilter]   = React.useState("ALL");
  const [currentPage,    setCurrentPage]    = React.useState(1);

  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [activeCandidate,   setActiveCandidate]   = React.useState(null);
  const [selectedStatus,    setSelectedStatus]    = React.useState("SHORTLISTED");
  const [autoNotify,        setAutoNotify]        = React.useState(true);
  const [isLoading,         setIsLoading]         = React.useState(true);
  const [errorMessage,      setErrorMessage]      = React.useState("");

  const isShortlistedPage = mode === "shortlisted";

  const updateStats = React.useCallback((list) => {
    setStats(computeStats(list));
  }, []);

  // ── fetch ──────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = isShortlistedPage
          ? await getSelectedCompanyCandidates()
          : await getCompanyCandidates();

        const nextCandidates = extractCandidateCollection(response.data).map(mapCandidate);
        setCandidateList(nextCandidates);
        setSelectedIds([]);

        if (response.data?.stats) {
          setStats(response.data.stats);
        } else {
          updateStats(nextCandidates);
        }
      } catch (error) {
        setCandidateList([]);
        setSelectedIds([]);
        setErrorMessage(getApiErrorMessage(error, "Gagal memuat data kandidat."));
      } finally {
        setIsLoading(false);
      }
    };
    loadCandidates();
  }, [isShortlistedPage, updateStats]);

  // ── modal handlers ─────────────────────────────────────────────────────────
  const openStatusModal = React.useCallback((candidate) => {
    // ✅ spread → putus referensi dari candidateList → modal tidak ikut re-render
    setActiveCandidate({ ...candidate });
    setSelectedStatus(candidate.status || "PENDING");
    setAutoNotify(true);
    setIsStatusModalOpen(true);
  }, []);

  const closeStatusModal = React.useCallback(() => {
    setIsStatusModalOpen(false);
    setActiveCandidate(null);
  }, []);

  const handleSaveStatus = React.useCallback(async () => {
    if (!activeCandidate) return;
    try {
      await updateCompanyCandidateStatus(activeCandidate.backendId, {
        status:            selectedStatus,
        send_notification: autoNotify,
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Status kandidat gagal diperbarui."));
      closeStatusModal();
      return;
    }

    setCandidateList((prev) => {
      const updated = prev.map((item) =>
        item.id === activeCandidate.id ? { ...item, status: selectedStatus } : item
      );
      const finalList =
        isShortlistedPage && selectedStatus !== "SHORTLISTED"
          ? updated.filter((item) => item.id !== activeCandidate.id)
          : updated;
      updateStats(finalList);
      if (isShortlistedPage && selectedStatus !== "SHORTLISTED") {
        setSelectedIds((ids) => ids.filter((id) => id !== activeCandidate.id));
      }
      return finalList;
    });

    closeStatusModal();
  }, [activeCandidate, selectedStatus, autoNotify, isShortlistedPage, closeStatusModal, updateStats]);

  const handleViewDetail = React.useCallback((candidate) => {
    if (candidate.link) navigate(candidate.link);
  }, [navigate]);

  // ── selection ──────────────────────────────────────────────────────────────
  const toggleSelect = React.useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  // ── filters ────────────────────────────────────────────────────────────────
  const resetFilters = React.useCallback(() => {
    setKeyword("");
    setPositionFilter("ALL");
    setWorkTypeFilter("ALL");
    setStatusFilter("ALL");
  }, []);

  const filteredCandidates = React.useMemo(() =>
    candidateList.filter((item) => {
      const kw = keyword.trim().toLowerCase();
      const matchKeyword =
        kw === "" ||
        item.name.toLowerCase().includes(kw)  ||
        item.role.toLowerCase().includes(kw)  ||
        item.email.toLowerCase().includes(kw) ||
        item.id.toLowerCase().includes(kw);
      const matchPosition = positionFilter === "ALL" || item.role     === positionFilter;
      const matchWorkType = workTypeFilter === "ALL"  || item.workType === workTypeFilter;
      const matchStatus   = statusFilter   === "ALL"  || item.status   === statusFilter;
      return matchKeyword && matchPosition && matchWorkType && matchStatus;
    }),
    [candidateList, keyword, positionFilter, workTypeFilter, statusFilter]
  );

  // ── pagination ─────────────────────────────────────────────────────────────
  const { totalPages, pageItems: paginatedCandidates } = React.useMemo(
    () => paginateItems(filteredCandidates, currentPage, ITEMS_PER_PAGE),
    [filteredCandidates, currentPage]
  );

  const paginationMeta = React.useMemo(
    () => getPaginationMeta(filteredCandidates.length, currentPage, ITEMS_PER_PAGE),
    [filteredCandidates.length, currentPage]
  );

  const pageNumbers = React.useMemo(
    () => getPageNumbers(paginationMeta.currentPage, paginationMeta.totalPages),
    [paginationMeta.currentPage, paginationMeta.totalPages]
  );

  React.useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages || 1));
  }, [totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [keyword, positionFilter, workTypeFilter, statusFilter, isShortlistedPage]);

  // ── select all ─────────────────────────────────────────────────────────────
  const allVisibleSelected =
    paginatedCandidates.length > 0 &&
    paginatedCandidates.every((item) => selectedIds.includes(item.id));

  const toggleSelectAllVisible = React.useCallback(() => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedCandidates.some((item) => item.id === id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...paginatedCandidates.map((item) => item.id)]),
      ]);
    }
  }, [allVisibleSelected, paginatedCandidates]);

  // ── bulk actions ───────────────────────────────────────────────────────────
  const handleInviteSelected = React.useCallback(() => {
    if (!selectedIds.length) return;
    setCandidateList((prev) => {
      const updated = prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "INTERVIEW" } : item
      );
      updateStats(updated);
      return updated;
    });
  }, [selectedIds, updateStats]);

  const handleMoveSelected = React.useCallback(() => {
    if (!selectedIds.length) return;
    setCandidateList((prev) => {
      const updated = prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "SHORTLISTED" } : item
      );
      updateStats(updated);
      return updated;
    });
  }, [selectedIds, updateStats]);

  const handleArchiveSelected = React.useCallback(() => {
    if (!selectedIds.length) return;
    setCandidateList((prev) => {
      const updated = prev.filter((item) => !selectedIds.includes(item.id));
      updateStats(updated);
      return updated;
    });
    setSelectedIds([]);
  }, [selectedIds, updateStats]);

  // ── labels ─────────────────────────────────────────────────────────────────
  const pageTitle      = isShortlistedPage ? "Kandidat Terpilih" : "Semua Kandidat";
  const pageBreadcrumb = isShortlistedPage ? "KANDIDAT TERPILIH" : "SEMUA KANDIDAT";
  const totalLabel     = isShortlistedPage
    ? `Pilih Semua (${paginatedCandidates.length})`
    : `Select All (${paginatedCandidates.length})`;
  const selectedLabel  = isShortlistedPage
    ? `${selectedIds.length} terpilih`
    : `${selectedIds.length} selected`;
  const topSummary = isShortlistedPage
    ? null
    : `Showing ${paginationMeta.start} to ${paginationMeta.end} of ${filteredCandidates.length} results`;
  const bottomSummary =
    `Menampilkan ${paginationMeta.start} sampai ${paginationMeta.end} dari ${filteredCandidates.length} hasil`;

  // ── pagination buttons ─────────────────────────────────────────────────────
  const PaginationButtons = ({ prefix }) => (
    <div className="tm-pagination">
      <button
        type="button"
        className="tm-pagination__btn tm-pagination__btn--edge"
        disabled={paginationMeta.currentPage === 1}
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      >‹</button>
      {pageNumbers.map((pageNumber, index) =>
        pageNumber === "ellipsis" ? (
          <button key={`${prefix}-ellipsis-${index}`} type="button" className="tm-pagination__btn" disabled>...</button>
        ) : (
          <button
            key={`${prefix}-page-${pageNumber}`}
            type="button"
            className={`tm-pagination__btn ${pageNumber === paginationMeta.currentPage ? "tm-pagination__btn--active" : ""}`}
            onClick={() => setCurrentPage(pageNumber)}
          >{pageNumber}</button>
        )
      )}
      <button
        type="button"
        className="tm-pagination__btn tm-pagination__btn--edge"
        disabled={paginationMeta.currentPage === paginationMeta.totalPages}
        onClick={() => setCurrentPage((p) => Math.min(p + 1, paginationMeta.totalPages))}
      >›</button>
    </div>
  );

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="tm-layout">
      <Sidebar />
      <main className="tm-main">
        <Topbar placeholder="Cari kandidat, pekerjaan, atau meeting..." />
        <section className="tm-page">
          <div className="tm-breadcrumbs">
            <span>ADMIN</span><span>›</span>
            <span>MANAJEMEN TALENT</span><span>›</span>
            <span className="tm-breadcrumbs__active">{pageBreadcrumb}</span>
          </div>

          <div className="tm-header">
            <h1 className="tm-page__title">{pageTitle}</h1>
            {!isShortlistedPage && (
              <button
                onClick={() => navigate("/admin/mitra/tambah-kandidat")}
                className="tm-btn tm-btn--primary"
              >
                <Plus size={16} /> Add Candidate
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="tm-alert tm-alert--error">{errorMessage}</div>
          )}

          {topSummary && (
            <div className="tm-pagination-bar">
              <div className="tm-pagination-bar__text">{topSummary}</div>
              {filteredCandidates.length > 0 && <PaginationButtons prefix="top" />}
            </div>
          )}

          <div className="tm-stats-grid">
            <StatCard
              title="Total Shortlisted"
              value={stats.total_shortlisted}
              subtitle={stats.total_shortlisted > 0 ? `${stats.total_shortlisted} kandidat` : "Belum ada kandidat"}
              extra={<span className="tm-growth">Live</span>}
              icon={<Star size={18} className="tm-text-blue" />}
              iconWrapClass="tm-bg-light-blue"
            />
            <StatCard
              title="Interview Dijadwalkan"
              value={stats.total_interviews}
              subtitle={stats.total_interviews > 0 ? `${stats.total_interviews} interview` : "Belum ada interview"}
              extra={<Badge className="tm-badge--upcoming">{stats.total_interviews > 0 ? "Aktif" : "Kosong"}</Badge>}
              icon={<CalendarDays size={18} className="tm-text-purple" />}
              iconWrapClass="tm-bg-light-purple"
            />
            <StatCard
              title="Diterima Bulan Ini"
              value={stats.accepted_this_month}
              subtitle={stats.accepted_this_month > 0 ? "kandidat diterima" : "Belum ada kandidat diterima"}
              extra={<span className="tm-extra-text">kandidat</span>}
              icon={<CircleCheck size={18} className="tm-text-green" />}
              iconWrapClass="tm-bg-light-green"
            />
          </div>

          <div className="tm-content-grid">
            {/* ── sidebar filter ── */}
            <aside className="tm-sidebar-panel-wrap">
              <div className="tm-filter-panel">
                <div className="tm-filter-panel__header">
                  <div className="tm-filter-panel__title-wrap">
                    <Filter size={18} className="tm-text-dark" />
                    <h2 className="tm-filter-panel__title">Filter</h2>
                  </div>
                  <button type="button" className="tm-reset-btn" onClick={resetFilters}>
                    Reset Semua
                  </button>
                </div>
                <div className="tm-filter-panel__body">
                  <div>
                    <label className="tm-input-label">Kata Kunci</label>
                    <input
                      type="text"
                      placeholder="Nama, posisi, email, atau ID..."
                      className="tm-input"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="tm-input-label">Posisi</label>
                    <div className="tm-select-wrap">
                      <select className="tm-input tm-input--select" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                        {POSITION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <ChevronDown size={16} className="tm-select__icon" />
                    </div>
                  </div>
                  <div>
                    <label className="tm-input-label">Tipe Pekerjaan</label>
                    <div className="tm-select-wrap">
                      <select className="tm-input tm-input--select" value={workTypeFilter} onChange={(e) => setWorkTypeFilter(e.target.value)}>
                        {WORK_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <ChevronDown size={16} className="tm-select__icon" />
                    </div>
                  </div>
                  <div>
                    <label className="tm-input-label">Status Kandidat</label>
                    <div className="tm-select-wrap">
                      <select className="tm-input tm-input--select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                    <div className="tm-talent-pool-card__label">Total Talenta</div>
                  </div>
                  <div className="tm-talent-pool-card__stats-right">
                    <div className="tm-talent-pool-card__number tm-talent-pool-card__number--gold">
                      {candidateList.filter((c) => {
                        const d = new Date(c.raw?.created_at);
                        const now = new Date();
                        return (now - d) / (1000 * 60 * 60 * 24) <= 7;
                      }).length}
                    </div>
                    <div className="tm-talent-pool-card__label">Baru minggu ini</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── table card ── */}
            <div className="tm-table-card">
              <div className="tm-table-toolbar">
                <div className="tm-table-toolbar__left">
                  <label className="tm-select-all">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} />
                    <span>{totalLabel}</span>
                  </label>
                  <span className="tm-divider">|</span>
                  <span className="tm-toolbar-muted">{selectedLabel}</span>
                </div>
                <div className="tm-table-toolbar__actions">
                  <button type="button" className="tm-btn tm-btn--invite" onClick={handleInviteSelected} disabled={!selectedIds.length}>
                    <Mail size={14} /> Undang
                  </button>
                  <button type="button" className="tm-btn tm-btn--neutral" onClick={handleMoveSelected} disabled={!selectedIds.length}>
                    <FolderOpen size={14} /> Pindahkan
                  </button>
                  <button type="button" className="tm-btn tm-btn--danger-soft" onClick={handleArchiveSelected} disabled={!selectedIds.length}>
                    <Trash2 size={14} /> Arsip
                  </button>
                </div>
              </div>

              {/* desktop table */}
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
                      <tr className="tm-table__row">
                        <td className="tm-table__cell" colSpan={8}>
                          <div style={{ padding: "32px 16px", textAlign: "center", color: "#6b7280" }}>
                            Memuat data kandidat...
                          </div>
                        </td>
                      </tr>
                    ) : paginatedCandidates.length > 0 ? (
                      paginatedCandidates.map((item) => (
                        <CandidateRow
                          key={item.backendId}
                          backendId={item.backendId}
                          id={item.id}
                          name={item.name}
                          email={item.email}
                          role={item.role}
                          level={item.level}
                          workType={item.workType}
                          applyDate={item.applyDate}
                          status={item.status}
                          image={item.image}
                          link={item.link}
                          selected={selectedIds.includes(item.id)}
                          onToggleSelect={() => toggleSelect(item.id)}
                          onClick={item.link ? () => navigate(item.link) : undefined}
                          onEditStatus={() => openStatusModal(item)}
                          onViewDetail={() => handleViewDetail(item)}
                        />
                      ))
                    ) : (
                      <tr className="tm-table__row">
                        <td className="tm-table__cell" colSpan={8}>
                          <div style={{ padding: "32px 16px", textAlign: "center", color: "#6b7280" }}>
                            Belum ada kandidat yang mendaftar.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* mobile cards */}
              <div className="tm-mobile-list">
                {isLoading ? (
                  <div className="tm-mobile-card">
                    <div className="tm-candidate__name">Memuat kandidat...</div>
                    <div className="tm-candidate__email">Sebentar ya, data sedang diambil.</div>
                  </div>
                ) : paginatedCandidates.length > 0 ? (
                  paginatedCandidates.map((item) => (
                    <CandidateCard
                      key={item.backendId}
                      candidate={{ ...item, selected: selectedIds.includes(item.id) }}
                      onToggleSelect={() => toggleSelect(item.id)}
                      onClick={item.link ? () => navigate(item.link) : undefined}
                      onEditStatus={() => openStatusModal(item)}
                      onViewDetail={() => handleViewDetail(item)}
                    />
                  ))
                ) : (
                  <div className="tm-mobile-card">
                    <div className="tm-candidate__name">Belum ada kandidat</div>
                    <div className="tm-candidate__email">Data kandidat akan muncul di sini setelah ada pendaftar.</div>
                  </div>
                )}
              </div>

              {/* footer pagination */}
              <div className="tm-table-footer">
                <div className="tm-table-footer__text">{bottomSummary}</div>
                {filteredCandidates.length > 0 && <PaginationButtons prefix="bottom" />}
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