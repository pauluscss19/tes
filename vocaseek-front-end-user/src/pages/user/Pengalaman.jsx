import React, { useState } from "react";
import "../../styles/Pengalaman.css";

export default function Pengalaman({ open, onClose, onSubmit }) {
  const [uploadedFile, setUploadedFile] = useState("");

  const [form, setForm] = useState({
    jabatan: "",
    jenis: "",
    perusahaan: "",
    mulai: "",
    akhir: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.jabatan || !form.perusahaan || !form.jenis) {
      alert("Jabatan, jenis pengalaman, dan nama perusahaan wajib diisi!");
      return;
    }

    onSubmit(form);
    onClose();
  };

  const handleUploadFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Ukuran file tidak boleh melebihi 1Mb.");
      e.target.value = "";
      return;
    }

    setUploadedFile(file.name);
  };

  const handleRemoveFile = () => {
    setUploadedFile("");
  };

  return (
    <div className="pg-overlay" onClick={onClose}>
      <div className="pg-modal" onClick={stop} role="dialog" aria-modal="true">
        <div className="pg-header">
          <div className="pg-headerText">
            <h2 className="pg-title">Pengalaman</h2>
            <p className="pg-subtitle">
              Tambah pengalaman perusahaan/organisasi kamu untuk menambah peluang di
              <br />
              Vocaseek.
            </p>
          </div>

          <button
            className="pg-close"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <form className="pg-body" onSubmit={handleSubmit}>
          <div className="pg-field">
            <label className="pg-label">
              Jabatan <span className="pg-req">*</span>
            </label>
            <input
              className="pg-input"
              placeholder="Jabatan"
              value={form.jabatan}
              onChange={(e) => handleChange("jabatan", e.target.value)}
            />
          </div>

          <div className="pg-field">
            <label className="pg-label">
              Jenis Pengalaman <span className="pg-req">*</span>
            </label>
            <div className="pg-selectWrap">
              <select
                className="pg-select"
                value={form.jenis}
                onChange={(e) => handleChange("jenis", e.target.value)}
              >
                <option value="" disabled>
                  Pilih jenis pengalaman
                </option>
                <option>Organisasi</option>
                <option>Magang</option>
                <option>Pekerjaan</option>
                <option>Volunteer</option>
              </select>
              <span className="pg-caret">▾</span>
            </div>
          </div>

          <div className="pg-field">
            <label className="pg-label">
              Nama Perusahaan <span className="pg-req">*</span>
            </label>
            <input
              className="pg-input"
              placeholder="Nama Perusahaan"
              value={form.perusahaan}
              onChange={(e) => handleChange("perusahaan", e.target.value)}
            />
          </div>

          <div className="pg-grid2">
            <div className="pg-field">
              <label className="pg-label">
                Tanggal Mulai <span className="pg-req">*</span>
              </label>
              <input
                type="date"
                className="pg-input"
                value={form.mulai}
                onChange={(e) => handleChange("mulai", e.target.value)}
              />
            </div>

            <div className="pg-field">
              <label className="pg-label">
                Tanggal Akhir <span className="pg-req">*</span>
              </label>
              <input
                type="date"
                className="pg-input"
                value={form.akhir}
                onChange={(e) => handleChange("akhir", e.target.value)}
              />
            </div>
          </div>

          <div className="pg-doc">
            <div className="pg-docTitle">Dokumen Pendukung</div>
            <div className="pg-docDesc">Ukuran file tidak boleh melebihi 1Mb.</div>

            <label className="pg-upload">
              <input
                type="file"
                className="pg-uploadInput"
                onChange={handleUploadFile}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <span className="pg-uploadPlus">＋</span>
              <span>Upload Dokumen</span>
            </label>

            {uploadedFile && (
              <div className="pg-uploadedFile">
                <div className="pg-uploadedFileText">
                  Dokumen diupload: <strong>{uploadedFile}</strong>
                </div>

                <button
                  type="button"
                  className="pg-removeFile"
                  onClick={handleRemoveFile}
                  aria-label="Hapus file"
                  title="Hapus file"
                >
                  🗑
                </button>
              </div>
            )}
          </div>

          <div className="pg-footerLine" />

          <div className="pg-footer">
            <button className="pg-cancel" type="button" onClick={onClose}>
              Batalkan
            </button>

            <button className="pg-save" type="submit">
              Simpan Pengalaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
