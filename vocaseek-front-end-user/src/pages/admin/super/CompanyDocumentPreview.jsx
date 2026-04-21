import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "../../../styles/CompanyDocumentPreview.css";
import {
  ArrowLeft,
  Download,
  RotateCw,
  Printer,
  FileText,
  BadgePercent,
  FileSearch,
  ExternalLink,
} from "lucide-react";
import { getVerificationCompanyDetail } from "../../../services/adminVerification";

// ── Helpers ──────────────────────────────────────────────────

function getFileExtension(value = "") {
  if (typeof value !== "string") return "";
  const clean = value.split("?")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function getFileNameFromUrl(url = "") {
  if (typeof url !== "string" || !url) return "";
  try {
    const clean = url.split("?")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || "";
  } catch {
    return "";
  }
}

function humanizeDocType(docType = "") {
  const map = {
    nib: "Nomor Induk Berusaha (NIB)",
    akta: "Akta Pendirian Perusahaan",
    loa: "Letter of Acceptance (LoA)",
    loa_pdf: "Letter of Acceptance (LoA)",
    akta_pdf: "Akta Pendirian Perusahaan",
  };
  return (
    map[docType] ||
    docType?.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function normalizeDocumentItem(item, fallbackKey) {
  if (!item) return null;

  if (typeof item === "string" || typeof item === "number") {
    const str = String(item);
    const looksLikeFile =
      str.includes("/") ||
      str.startsWith("http") ||
      str.startsWith("data:") ||
      /\.(pdf|png|jpg|jpeg|webp)$/i.test(str);

    return {
      key: fallbackKey,
      title: humanizeDocType(fallbackKey),
      filename: looksLikeFile ? getFileNameFromUrl(str) || fallbackKey : fallbackKey,
      type: looksLikeFile ? getFileExtension(str).toUpperCase() || "FILE" : "TEXT",
      size: "-",
      uploaded: "-",
      uploader: "-",
      url: looksLikeFile ? str : "",
      value: looksLikeFile ? "" : str,
      raw: item,
    };
  }

  const url = item.url || item.file || item.path || "";
  const filename =
    item.filename || item.fileName || item.name || item.original_name ||
    (url ? getFileNameFromUrl(url) : "") || fallbackKey;
  const type =
    item.type || item.fileType ||
    (url ? getFileExtension(url).toUpperCase() : item.value ? "TEXT" : "FILE") ||
    "FILE";

  return {
    key: item.key || fallbackKey,
    title: item.title || item.label || humanizeDocType(fallbackKey),
    filename,
    type,
    size: item.size || item.fileSize || "-",
    uploaded: item.uploaded || item.uploadedAt || item.createdAt || "-",
    uploader: item.uploader || item.uploadedBy || item.pic || "-",
    url,
    value: item.value || item.number || item.text || "",
    raw: item,
  };
}

/**
 * Ekstrak dokumen dari companyData hasil mapCompanyRecord (adminVerification.js)
 * Struktur yang masuk:
 *   companyData.documents = { loa, akta, extra[] }
 *   companyData.nib       = string
 */
function extractDocuments(company) {
  if (!company) return {};

  const result = {};

  // loa_pdf → dari company.documents.loa
  const loa = company?.documents?.loa;
  if (loa) result["loa"] = normalizeDocumentItem(loa, "loa");

  // akta_pdf → dari company.documents.akta
  const akta = company?.documents?.akta;
  if (akta) result["akta"] = normalizeDocumentItem(akta, "akta");

  // nib → langsung dari company.nib (string)
  if (company?.nib && company.nib !== "-") {
    result["nib"] = normalizeDocumentItem(company.nib, "nib");
  }

  // Dokumen tambahan (extra array jika ada)
  const extra = company?.documents?.extra;
  if (Array.isArray(extra)) {
    extra.forEach((item, i) => {
      const key = item?.key || item?.slug || `extra-${i + 1}`;
      result[key] = normalizeDocumentItem(item, key);
    });
  }

  return result;
}

// ── Komponen Utama ────────────────────────────────────────────

export default function CompanyDocumentPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, docType } = useParams();

  // Gunakan sessionStorage (bukan localStorage — diblokir di sandbox)
  const statusKey = `doc-validation-${id ?? "x"}-${docType ?? "doc"}`;
  const companyKey = `company-verify-${id ?? "x"}`;

  const [validationStatus, setValidationStatus] = useState("");
  const [savedStatus, setSavedStatus] = useState(null);
  const [companyData, setCompanyData] = useState(location.state?.company || null);
  const [loadingCompany, setLoadingCompany] = useState(!location.state?.company);

  // ── Load company data ─────────────────────────────────────
  useEffect(() => {
    // 1. Dari location.state (navigate dari halaman review)
    if (location.state?.company) {
      setCompanyData(location.state.company);
      setLoadingCompany(false);
      return;
    }

    // 2. Dari sessionStorage
    try {
      const stored = sessionStorage.getItem(companyKey);
      if (stored) {
        setCompanyData(JSON.parse(stored));
        setLoadingCompany(false);
        return;
      }
    } catch {
      // abaikan error parse
    }

    // 3. Fallback: fetch dari API
    if (!id) {
      setLoadingCompany(false);
      return;
    }

    getVerificationCompanyDetail(id)
      .then((result) => {
        setCompanyData(result);
        try {
          sessionStorage.setItem(companyKey, JSON.stringify(result));
        } catch {
          // abaikan jika sessionStorage penuh
        }
      })
      .catch(() => {
        // Data tidak tersedia, biarkan companyData null
      })
      .finally(() => setLoadingCompany(false));
  }, [id, companyKey, location.state]);

  // ── Load status validasi dari sessionStorage ──────────────
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(statusKey);
      if (!stored) { setValidationStatus(""); setSavedStatus(null); return; }
      const parsed = JSON.parse(stored);
      setValidationStatus(parsed.status || "");
      setSavedStatus(parsed);
    } catch {
      setValidationStatus(""); setSavedStatus(null);
    }
  }, [statusKey]);

  // ── Ekstrak dokumen sesuai DB ─────────────────────────────
  const allDocuments = useMemo(() => extractDocuments(companyData), [companyData]);

  const doc = useMemo(() => {
    const key = String(docType || "").toLowerCase();

    if (!key && Object.keys(allDocuments).length > 0) {
      return Object.values(allDocuments)[0];
    }

    return (
      allDocuments[key] ||
      Object.values(allDocuments).find(
        (item) => String(item?.key || "").toLowerCase() === key
      ) || {
        key: key || "document",
        title: humanizeDocType(key || "document"),
        filename: "-", type: "UNKNOWN",
        size: "-", uploaded: "-", uploader: "-",
        url: "", value: "",
      }
    );
  }, [allDocuments, docType]);

  // ── Nama perusahaan — pakai field dari mapCompanyRecord ───
  const companyName =
    companyData?.name ||           // ✅ hasil mapCompanyRecord
    companyData?.nama_perusahaan || // fallback langsung dari DB
    "Perusahaan";

  // ── ID perusahaan — pakai code dari mapCompanyRecord ──────
  const companyCode =
    companyData?.code ||           // ✅ hasil getCompanyCode() di service
    `CMP-${String(id || "").padStart(3, "0")}`;

  const canPreviewInIframe =
    !!doc.url &&
    (doc.url.startsWith("data:application/pdf") ||
      doc.url.startsWith("data:image/") ||
      ["pdf", "png", "jpg", "jpeg", "webp"].includes(getFileExtension(doc.url)));

  // ── Handlers ──────────────────────────────────────────────
  const handleSaveStatus = () => {
    if (!validationStatus) {
      alert("Pilih status validasi dokumen terlebih dahulu.");
      return;
    }

    const next = {
      status: validationStatus,
      label: validationStatus === "valid" ? "Valid" : "Tidak Valid / Ditolak",
      savedAt: new Date().toISOString(),
      documentName: doc.title,
    };

    try {
      sessionStorage.setItem(statusKey, JSON.stringify(next));
    } catch {
      // abaikan jika sessionStorage penuh
    }
    setSavedStatus(next);
    alert(
      validationStatus === "valid"
        ? "Status dokumen berhasil disimpan sebagai Valid."
        : "Status dokumen berhasil disimpan sebagai Tidak Valid / Ditolak."
    );
  };

  const handleDownload = () => {
    if (!doc.url) { alert("File dokumen tidak tersedia untuk diunduh."); return; }
    window.open(doc.url, "_blank", "noopener,noreferrer");
  };

  const formatSavedAt = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString("id-ID", {
      dateStyle: "medium", timeStyle: "short",
    });
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="cdp-layout">
      <Sidebar />
      <main className="cdp-main">
        <Topbar />
        <section className="cdp-content">

          {/* Top Row */}
          <div className="cdp-top-row">
            <div>
              <div className="cdp-breadcrumb">
                <span>Dashboard</span><span>›</span>
                <span>Verifikasi Mitra</span><span>›</span>
                <span className="active">Review Dokumen</span>
              </div>
              <h1 className="cdp-page-title">{doc.title}</h1>
              <p className="cdp-page-subtitle">
                Tinjau kelengkapan dan validitas dokumen{" "}
                <strong>{doc.title}</strong> dari <strong>{companyName}</strong>
              </p>
            </div>
            <div className="cdp-top-actions">
              <button className="cdp-back-btn" type="button" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /><span>Kembali ke Review</span>
              </button>
              <button className="cdp-download-btn" type="button" onClick={handleDownload}>
                <Download size={16} /><span>Download File</span>
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loadingCompany && (
            <p style={{ color: "#6b7280", marginBottom: "16px" }}>Memuat data perusahaan...</p>
          )}

          <div className="cdp-grid">
            {/* ── Viewer ── */}
            <div className="cdp-viewer-card">
              <div className="cdp-viewer-toolbar">
                <div className="cdp-toolbar-left">
                  <span>{doc.title}</span>
                  <span className="divider" />
                  <span>{doc.type || "Dokumen"}</span>
                </div>
                <div className="cdp-toolbar-right">
                  <button type="button" className="cdp-tool-btn"
                    onClick={() => window.location.reload()}>
                    <RotateCw size={18} />
                  </button>
                  <button type="button" className="cdp-tool-btn"
                    onClick={() => window.print()}>
                    <Printer size={18} />
                  </button>
                </div>
              </div>

              <div className="cdp-paper-area">
                {canPreviewInIframe ? (
                  <iframe
                    title={doc.title}
                    src={doc.url}
                    style={{
                      width: "100%", minHeight: "780px",
                      border: "none", borderRadius: "18px", background: "#fff",
                    }}
                  />
                ) : doc.value ? (
                  <div className="cdp-paper" style={{ width: "100%", maxWidth: "100%", minHeight: "420px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                      <div className="cdp-ri-logo"><FileSearch size={18} /></div>
                      <div className="cdp-paper-header-text">
                        <strong>{doc.title}</strong>
                        <span>Data dokumen perusahaan</span>
                      </div>
                    </div>
                    <div className="cdp-paper-line" />
                    <div className="cdp-doc-info">
                      <div><strong>Nama Perusahaan</strong><span>: {companyName}</span></div>
                      <div><strong>Jenis Dokumen</strong><span>: {doc.title}</span></div>
                      <div><strong>Nilai Dokumen</strong><span>: {doc.value}</span></div>
                      {/* ✅ Pakai companyCode bukan companyData.companyId */}
                      <div><strong>ID Perusahaan</strong><span>: {companyCode}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="cdp-paper" style={{
                    width: "100%", maxWidth: "100%", minHeight: "420px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    textAlign: "center", gap: 14,
                  }}>
                    <div className="cdp-ri-logo"><FileText size={18} /></div>
                    <h2 style={{ margin: 0 }}>{doc.title}</h2>
                    <p style={{ margin: 0, color: "#6b7280", maxWidth: 480 }}>
                      Preview visual tidak tersedia. Metadata dokumen ditampilkan di panel kanan.
                    </p>
                    {doc.url && (
                      <button type="button" className="cdp-download-btn" onClick={handleDownload}>
                        <ExternalLink size={16} /><span>Buka File</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="cdp-sidebar">
              <div className="cdp-info-card">
                <div className="cdp-card-title">
                  <div className="cdp-title-icon red"><FileText size={18} /></div>
                  <div>
                    <h3>Informasi Dokumen</h3>
                    <p>Metadata file yang diunggah</p>
                  </div>
                </div>
                <div className="cdp-meta-list">
                  <div className="cdp-meta-row"><span>Nama Dokumen</span><strong>{doc.title}</strong></div>
                  <div className="cdp-meta-row"><span>Nama File</span><strong>{doc.filename || "-"}</strong></div>
                  <div className="cdp-meta-row"><span>Tipe Dokumen</span><strong className="tag">{doc.type || "-"}</strong></div>
                  <div className="cdp-meta-row"><span>Ukuran</span><strong>{doc.size || "-"}</strong></div>
                  <div className="cdp-meta-row"><span>Tanggal Upload</span><strong>{doc.uploaded || "-"}</strong></div>
                  <div className="cdp-meta-row"><span>Diunggah Oleh</span><strong className="linkish">{doc.uploader || "-"}</strong></div>
                </div>
              </div>

              <div className="cdp-status-card">
                <div className="cdp-card-title">
                  <div className="cdp-title-icon yellow"><BadgePercent size={18} /></div>
                  <div>
                    <h3>Status Validasi</h3>
                    <p>Tentukan validitas dokumen ini</p>
                  </div>
                </div>
                <div className="cdp-radio-box">
                  <label className={`cdp-radio-item ${validationStatus === "valid" ? "active" : ""}`}>
                    <input type="radio" name="validasi" value="valid"
                      checked={validationStatus === "valid"}
                      onChange={(e) => setValidationStatus(e.target.value)} />
                    <span className="cdp-radio-custom" />
                    <span className="cdp-radio-text">
                      <strong>Valid</strong>
                      <small>Dokumen asli, jelas, dan sesuai persyaratan.</small>
                    </span>
                  </label>
                  <label className={`cdp-radio-item ${validationStatus === "invalid" ? "active" : ""}`}>
                    <input type="radio" name="validasi" value="invalid"
                      checked={validationStatus === "invalid"}
                      onChange={(e) => setValidationStatus(e.target.value)} />
                    <span className="cdp-radio-custom" />
                    <span className="cdp-radio-text">
                      <strong>Tidak Valid / Ditolak</strong>
                      <small>Dokumen buram, kedaluwarsa, atau salah.</small>
                    </span>
                  </label>
                </div>

                {savedStatus && (
                  <div className={`cdp-status-note ${savedStatus.status}`}>
                    <strong>Status tersimpan: {savedStatus.label}</strong>
                    <span>{formatSavedAt(savedStatus.savedAt)}</span>
                  </div>
                )}

                <button className="cdp-save-btn" type="button" onClick={handleSaveStatus}>
                  <Download size={16} /><span>Simpan Status Dokumen</span>
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}