import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "../../../styles/CompanyVerificationReview.css";
import {
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Eye,
  FileText,
  Landmark,
  BadgePercent,
  CheckCircle2,
  X,
  CircleHelp,
} from "lucide-react";
import {
  finalizeVerification,
  getVerificationCompanyDetail,
} from "../../../services/adminVerification";
import { getApiErrorMessage } from "../../../services/auth";

// ── Status label helper ──────────────────────────────────────────────────────
const STATUS_LABEL = {
  pending:  "Pending",
  review:   "Under Review",
  approved: "Disetujui",
  rejected: "Ditolak",
  invalid:  "Tidak Valid",
};

function getStatusLabel(status) {
  return STATUS_LABEL[status] ?? status;
}

// ── Confirm Modal ────────────────────────────────────────────────────────────
function ApproveCompanyModal({ open, type, loading, error, onClose, onConfirm }) {
  if (!open) return null;

  const isApprove = type === "approved";

  return (
    <div className="cvr-modal-overlay" onClick={onClose}>
      <div className="cvr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cvr-modal-icon-wrap">
          <div className="cvr-modal-icon-ring">
            <CircleHelp size={28} />
          </div>
        </div>

        <h3 className="cvr-modal-title">
          {isApprove ? "Verifikasi Mitra Perusahaan?" : "Tolak Pengajuan Perusahaan?"}
        </h3>
        <p className="cvr-modal-text">
          {isApprove
            ? "Apakah Anda yakin ingin menyetujui kerja sama dengan perusahaan ini?"
            : "Apakah Anda yakin ingin menolak pengajuan perusahaan ini?"}
        </p>

        {/* ✅ error ditampilkan di dalam modal, bukan di luar */}
        {error && (
          <p style={{ color: "#d93025", fontSize: "0.875rem", margin: "0 0 8px" }}>
            {error}
          </p>
        )}

        <div className="cvr-modal-actions">
          <button type="button" className="cvr-modal-cancel" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            type="button"
            className="cvr-modal-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Document list builder ────────────────────────────────────────────────────
function buildDocumentList(company) {
  const documents = [
    {
      slug:      "loa",
      title:     "Letter of Agreement (LoA)",
      value:     company?.documents?.loa,
      icon:      <FileText size={22} />,
      iconClass: "cvr-doc-icon red",
    },
    {
      slug:      "akta",
      title:     "Akta Pendirian Perusahaan",
      value:     company?.documents?.akta,
      icon:      <Landmark size={22} />,
      iconClass: "cvr-doc-icon blue",
    },
  ];

  return documents.filter((item) => Boolean(item.value));
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function CompanyVerificationReview() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [company,       setCompany]       = React.useState(null);
  const [loading,       setLoading]       = React.useState(true);
  const [pageError,     setPageError]     = React.useState("");
  const [notes,         setNotes]         = React.useState("");
  const [submitError,   setSubmitError]   = React.useState("");
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [modalType,     setModalType]     = React.useState(""); // "" | "approved" | "rejected"

  // ── Load detail ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      setLoading(true);
      setPageError("");

      try {
        const result = await getVerificationCompanyDetail(id);
        if (isMounted) {
          setCompany(result);
          setNotes(result.notes ?? "");
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            getApiErrorMessage(error, "Gagal memuat detail pengajuan perusahaan.")
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDetail();
    return () => { isMounted = false; };
  }, [id]);

  const documents = React.useMemo(() => buildDocumentList(company), [company]);

  // ── Finalize (approve / reject) ────────────────────────────────────────────
  const handleFinalize = async () => {
    if (!modalType || !company) return;

    setSubmitLoading(true);
    setSubmitError("");

    try {
      await finalizeVerification(company.id, { status: modalType, notes });
      navigate("/admin/verifikasi-perusahaan", { replace: true });
    } catch (error) {
      // ✅ setModalType TIDAK di-reset saat error — modal tetap terbuka, error tampil di modal
      setSubmitError(
        getApiErrorMessage(error, "Gagal menyimpan keputusan verifikasi perusahaan.")
      );
    } finally {
      setSubmitLoading(false);
      // ✅ Dipindah dari finally ke catch saja — jangan tutup modal jika gagal
    }
  };

  const closeModal = () => {
    if (submitLoading) return; // ✅ cegah tutup modal saat sedang proses
    setModalType("");
    setSubmitError("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="cvr-layout">
      <Sidebar />
      <main className="cvr-main">
        <Topbar />
        <section className="cvr-content">

          <div className="cvr-breadcrumb">
            <span>Admin</span><span>›</span>
            <span>Verifikasi Mitra</span><span>›</span>
            <span className="active">Review Dokumen</span>
          </div>
          <h1 className="cvr-page-title">Review Dokumen Perusahaan</h1>
          <p className="cvr-page-subtitle">
            Tinjau detail dan dokumen legalitas calon mitra industri untuk validasi kemitraan.
          </p>

          {pageError && (
            <div style={{ color: "#d93025", marginBottom: "16px" }}>{pageError}</div>
          )}

          <div className="cvr-grid">
            {/* ── Kolom Kiri ── */}
            <div className="cvr-left-card">
              <div className="cvr-cover" />
              <div className="cvr-company-profile">
                <div
                  className="cvr-company-image"
                  style={{ display: "grid", placeItems: "center", background: "#f4f6fb", color: "#8a94a8" }}
                >
                  <Building2 size={40} />
                </div>

                <h2>{company?.name || "Memuat perusahaan..."}</h2>
                <span className="cvr-status-chip">
                  • {company ? getStatusLabel(company.status) : "Memuat"}
                </span>

                <div className="cvr-info-block">
                  <h4>SEKTOR INDUSTRI</h4>
                  <p><Building2 size={16} />{company?.businessType || "-"}</p>
                </div>

                <div className="cvr-info-block">
                  <h4>ID PERUSAHAAN</h4>
                  <p>{company?.code || "-"}</p>
                </div>

                <div className="cvr-info-block">
                  <h4>KONTAK INFORMASI</h4>
                  <p><Phone size={16} />{company?.phone || "-"}</p>
                  <p><Mail size={16} />{company?.email || "-"}</p>
                </div>

                <div className="cvr-info-block">
                  <h4>NIB</h4>
                  <p>{company?.nib || "-"}</p>
                </div>
              </div>
            </div>

            {/* ── Kolom Kanan ── */}
            <div className="cvr-right-column">
              {/* Dokumen */}
              <div className="cvr-docs-card">
                <div className="cvr-docs-head">
                  <h3>Dokumen Legalitas</h3>
                  <span>{documents.length} Dokumen Terlampir</span>
                </div>

                <div className="cvr-doc-list">
                  {!loading && documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.slug} className="cvr-doc-item">
                        <div className="cvr-doc-left">
                          <div className={doc.iconClass}>{doc.icon}</div>
                          <div className="cvr-doc-meta">
                            <strong>{doc.title}</strong>
                            <span>{doc.value}</span>
                          </div>
                        </div>
                        <button
                          className="cvr-preview-btn"
                          type="button"
                          onClick={() =>
                            navigate(`/admin/verifikasi-perusahaan/${id}/review/dokumen/${doc.slug}`)
                          }
                        >
                          <Eye size={16} />
                          <span>Preview</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#6b7280", textAlign: "center", padding: "16px 0" }}>
                      {loading
                        ? "Memuat dokumen perusahaan..."
                        : "Belum ada dokumen legalitas yang bisa ditampilkan."}
                    </div>
                  )}
                </div>
              </div>

              {/* Tindakan */}
              <div className="cvr-action-card">
                <div className="cvr-action-title">
                  <ShieldCheck size={20} />
                  <h3>Tindakan Verifikasi</h3>
                </div>

                <label className="cvr-label">
                  Catatan Verifikasi <span>(Opsional)</span>
                </label>
                <textarea
                  className="cvr-textarea"
                  placeholder="Tambahkan catatan untuk admin lain atau alasan penolakan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <div className="cvr-action-buttons">
                  <button
                    className="cvr-reject-btn"
                    type="button"
                    onClick={() => { setSubmitError(""); setModalType("rejected"); }}
                    disabled={submitLoading || loading || !company}
                  >
                    <X size={18} />
                    <span>Tolak Pengajuan</span>
                  </button>

                  <button
                    className="cvr-approve-btn"
                    type="button"
                    onClick={() => { setSubmitError(""); setModalType("approved"); }}
                    disabled={submitLoading || loading || !company}
                  >
                    <CheckCircle2 size={18} />
                    <span>Setujui &amp; Aktifkan Mitra</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ApproveCompanyModal
        open={Boolean(modalType)}
        type={modalType}
        loading={submitLoading}
        error={submitError}     
        onClose={closeModal}
        onConfirm={handleFinalize}
      />
    </div>
  );
}