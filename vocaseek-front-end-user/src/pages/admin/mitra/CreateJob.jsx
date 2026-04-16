import "../../../styles/admin/CreateJob.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import { getApiErrorMessage } from "../../../services/auth";
import { createCompanyJob } from "../../../services/jobs";
import {
  Info,
  MapPin,
  FileText,
  CalendarDays,
  Circle,
  ChevronDown,
  SendHorizonal,
} from "lucide-react";

function SectionTitle({ icon, title }) {
  return (
    <div className="create-job__section-title">
      <div className="create-job__section-icon">{icon}</div>
      <h2 className="create-job__section-heading">{title}</h2>
    </div>
  );
}

function Label({ children }) {
  return <label className="create-job__label">{children}</label>;
}

function TextInput({ placeholder, value, onChange, required = false }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="create-job__text-input"
    />
  );
}

function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="create-job__text-input"
    />
  );
}

function SelectInput({ value, options, onChange }) {
  return (
    <div className="create-job__select-wrap">
      <select
        value={value}
        onChange={onChange}
        className="create-job__select-input"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="create-job__select-icon" />
    </div>
  );
}

function RichEditorMock({ placeholder, value, onChange }) {
  return (
    <div className="create-job__editor">
      <div className="create-job__editor-toolbar">
        <span className="is-bold">B</span>
        <span className="is-italic">I</span>
        <span className="is-underline">U</span>
        <span>≡</span>
        <span>∞</span>
      </div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="create-job__editor-textarea"
      />
    </div>
  );
}

export default function CreateJob() {
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    judul_posisi: "",
    tipe_pekerjaan: "full-time",
    lokasi: "",
    tipe_magang: "onsite",
    gaji_min: "",
    gaji_max: "",
    deskripsi_pekerjaan: "",
    persyaratan: "",
    deadline: "",
    mulai_kerja: "",
    status: "ACTIVE",
  });

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
    setErrorMessage("");
  };

  const buildPayload = () => {
    const salaryRange = [formData.gaji_min, formData.gaji_max]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(" - ");

    return {
      judul_posisi: formData.judul_posisi.trim(),
      deskripsi_pekerjaan: formData.deskripsi_pekerjaan.trim(),
      persyaratan: formData.persyaratan.trim(),
      lokasi: formData.lokasi.trim(),
      tipe_magang: formData.tipe_magang,
      gaji_per_bulan: salaryRange || null,
      status: formData.status,
      tipe_pekerjaan: formData.tipe_pekerjaan,
      tanggal_penutupan_lamaran: formData.deadline || null,
      tanggal_mulai_kerja: formData.mulai_kerja || null,
    };
  };

  const validateForm = () => {
    const payload = buildPayload();

    if (
      !payload.judul_posisi ||
      !payload.deskripsi_pekerjaan ||
      !payload.persyaratan ||
      !payload.lokasi
    ) {
      setErrorMessage("Lengkapi judul, lokasi, deskripsi, dan persyaratan dulu.");
      return false;
    }

    return true;
  };

  const handleOpenSaveModal = () => {
    if (!validateForm()) return;
    setShowSaveModal(true);
  };

  const handleSubmitJob = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createCompanyJob(buildPayload());
      setShowSaveModal(false);
      navigate("/admin/mitra/lowongan");
    } catch (error) {
      setShowSaveModal(false);
      setErrorMessage(
        getApiErrorMessage(error, "Lowongan gagal disimpan. Coba lagi sebentar.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-job">
      <Sidebar />

      <main className="create-job__main">
        <Topbar placeholder="Cari talenta, mitra, atau meeting..." />

        <section className="create-job__section">
          <div className="create-job__breadcrumb">
            <span className="muted">ADMIN</span>
            <span className="muted">›</span>
            <span className="muted">MANAJEMEN LOWONGAN</span>
            <span className="muted">›</span>
            <span className="active">TAMBAH LOWONGAN BARU</span>
          </div>

          <div className="create-job__header">
            <h1 className="create-job__page-title">Lowongan Baru</h1>
            <p className="create-job__page-subtitle">
              Buat lowongan baru untuk menarik talenta vokasi terbaik.
            </p>
          </div>

          <div className="create-job__card">
            <SectionTitle icon={<Info size={16} />} title="Informasi Dasar" />

            <div className="create-job__grid-two">
              <div className="create-job__full-width">
                <Label>Judul Pekerjaan</Label>
                <TextInput
                  placeholder="Contoh: Senior Frontend Developer"
                  value={formData.judul_posisi}
                  onChange={updateField("judul_posisi")}
                  required
                />
              </div>

              <div>
                <Label>Tipe Pekerjaan</Label>
                <SelectInput
                  value={formData.tipe_pekerjaan}
                  onChange={updateField("tipe_pekerjaan")}
                  options={[
                    { value: "full-time", label: "Penuh Waktu (Full-time)" },
                    { value: "part-time", label: "Paruh Waktu (Part-time)" },
                    { value: "internship", label: "Magang (Internship)" },
                    { value: "contract", label: "Kontrak" },
                  ]}
                />
              </div>
            </div>

            <div className="create-job__divider" />

            <SectionTitle icon={<MapPin size={16} />} title="Lokasi & Logistik" />

            <div className="create-job__grid-two">
              <div>
                <Label>Lokasi</Label>
                <TextInput
                  placeholder="Contoh: Jakarta Selatan, Indonesia"
                  value={formData.lokasi}
                  onChange={updateField("lokasi")}
                  required
                />
              </div>

              <div>
                <Label>Pengaturan Kerja</Label>
                <SelectInput
                  value={formData.tipe_magang}
                  onChange={updateField("tipe_magang")}
                  options={[
                    { value: "onsite", label: "WFO (Di Kantor)" },
                    { value: "hybrid", label: "Hybrid" },
                    { value: "remote", label: "Remote" },
                  ]}
                />
              </div>

              <div className="create-job__full-width">
                <Label>Kisaran Gaji / Insentif</Label>

                <div className="create-job__salary-grid">
                  <div className="create-job__salary-input-wrap">
                    <span className="create-job__currency">Rp</span>
                    <input
                      placeholder="Min"
                      value={formData.gaji_min}
                      onChange={updateField("gaji_min")}
                      className="create-job__salary-input create-job__salary-input--left"
                    />
                  </div>

                  <div className="create-job__salary-input-wrap create-job__salary-input-wrap--overlap">
                    <span className="create-job__currency">Rp</span>
                    <input
                      placeholder="Max"
                      value={formData.gaji_max}
                      onChange={updateField("gaji_max")}
                      className="create-job__salary-input create-job__salary-input--right"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="create-job__divider" />

            <SectionTitle icon={<FileText size={16} />} title="Detail Pekerjaan" />

            <div className="create-job__stack">
              <div>
                <Label>Deskripsi Pekerjaan</Label>
                <RichEditorMock
                  placeholder="Jelaskan tanggung jawab dan peran..."
                  value={formData.deskripsi_pekerjaan}
                  onChange={updateField("deskripsi_pekerjaan")}
                />
              </div>

              <div>
                <Label>Persyaratan</Label>
                <RichEditorMock
                  placeholder="Sebutkan kualifikasi, keahlian, dan pendidikan yang dibutuhkan..."
                  value={formData.persyaratan}
                  onChange={updateField("persyaratan")}
                />
              </div>
            </div>

            <div className="create-job__divider" />

            <SectionTitle
              icon={<CalendarDays size={16} />}
              title="Tanggal Penting"
            />

            <div className="create-job__grid-two">
              <div>
                <Label>Tanggal Penutupan Lamaran</Label>
                <DateInput
                  value={formData.deadline}
                  onChange={updateField("deadline")}
                />
              </div>

              <div>
                <Label>Tanggal Mulai Kerja / Magang</Label>
                <DateInput
                  value={formData.mulai_kerja}
                  onChange={updateField("mulai_kerja")}
                />
              </div>
            </div>

            <div className="create-job__divider" />

            <SectionTitle icon={<Circle size={16} />} title="Status Lowongan" />

            <div>
              <div className="create-job__status-note">
                Tentukan apakah lowongan ini dapat dilihat oleh pelamar.
              </div>

              <div className="create-job__radio-row">
                <label className="create-job__radio-label">
                  <input
                    type="radio"
                    name="jobStatus"
                    value="ACTIVE"
                    checked={formData.status === "ACTIVE"}
                    onChange={updateField("status")}
                    className="create-job__radio create-job__radio--open"
                  />
                  <span>Buka (Open)</span>
                </label>

                <label className="create-job__radio-label">
                  <input
                    type="radio"
                    name="jobStatus"
                    value="CLOSED"
                    checked={formData.status === "CLOSED"}
                    onChange={updateField("status")}
                    className="create-job__radio create-job__radio--closed"
                  />
                  <span>Tutup (Closed)</span>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="create-job__error-message">{errorMessage}</div>
            )}

            <div className="create-job__actions">
              <button
                onClick={() => navigate("/admin/mitra/lowongan")}
                className="create-job__cancel-btn"
              >
                Batal
              </button>

              <button
                onClick={handleOpenSaveModal}
                disabled={isSubmitting}
                className="create-job__save-btn"
              >
                <SendHorizonal size={15} />
                Simpan Lowongan
              </button>
            </div>
          </div>

          <div className="create-job__footer">
            <div>© 2026 VOCASIK ACADEMY • UNIFIED ADMIN ECOSYSTEM</div>
            <div className="create-job__footer-links">
              <span>PRIVASI</span>
              <span>HELP DESK</span>
            </div>
          </div>
        </section>
      </main>

      {showSaveModal && (
        <div className="create-job__modal-overlay">
          <div className="create-job__modal">
            <div className="create-job__modal-icon-wrap">
              <div className="create-job__modal-icon-inner">?</div>
            </div>

            <h2 className="create-job__modal-title">Simpan Perubahan?</h2>

            <p className="create-job__modal-text">
              Apakah Anda yakin ingin menyimpan perubahan pada lowongan ini?
            </p>

            <div className="create-job__modal-actions">
              <button
                onClick={() => setShowSaveModal(false)}
                className="create-job__modal-cancel"
              >
                Tidak
              </button>

              <button
                onClick={handleSubmitJob}
                disabled={isSubmitting}
                className="create-job__modal-confirm"
              >
                {isSubmitting ? "Menyimpan..." : "Iya"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
