import React, { useMemo, useState } from "react";
import "../../styles/Sertifikasi.css";

export default function Sertifikasi({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nama: "",
    penerbit: "",
    tanggal: "",
    nomor: "",
    deskripsi: "",
  });

  const [uploadedFile, setUploadedFile] = useState("");
  const countText = useMemo(
    () => `${form.deskripsi.length}/1500 Karakter`,
    [form.deskripsi]
  );

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nama || !form.penerbit || !form.tanggal || !form.nomor) {
      alert("Lengkapi data sertifikasi terlebih dahulu.");
      return;
    }

    onSubmit?.(form);
    onClose();
  };

  const handleUploadFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file tidak boleh melebihi 5MB.");
      e.target.value = "";
      return;
    }

    setUploadedFile(file.name);
  };

  const handleRemoveFile = () => {
    setUploadedFile("");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="sf-overlay" onClick={onClose}>
      <div className="sf-modal" onClick={stop} role="dialog" aria-modal="true">
        <div className="sf-header">
          <div className="sf-headText">
            <h2 className="sf-title">Lisensi dan Sertifikasi</h2>
            <p className="sf-subtitle">
              Tambah dokumen Lisensi dan Sertifikasi keahlian kamu untuk menambah peluang di{" "}
              <span className="sf-brand">Vocaseek</span>.
            </p>
          </div>

          <button
            className="sf-close"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="sf-divider" />

        <form className="sf-body" onSubmit={handleSubmit}>
          <div className="sf-grid2">
            <div className="sf-field">
              <label className="sf-label">
                Nama Lisensi <span className="sf-req">*</span>
              </label>
              <input
                className="sf-input"
                placeholder="Contoh: Senior UI/UX Designer"
                value={form.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
              />
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Organisasi Penerbit <span className="sf-req">*</span>
              </label>
              <input
                className="sf-input"
                placeholder="Nama organisasi atau lembaga"
                value={form.penerbit}
                onChange={(e) => handleChange("penerbit", e.target.value)}
              />
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Tanggal Terbit <span className="sf-req">*</span>
              </label>
              <input
                type="date"
                className="sf-input"
                value={form.tanggal}
                onChange={(e) => handleChange("tanggal", e.target.value)}
              />
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Nomor Sertifikat <span className="sf-req">*</span>
              </label>
              <input
                className="sf-input"
                placeholder="ID atau Nomor Seri Sertifikat"
                value={form.nomor}
                onChange={(e) => handleChange("nomor", e.target.value)}
              />
            </div>
          </div>

          <div className="sf-field sf-field--desc">
            <div className="sf-descTop">
              <label className="sf-label">Deskripsi</label>
              <div className="sf-counter">{countText}</div>
            </div>

            <textarea
              className="sf-textarea"
              value={form.deskripsi}
              onChange={(e) => {
                const v = e.target.value;
                if (v.length <= 1500) {
                  handleChange("deskripsi", v);
                }
              }}
              placeholder="Tulis deskripsi singkat tentang pencapaian atau materi yang dipelajari..."
            />
          </div>

          <div className="sf-doc">
            <div className="sf-docTitle">Dokumen Pendukung</div>
            <div className="sf-docDesc">
              Tambahkan media seperti gambar, dokumen, atau link. Maksimal 5MB.
            </div>

            <label className="sf-upload">
              <input
                type="file"
                className="sf-uploadInput"
                onChange={handleUploadFile}
              />
              <span className="sf-uploadIcon">+</span>
              <span>Upload Media</span>
            </label>

            {uploadedFile && (
              <div className="sf-uploadedFile">
                <div className="sf-uploadedFileText">
                  Dokumen diupload: <strong>{uploadedFile}</strong>
                </div>

                <button
                  type="button"
                  className="sf-removeFile"
                  onClick={handleRemoveFile}
                  aria-label="Hapus file"
                  title="Hapus file"
                >
                  🗑
                </button>
              </div>
            )}
          </div>

          <div className="sf-footerLine" />

          <div className="sf-footer">
            <button className="sf-cancel" type="button" onClick={onClose}>
              Batalkan
            </button>

            <button className="sf-save" type="submit">
              Simpan Sertifikasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}