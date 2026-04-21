import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "../../../styles/AddCompany.css";
import {
  ChevronRight, ArrowLeft, ChevronDown, Mail, Phone,
  Upload, FileText, Trash2, Save, CircleHelp,
} from "lucide-react";
import { createAdminPartner } from "../../../services/admin";

// ── Confirm Modal ────────────────────────────────────────────────────────────
function SaveConfirmationModal({ open, onClose, onConfirm, isSubmitting }) {
  if (!open) return null;
  return (
    <div className="ac-modal-overlay" onClick={onClose}>
      <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ac-modal-icon-wrap">
          <div className="ac-modal-icon-ring">
            <CircleHelp size={28} />
          </div>
        </div>
        <h3 className="ac-modal-title">Simpan Perubahan?</h3>
        <p className="ac-modal-text">
          Apakah Anda yakin ingin menambah<br />Perusahaan ini?
        </p>
        <div className="ac-modal-actions">
          <button type="button" className="ac-modal-cancel" onClick={onClose} disabled={isSubmitting}>
            Tidak
          </button>
          <button type="button" className="ac-modal-confirm" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Iya"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AddCompany() {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [openModal,    setOpenModal]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");

  const [form, setForm] = useState({
  // tabel: users
  nama:     "",
  email:    "",
  password: "",

  // tabel: company_profiles
  nama_perusahaan:      "",
  industri:             "",
  ukuran_perusahaan:    "",
  website_url:          "",
  deskripsi:            "",
  notelp:               "",
  alamat_kantor_pusat:  "",
  nib:                  "",
  linkedin_url:         "",
  instagram_url:        "",
  twitter_url:          "",

  // ✅ field baru yang diminta Laravel
  jabatan_pic:    "",
  alamat_lengkap: "",
  kota:           "",
  provinsi:       "",
  kode_pos:       "",
});

  const [loa_pdf,    setLoaPdf]    = useState(null);
  const [akta_pdf,   setAktaPdf]   = useState(null);
  // ✅ dokumen tambahan TIDAK mempengaruhi loa_pdf / akta_pdf
  const [extraDocs,  setExtraDocs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Validasi & buka modal ─────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.nama || !form.email || !form.password || !form.nama_perusahaan) {
      setError("Nama, Email, Password, dan Nama Perusahaan wajib diisi.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setOpenModal(true);
  };

  // ── Submit ke backend ─────────────────────────────────────────────────────
  const handleConfirmSave = async () => {
  setIsSubmitting(true);
  setError("");

  try {
    const formData = new FormData();

    formData.append("nama_pic",      form.nama);
formData.append("email",         form.email);
formData.append("password",      form.password);
formData.append("jabatan_pic",   form.jabatan_pic);   // ✅

formData.append("nama_perusahaan",     form.nama_perusahaan);
formData.append("industri",            form.industri);
formData.append("ukuran_perusahaan",   form.ukuran_perusahaan);
formData.append("website_url",         form.website_url);
formData.append("deskripsi",           form.deskripsi);
formData.append("notelp",              form.notelp);
formData.append("alamat_lengkap",      form.alamat_lengkap);  // ✅ ganti alamat_kantor_pusat
formData.append("kota",                form.kota);            // ✅
formData.append("provinsi",            form.provinsi);        // ✅
formData.append("kode_pos",            form.kode_pos);        // ✅
formData.append("nib",                 form.nib);
formData.append("linkedin_url",        form.linkedin_url);
formData.append("instagram_url",       form.instagram_url);
formData.append("twitter_url",         form.twitter_url);

if (loa_pdf)  formData.append("loa_pdf",  loa_pdf);
if (akta_pdf) formData.append("akta_pdf", akta_pdf);

    extraDocs.forEach((doc) => {
      formData.append("extra_docs[]", doc.file);
    });

    await createAdminPartner(formData);
    setOpenModal(false);
    navigate("/admin/partners");

  } catch (err) {
    setOpenModal(false);
    console.error("=== ERROR ===", err?.response?.data);

    // ✅ tampilkan SEMUA error sekaligus agar mudah debug
    const laravelErrors = err?.response?.data?.errors;
    if (laravelErrors) {
      const allMessages = Object.entries(laravelErrors)
        .map(([field, msgs]) => `• ${field}: ${msgs[0]}`)
        .join("\n");
      setError(allMessages);
    } else {
      setError(err?.response?.data?.message || "Gagal menyimpan data perusahaan.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // ── File helpers ──────────────────────────────────────────────────────────
  const formatFileSize = (bytes) => {
    if (bytes < 1024)           return `${bytes} B`;
    if (bytes < 1024 * 1024)    return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ✅ dokumen tambahan TIDAK mengubah loa_pdf / akta_pdf
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file, i) => ({
      id:   Date.now() + i,
      name: file.name,
      size: file.size,
      file,
    }));
    setExtraDocs((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const handleDeleteExtra = (id) => {
    setExtraDocs((prev) => prev.filter((d) => d.id !== id));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="ac-layout">
      <Sidebar />
      <main className="ac-main">
        <Topbar />
        <section className="ac-content">

          <div className="ac-top-row">
            <div>
              <div className="ac-breadcrumb">
                <span>ADMIN</span><ChevronRight size={14} />
                <span>PARTNERS</span><ChevronRight size={14} />
                <span className="active">TAMBAH MITRA</span>
              </div>
              <h1 className="ac-page-title">Tambah Mitra Baru</h1>
            </div>
            <button type="button" className="ac-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} /><span>Kembali ke Daftar</span>
            </button>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              color: "#dc2626", padding: "12px 16px",
              borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem",
            }}>
              {error}
            </div>
          )}

          <form className="ac-form" onSubmit={handleSubmit}>

            {/* ── Informasi Akun ── */}
            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Informasi Akun</h2>
                <p>Data login akun perusahaan mitra.</p>
              </div>
              <div className="ac-card-body">
                <div className="ac-grid-2">
                  <div className="ac-field">
<label>Nama PIC / Penanggung Jawab <span>*</span></label>
<input
  type="text"
  name="nama"        
  value={form.nama}
  onChange={handleChange}
  placeholder="Nama lengkap PIC"
  required
/>
                  </div>
                  <div className="ac-field">
                    <label>Email <span>*</span></label>
                    <div className="ac-icon-input">
                      <Mail size={15} />
                      <input type="email" name="email" value={form.email}
                        onChange={handleChange} placeholder="pic@perusahaan.com" required />
                    </div>
                  </div>
                </div>
                <div className="ac-grid-2">
                  <div className="ac-field">
                    <label>No. Telepon / WhatsApp</label>
                    <div className="ac-icon-input">
                      <Phone size={15} />
                      <input type="text" name="notelp" value={form.notelp}
                        onChange={handleChange} placeholder="+62 812 3456 7890" />
                    </div>
                  </div>
                  <div className="ac-field">
  <label>Jabatan PIC <span>*</span></label>
  <input
    type="text"
    name="jabatan_pic"
    value={form.jabatan_pic}
    onChange={handleChange}
    placeholder="Contoh: HR Manager, Direktur"
    required
  />
</div>
                  <div className="ac-field">
                    <label>Password <span>*</span></label>
                    <input type="password" name="password" value={form.password}
                      onChange={handleChange} placeholder="Minimal 8 karakter" required />
                      
                  </div>
                </div>
              </div>
            </div>

            {/* ── Informasi Perusahaan ── */}
            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Informasi Perusahaan</h2>
                <p>Detail profil perusahaan mitra.</p>
              </div>
              <div className="ac-card-body">
                <div className="ac-grid-2">
                  <div className="ac-field">
                    <label>Nama Perusahaan <span>*</span></label>
                    <input type="text" name="nama_perusahaan" value={form.nama_perusahaan}
                      onChange={handleChange} placeholder="PT. Nama Perusahaan" required />
                  </div>
                  <div className="ac-field">
                    <label>NIB (Nomor Induk Berusaha)</label>
                    <input type="text" name="nib" value={form.nib}
                      onChange={handleChange} placeholder="1234567890" />
                  </div>
                </div>
                <div className="ac-grid-2">
                  <div className="ac-field">
                    <label>Industri</label>
                    <div className="ac-select-wrap">
                      <select name="industri" value={form.industri} onChange={handleChange}>
                        <option value="">-- Pilih Industri --</option>
                        <option value="Teknologi Informasi">Teknologi Informasi</option>
                        <option value="Retail">Retail</option>
                        <option value="NGO">NGO</option>
                        <option value="Design Agency">Design Agency</option>
                        <option value="Perbankan">Perbankan</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Pendidikan">Pendidikan</option>
                        <option value="Manufaktur">Manufaktur</option>
                        <option value="Logistik">Logistik</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <ChevronDown size={16} className="ac-select-icon" />
                    </div>
                  </div>
                  <div className="ac-field">
                    <label>Ukuran Perusahaan</label>
                    <div className="ac-select-wrap">
                      <select name="ukuran_perusahaan" value={form.ukuran_perusahaan} onChange={handleChange}>
                        <option value="">-- Pilih Ukuran --</option>
                        <option value="1-10">1–10 karyawan</option>
                        <option value="11-50">11–50 karyawan</option>
                        <option value="51-200">51–200 karyawan</option>
                        <option value="201-500">201–500 karyawan</option>
                        <option value="500+">500+ karyawan</option>
                      </select>
                      <ChevronDown size={16} className="ac-select-icon" />
                    </div>
                  </div>
                </div>
                <div className="ac-field full">
                  <label>Deskripsi Singkat</label>
                  <textarea name="deskripsi" value={form.deskripsi}
                    onChange={handleChange} rows={4}
                    placeholder="Jelaskan secara singkat tentang perusahaan..."
                    maxLength={500} />
                  <small>Maksimal 500 karakter.</small>
                </div>
              </div>
            </div>

            {/* ── Alamat & Website ── */}
            {/* ✅ Ganti field alamat_kantor_pusat dengan 4 field ini */}
<div className="ac-field full">
  <label>Alamat Lengkap</label>
  <input
    type="text"
    name="alamat_lengkap"
    value={form.alamat_lengkap}
    onChange={handleChange}
    placeholder="Jl. Contoh No.1, Kelurahan, Kecamatan"
  />
</div>

<div className="ac-grid-3">
  <div className="ac-field">
    <label>Kota <span>*</span></label>
    <input
      type="text"
      name="kota"
      value={form.kota}
      onChange={handleChange}
      placeholder="Surabaya"
      required
    />
  </div>
  <div className="ac-field">
    <label>Provinsi <span>*</span></label>
    <input
      type="text"
      name="provinsi"
      value={form.provinsi}
      onChange={handleChange}
      placeholder="Jawa Timur"
      required
    />
  </div>
  <div className="ac-field">
    <label>Kode Pos <span>*</span></label>
    <input
      type="text"
      name="kode_pos"
      value={form.kode_pos}
      onChange={handleChange}
      placeholder="60111"
      required
    />
  </div>
</div>

            {/* ── Dokumen Legalitas ── */}
            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Dokumen Legalitas</h2>
                <p>Unggah LOA (Letter of Agreement) dan Akta Perusahaan (PDF).</p>
              </div>
              <div className="ac-card-body">
                <div className="ac-grid-2" style={{ marginBottom: "16px" }}>
                  <div className="ac-field">
                    <label>LOA (Letter of Agreement) — PDF</label>
                    <input type="file" accept=".pdf"
                      onChange={(e) => setLoaPdf(e.target.files?.[0] || null)} />
                    {loa_pdf && <small style={{ color: "#16a34a" }}>✓ {loa_pdf.name}</small>}
                  </div>
                  <div className="ac-field">
                    <label>Akta Perusahaan — PDF</label>
                    <input type="file" accept=".pdf"
                      onChange={(e) => setAktaPdf(e.target.files?.[0] || null)} />
                    {akta_pdf && <small style={{ color: "#16a34a" }}>✓ {akta_pdf.name}</small>}
                  </div>
                </div>

                {/* Upload dokumen tambahan */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  style={{ display: "none" }}
                  onChange={handleFilesChange}
                />
                <div
                  className="ac-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <div className="ac-upload-icon"><Upload size={24} /></div>
                  <div className="ac-upload-text">
                    <span className="highlight">upload file tambahan</span>
                    <span>atau drag and drop</span>
                  </div>
                  <p>PDF, DOCX, PNG, JPG up to 10MB</p>
                </div>

                {extraDocs.length > 0 && (
                  <div className="ac-file-list">
                    {extraDocs.map((doc) => (
                      <div className="ac-file-item" key={doc.id}>
                        <div className="ac-file-left">
                          <div className="ac-file-icon"><FileText size={18} /></div>
                          <div className="ac-file-meta">
                            <strong>{doc.name}</strong>
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                        </div>
                        <button type="button" className="ac-file-delete"
                          onClick={() => handleDeleteExtra(doc.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ac-actions">
              <button type="button" className="ac-cancel-btn" onClick={() => navigate(-1)}>
                Batal
              </button>
              <button type="submit" className="ac-save-btn" disabled={isSubmitting}>
                <Save size={15} /><span>Simpan Mitra</span>
              </button>
            </div>
          </form>

          <footer className="ac-footer">© 2026 VOKASIK ACADEMY</footer>
        </section>
      </main>

      <SaveConfirmationModal
        open={openModal}
        onClose={() => !isSubmitting && setOpenModal(false)}
        onConfirm={handleConfirmSave}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}