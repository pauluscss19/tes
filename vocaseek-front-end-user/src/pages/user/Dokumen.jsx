import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/Dokumen.css";
import {
  getScopedItem,
  setScopedItem,
  USER_STORAGE_KEYS,
} from "../../utils/userScopedStorage";
import { getApiErrorMessage } from "../../services/auth";
import { updateInternProfile, getInternProfile } from "../../services/intern";

const REQUIRED_DOC_IDS = ["cv"];

const initialDocs = [
  { id: "cv",          label: "Curriculum Vitae",             filename: "Belum ada file yang diunggah", uploadedAt: "", status: "empty", type: "" },
  { id: "portfolio",   label: "Portofolio",                   filename: "Belum ada file yang diunggah", uploadedAt: "", status: "empty", type: "" },
  { id: "rekomendasi", label: "Surat Rekomendasi",            filename: "Belum ada file yang diunggah", uploadedAt: "", status: "empty", type: "" },
  { id: "ktp",         label: "KTP / Identitas Diri",         filename: "Belum ada file yang diunggah", uploadedAt: "", status: "empty", type: "" },
  { id: "transkrip",   label: "Transkrip Nilai Terakhir",     filename: "Belum ada file yang diunggah", uploadedAt: "", status: "empty", type: "" },
  { id: "ktm",         label: "Kartu Tanda Mahasiswa (KTM)",  filename: "Belum ada file yang diunggah", uploadedAt: "", status: "empty", type: "" },
];

const BACKEND_FIELD_MAP = {
  cv:          "cv_pdf",
  portfolio:   "portofolio_pdf",
  ktp:         "ktp_pdf",
  transkrip:   "transkrip_pdf",
  rekomendasi: "surat_rekomendasi_pdf",
  ktm:         "ktm_pdf",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripFileData(docs) {
  return docs.map(({ fileData, previewUrl, serverUrl, ...rest }) => rest);
}

function normalizeDocs(savedDocs) {
  if (!Array.isArray(savedDocs)) return initialDocs;
  return initialDocs.map((defaultDoc) => {
    const matched = savedDocs.find((item) => item.id === defaultDoc.id);
    if (!matched) return defaultDoc;
    return { ...defaultDoc, ...matched };
  });
}

function isDokumenComplete(docs) {
  return REQUIRED_DOC_IDS.every((requiredId) => {
    const matched = docs.find((item) => item.id === requiredId);
    return matched?.status === "uploaded";
  });
}

function getNowLabel() {
  const now  = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, "0");
  const dd   = String(now.getDate()).padStart(2, "0");
  const hh   = String(now.getHours()).padStart(2, "0");
  const mi   = String(now.getMinutes()).padStart(2, "0");
  return `UPLOADED ${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function getFileType(file) {
  if (!file) return "";
  if (file.type.includes("pdf"))   return "pdf";
  if (file.type.includes("image")) return "image";
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if ([".jpg", ".jpeg", ".png", ".webp"].some((ext) => lower.endsWith(ext))) return "image";
  return "other";
}

function dataUrlToFile(dataUrl, filename) {
  if (!dataUrl || !dataUrl.startsWith("data:")) return null;
  const [header, base64] = dataUrl.split(",");
  if (!header || !base64) return null;
  const mimeMatch   = header.match(/data:(.*);base64/);
  const mimeType    = mimeMatch?.[1] || "application/octet-stream";
  const byteString  = atob(base64);
  const arrayBuffer = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }
  return new File([arrayBuffer], filename || "document", { type: mimeType });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconPdf() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" className="dcm-iconFilePaper" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" className="dcm-iconFileFold" />
      <path d="M8 14h1.6c1 0 1.7.7 1.7 1.6S10.6 17.2 9.6 17.2H8V14Zm0 3.2h1.4c.5 0 .8-.4.8-.8s-.3-.8-.8-.8H8v1.6Z" className="dcm-iconInk" />
      <path d="M12 14h1.4c1.2 0 2 .8 2 2s-.8 2-2 2H12V14Zm1.4 3.2c.6 0 1-.4 1-1.2s-.4-1.2-1-1.2H13v2.4h.4Z" className="dcm-iconInk" />
      <path d="M16.4 14H19v.9h-1.6v.8H19v.9h-1.6V18h-1v-4Z" className="dcm-iconInk" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 7.5a2 2 0 0 1 2-2H10l1.3 1.3c.4.4.9.7 1.5.7H18.5a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Z" className="dcm-iconFolder" />
      <path d="M3.5 9.2h17" className="dcm-iconFolderLine" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.5 18.5h9a3.5 3.5 0 0 0 .6-7A5 5 0 0 0 7 10.6a3.2 3.2 0 0 0 .5 6.4Z" className="dcm-iconCloud" />
      <path d="M12 10.5v5" className="dcm-iconCloudArrow" />
      <path d="M9.8 12.7 12 10.5l2.2 2.2" className="dcm-iconCloudArrow" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Z" className="dcm-iconTrash" />
      <path d="M6 7h12l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" className="dcm-iconTrash" />
      <path d="M10 11v8M14 11v8" className="dcm-iconTrashStroke" />
    </svg>
  );
}

function FileIconByType(label) {
  if (label.toLowerCase().includes("portofolio")) return <IconFolder />;
  if (label.toLowerCase().includes("surat"))      return <IconCloud />;
  return <IconPdf />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dokumen() {
  const [docs, setDocs]                 = useState(initialDocs);
  const [savedDocs, setSavedDocs]       = useState(initialDocs);
  const [previewDocId, setPreviewDocId] = useState(null);
  const [isLoaded, setIsLoaded]         = useState(false);
  const [saveMessage, setSaveMessage]   = useState("");
  const [isSaving, setIsSaving]         = useState(false);

  const fileInputRefs = useRef({});
  const fileDataMap   = useRef({}); // { [docId]: { previewUrl, fileData } } — in-memory only

  // ── Load: gabungkan localStorage + data server saat mount ──────────────────
  useEffect(() => {
    const loadDocs = async () => {
      try {
        // 1. Baca metadata lokal dulu
        const saved = getScopedItem(USER_STORAGE_KEYS.dokumen);
        let localDocs = initialDocs;
        if (saved) {
          const parsed = JSON.parse(saved);
          localDocs = normalizeDocs(parsed);
        }

        // 2. Ambil data dari server
        try {
          const res     = await getInternProfile();
          const profile = res.data?.data;

          if (profile) {
            const serverFileMap = {
              cv:          profile.cv,
              portfolio:   profile.portofolio,
              transkrip:   profile.transkrip,
              ktp:         profile.ktp,
              rekomendasi: profile.surat_rekomendasi,
              ktm:         profile.ktm,
            };

            localDocs = localDocs.map((doc) => {
              const serverUrl = serverFileMap[doc.id];
              if (serverUrl) {
                return {
                  ...doc,
                  filename:
                    doc.status === "uploaded" &&
                    doc.filename !== "Belum ada file yang diunggah"
                      ? doc.filename
                      : serverUrl.split("/").pop(),
                  status:     "uploaded",
                  uploadedAt: doc.uploadedAt || "TERSIMPAN DI SERVER",
                  serverUrl,
                };
              }
              return doc;
            });
          }
        } catch (serverError) {
          console.warn("Gagal ambil data server, pakai data lokal.", serverError);
        }

        setDocs(localDocs);
        setSavedDocs(localDocs);
      } catch (error) {
        console.error("Gagal membaca dokumen tersimpan:", error);
        setDocs(initialDocs);
        setSavedDocs(initialDocs);
      } finally {
        setIsLoaded(true);
      }
    };

    loadDocs();
  }, []);

  // ── Simpan: metadata ke localStorage + file ke backend ────────────────────
  const saveDocuments = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMessage("");

    try {
      // Simpan metadata saja ke localStorage (tanpa Base64)
      setScopedItem(USER_STORAGE_KEYS.dokumen, JSON.stringify(stripFileData(docs)));
      setSavedDocs(docs);
      setSaveMessage("Dokumen berhasil disimpan.");
      window.dispatchEvent(new Event("career-journey-updated"));
      window.dispatchEvent(new Event("profile-updated"));

      // Kirim file baru ke backend
      const payload  = new FormData();
      let hasAnyFile = false;

      for (const [docId, fieldName] of Object.entries(BACKEND_FIELD_MAP)) {
        const entry = fileDataMap.current[docId];
        const doc   = docs.find((item) => item.id === docId);
        if (entry?.fileData) {
          const file = dataUrlToFile(entry.fileData, doc?.filename);
          if (file) {
            payload.append(fieldName, file);
            hasAnyFile = true;
          }
        }
      }

      if (hasAnyFile) {
        try {
          await updateInternProfile(payload);
          // Setelah berhasil upload, refresh data dari server
          const res     = await getInternProfile();
          const profile = res.data?.data;
          if (profile) {
            const serverFileMap = {
              cv:          profile.cv,
              portfolio:   profile.portofolio,
              transkrip:   profile.transkrip,
              ktp:         profile.ktp,
              rekomendasi: profile.surat_rekomendasi,
              ktm:         profile.ktm,
            };
            setDocs((prev) =>
              prev.map((doc) => {
                const serverUrl = serverFileMap[doc.id];
                if (serverUrl) return { ...doc, serverUrl };
                return doc;
              }),
            );
          }
          setSaveMessage("Dokumen berhasil disimpan dan disinkronkan ke server.");
        } catch (error) {
          setSaveMessage(
            getApiErrorMessage(error, "Dokumen tersimpan lokal, sinkronisasi backend gagal."),
          );
        }
      }
    } catch (error) {
      console.error("Gagal menyimpan dokumen:", error);
      setSaveMessage("Gagal menyimpan dokumen.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Preview ────────────────────────────────────────────────────────────────
  const previewDoc = useMemo(() => {
    const doc = docs.find((item) => item.id === previewDocId);
    if (!doc) return null;
    const entry = fileDataMap.current[previewDocId];
    return { ...doc, previewUrl: entry?.previewUrl || "" };
  }, [docs, previewDocId]);

  // ── Cek perubahan ──────────────────────────────────────────────────────────
  const hasUnsavedChanges = useMemo(() => {
    if (!isLoaded) return false;
    return (
      JSON.stringify(stripFileData(docs)) !==
      JSON.stringify(stripFileData(savedDocs))
    );
  }, [docs, isLoaded, savedDocs]);

  const openFilePicker = (docId) => fileInputRefs.current[docId]?.click();

  const handleUpload = (docId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = getFileType(file);
    if (!["pdf", "image"].includes(fileType)) {
      alert("Format file hanya mendukung PDF, JPG, JPEG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      fileDataMap.current[docId] = { previewUrl: dataUrl, fileData: dataUrl };
      setDocs((prev) =>
        prev.map((item) =>
          item.id === docId
            ? {
                ...item,
                filename:   file.name,
                uploadedAt: getNowLabel(),
                status:     "uploaded",
                type:       fileType,
              }
            : item,
        ),
      );
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleShowFile = (docId) => {
    const selected = docs.find((item) => item.id === docId);
    if (!selected || selected.status !== "uploaded") return;

    // Prioritas 1: preview in-memory (file baru diupload sesi ini)
    if (fileDataMap.current[docId]?.previewUrl) {
      setPreviewDocId(docId);
      return;
    }

    // Prioritas 2: buka URL server di tab baru
    if (selected.serverUrl) {
      window.open(selected.serverUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setSaveMessage(
      "Preview tidak tersedia. Coba upload ulang file ini.",
    );
  };

  const handleDeleteFile = (docId) => {
    delete fileDataMap.current[docId];
    setDocs((prev) =>
      prev.map((item) =>
        item.id === docId
          ? {
              ...item,
              filename:   "Belum ada file yang diunggah",
              uploadedAt: "",
              status:     "empty",
              type:       "",
              serverUrl:  undefined,
            }
          : item,
      ),
    );
    if (previewDocId === docId) setPreviewDocId(null);
  };

  const closePreview = () => setPreviewDocId(null);

  const completed = isDokumenComplete(docs);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="dcm-wrap">
      <div className="dcm-head">
        <h2 className="dcm-title">Dokumen Pendukung</h2>
        <p className="dcm-subtitle">
          Pastikan semua dokumen di bawah ini valid dan dalam format yang benar (PDF/JPG).
        </p>
        {completed && (
          <p className="dcm-subtitle" style={{ color: "#16a34a", fontWeight: 600 }}>
            Dokumen wajib sudah lengkap.
          </p>
        )}
        {hasUnsavedChanges && (
          <p className="dcm-subtitle" style={{ color: "#d8a321", fontWeight: 600, marginTop: "8px" }}>
            Ada perubahan dokumen yang belum disimpan.
          </p>
        )}
        {saveMessage && (
          <p
            className="dcm-subtitle"
            style={{
              color:      saveMessage.includes("berhasil") ? "#16a34a" : "#dc2626",
              fontWeight: 600,
              marginTop:  "8px",
            }}
          >
            {saveMessage}
          </p>
        )}
      </div>

      <div className="dcm-list">
        {docs.map((d) => {
          const isEmpty = d.status === "empty";
          return (
            <div key={d.id} className={`dcm-row ${isEmpty ? "dcm-rowEmpty" : ""}`}>
              <input
                ref={(el) => { fileInputRefs.current[d.id] = el; }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                style={{ display: "none" }}
                onChange={(e) => handleUpload(d.id, e)}
              />
              <div className={`dcm-leftIcon ${isEmpty ? "dcm-leftIconMuted" : ""}`}>
                {FileIconByType(d.label)}
              </div>
              <div className="dcm-info">
                <div className={`dcm-docLabel ${isEmpty ? "dcm-docLabelMuted" : ""}`}>
                  {d.label}
                </div>
                <div className={`dcm-fileName ${isEmpty ? "dcm-fileNameMuted" : ""}`}>
                  {d.filename}
                </div>
                {!isEmpty && <div className="dcm-uploadedAt">{d.uploadedAt}</div>}
              </div>
              <div className="dcm-actions">
                {isEmpty ? (
                  <button
                    className="dcm-btnUpload"
                    type="button"
                    onClick={() => openFilePicker(d.id)}
                  >
                    Upload File
                  </button>
                ) : (
                  <>
                    <button
                      className="dcm-link"
                      type="button"
                      onClick={() => handleShowFile(d.id)}
                    >
                      Lihat File
                    </button>
                    <button
                      className="dcm-iconBtn"
                      type="button"
                      aria-label="Ganti file"
                      title="Ganti file"
                      onClick={() => openFilePicker(d.id)}
                    >
                      <IconCloud />
                    </button>
                    <button
                      className="dcm-iconBtn"
                      type="button"
                      aria-label="Hapus file"
                      title="Hapus file"
                      onClick={() => handleDeleteFile(d.id)}
                    >
                      <IconTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dcm-footer">
        <button
          type="button"
          className="dcm-saveButton"
          onClick={saveDocuments}
          disabled={!hasUnsavedChanges || isSaving}
          style={{ opacity: !hasUnsavedChanges || isSaving ? 0.5 : 1 }}
        >
          {isSaving ? "Menyimpan..." : "Simpan Dokumen"}
        </button>
      </div>

      {/* ── Modal Preview ── */}
      {previewDoc && previewDoc.previewUrl && (
        <div
          onClick={closePreview}
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(15, 23, 42, 0.45)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "24px",
            zIndex:         9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width:         "100%",
              maxWidth:      "980px",
              maxHeight:     "90vh",
              background:    "#fff",
              borderRadius:  "18px",
              overflow:      "hidden",
              boxShadow:     "0 20px 60px rgba(0,0,0,0.18)",
              display:       "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding:        "16px 20px",
                borderBottom:   "1px solid #eef0f2",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                gap:            "16px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#2b2f33", marginBottom: "4px" }}>
                  {previewDoc.label}
                </div>
                <div style={{ fontSize: "12.5px", color: "#9aa0a6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {previewDoc.filename}
                </div>
              </div>
              <button
                type="button"
                onClick={closePreview}
                style={{
                  border:       "1px solid #eef0f2",
                  background:   "#fff",
                  borderRadius: "10px",
                  padding:      "8px 12px",
                  cursor:       "pointer",
                  fontWeight:   600,
                }}
              >
                Tutup
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "16px", overflow: "auto", background: "#f8fafc", minHeight: "300px" }}>
              {previewDoc.type === "image" ? (
                <img
                  src={previewDoc.previewUrl}
                  alt={previewDoc.filename}
                  style={{
                    width:        "100%",
                    maxHeight:    "75vh",
                    objectFit:    "contain",
                    display:      "block",
                    background:   "#fff",
                    borderRadius: "12px",
                  }}
                />
              ) : previewDoc.type === "pdf" ? (
                <iframe
                  src={previewDoc.previewUrl}
                  title={previewDoc.filename}
                  style={{
                    width:        "100%",
                    height:       "75vh",
                    border:       0,
                    borderRadius: "12px",
                    background:   "#fff",
                  }}
                />
              ) : (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", textAlign: "center", color: "#6b7280" }}>
                  Preview file ini belum didukung.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}