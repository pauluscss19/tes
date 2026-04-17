import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import "../../../styles/AddCompany.css";
import {
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Mail,
  Phone,
  Upload,
  FileText,
  Trash2,
  Save,
  CircleHelp,
} from "lucide-react";
import api from "../../../lib/api";

function SaveConfirmationModal({ open, onClose, onConfirm, loading }) {
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
          Apakah Anda yakin ingin menambah
          <br />
          Perusahaan ini?
        </p>

        <div className="ac-modal-actions">
          <button
            type="button"
            className="ac-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Tidak
          </button>

          <button
            type="button"
            className="ac-modal-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Iya"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddCompany() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    nama_perusahaan: "",
    industri: "Teknologi Informasi",
    website: "",
    deskripsi: "",
    nama_pic: "",
    jabatan_pic: "",
    email: "",
    notelp: "",
    alamat_lengkap: "",
    kota: "",
    provinsi: "",
    kode_pos: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setOpenModal(true);
  };

  const handleConfirmSave = async () => {
    setLoading(true);
    setError("");

    try {
      await api.post("/admin/partners", {
        nama_perusahaan: form.nama_perusahaan,
        industri: form.industri,
        website: form.website ? `https://${form.website}` : "",
        deskripsi: form.deskripsi,
        nama_pic: form.nama_pic,
        jabatan_pic: form.jabatan_pic,
        email: form.email,
        notelp: form.notelp,
        alamat_lengkap: form.alamat_lengkap,
        kota: form.kota,
        provinsi: form.provinsi,
        kode_pos: form.kode_pos,
      });

      setOpenModal(false);
      navigate("/admin/staff/partners");
    } catch (err) {
      setOpenModal(false);
      const errData = err?.response?.data;
      if (errData?.errors) {
        const messages = Object.values(errData.errors).flat().join(", ");
        setError(messages);
      } else {
        setError(errData?.message || "Gagal menambah perusahaan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const mappedFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      file,
    }));
    setDocuments((prev) => [...prev, ...mappedFiles]);
    e.target.value = "";
  };

  const handleDeleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="ac-layout">
      <Sidebar />

      <main className="ac-main">
        <Topbar />

        <section className="ac-content">
          <div className="ac-top-row">
            <div>
              <div className="ac-breadcrumb">
                <span>ADMIN</span>
                <ChevronRight size={14} />
                <span>PARTNERS</span>
                <ChevronRight size={14} />
                <span className="active">TAMBAH MITRA</span>
              </div>
              <h1 className="ac-page-title">Tambah Mitra Baru</h1>
            </div>

            <button type="button" className="ac-back-btn" onClick={handleBack}>
              <ArrowLeft size={15} />
              <span>Kembali ke Daftar</span>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <form className="ac-form" onSubmit={handleSubmit}>
            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Informasi Dasar Perusahaan</h2>
                <p>Detail utama profil perusahaan mitra.</p>

                <div className="ac-grid-2">
                  <div className="ac-field">
                    <label>Nama Perusahaan <span>*</span></label>
                    <input
                      type="text"
                      name="nama_perusahaan"
                      value={form.nama_perusahaan}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="ac-field">
                    <label>Industri <span>*</span></label>
                    <div className="ac-select-wrap">
                      <select
                        name="industri"
                        value={form.industri}
                        onChange={handleChange}
                        required
                      >
                        <option>Teknologi Informasi</option>
                        <option>Retail</option>
                        <option>NGO</option>
                        <option>Design Agency</option>
                      </select>
                      <ChevronDown size={16} className="ac-select-icon" />
                    </div>
                  </div>

                  <div className="ac-field">
                    <label>Website</label>
                    <div className="ac-url-input">
                      <span>https://</span>
                      <input
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="ac-field full">
                  <label>Deskripsi Singkat</label>
                  <textarea
                    rows={4}
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                  />
                  <small>Maksimal 500 karakter.</small>
                </div>
              </div>
            </div>

            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Kontak PIC (Person In Charge)</h2>
                <p>Informasi kontak penanggung jawab dari pihak mitra.</p>
              </div>

              <div className="ac-card-body">
                <div className="ac-grid-2">
                  <div className="ac-field">
                    <label>Nama Lengkap PIC <span>*</span></label>
                    <input
                      type="text"
                      name="nama_pic"
                      value={form.nama_pic}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="ac-field">
                    <label>Jabatan <span>*</span></label>
                    <input
                      type="text"
                      name="jabatan_pic"
                      value={form.jabatan_pic}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="ac-grid-2">
                  <div className="ac-field">
                    <label>Alamat Email <span>*</span></label>
                    <div className="ac-icon-input">
                      <Mail size={15} />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="ac-field">
                    <label>Nomor Telepon / WhatsApp <span>*</span></label>
                    <div className="ac-icon-input">
                      <Phone size={15} />
                      <input
                        type="text"
                        name="notelp"
                        value={form.notelp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Alamat Kantor</h2>
                <p>Lokasi operasional utama perusahaan.</p>
              </div>

              <div className="ac-card-body">
                <div className="ac-field full">
                  <label>Alamat Lengkap</label>
                  <input
                    type="text"
                    name="alamat_lengkap"
                    value={form.alamat_lengkap}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="ac-grid-3">
                  <div className="ac-field">
                    <label>Kota</label>
                    <input
                      type="text"
                      name="kota"
                      value={form.kota}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="ac-field">
                    <label>Provinsi</label>
                    <input
                      type="text"
                      name="provinsi"
                      value={form.provinsi}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="ac-field">
                    <label>Kode Pos</label>
                    <input
                      type="text"
                      name="kode_pos"
                      value={form.kode_pos}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="ac-card">
              <div className="ac-card-head">
                <h2>Dokumen Pendukung</h2>
                <p>Unggah dokumen legalitas atau draf MOU.</p>
              </div>

              <div className="ac-card-body">
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
                  onClick={handleOpenFilePicker}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenFilePicker();
                    }
                  }}
                >
                  <div className="ac-upload-icon">
                    <Upload size={24} />
                  </div>

                  <div className="ac-upload-text">
                    <span className="highlight">upload file</span>
                    <span>atau drag and drop</span>
                  </div>

                  <p>PDF, DOCX, PNG, JPG up to 10MB</p>
                </div>

                {documents.length > 0 && (
                  <div className="ac-file-list">
                    {documents.map((doc) => (
                      <div className="ac-file-item" key={doc.id}>
                        <div className="ac-file-left">
                          <div className="ac-file-icon">
                            <FileText size={18} />
                          </div>
                          <div className="ac-file-meta">
                            <strong>{doc.name}</strong>
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="ac-file-delete"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="ac-actions">
              <button
                type="button"
                className="ac-cancel-btn"
                onClick={handleBack}
              >
                Batal
              </button>

              <button type="submit" className="ac-save-btn">
                <Save size={15} />
                <span>Simpan Mitra</span>
              </button>
            </div>
          </form>

          <footer className="ac-footer">© 2026 VOKASIK ACADEMY</footer>
        </section>
      </main>

      <SaveConfirmationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmSave}
        loading={loading}
      />
    </div>
  );
}