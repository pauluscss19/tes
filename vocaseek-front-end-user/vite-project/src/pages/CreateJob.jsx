import "../styles/CreateJob.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
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

function TextInput({ placeholder }) {
  return <input placeholder={placeholder} className="create-job__text-input" />;
}

function SelectInput({ value, options }) {
  return (
    <div className="create-job__select-wrap">
      <select defaultValue={value} className="create-job__select-input">
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="create-job__select-icon" />
    </div>
  );
}

function RichEditorMock({ placeholder }) {
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
        className="create-job__editor-textarea"
      />
    </div>
  );
}

export default function CreateJob() {
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);

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
                <TextInput placeholder="Contoh: Senior Frontend Developer" />
              </div>

              <div>
                <Label>Nama Perusahaan</Label>
                <SelectInput
                  value="Pilih perusahaan mitra"
                  options={[
                    "Pilih perusahaan mitra",
                    "Bank Mandiri",
                    "TechNova",
                    "Vocaseek",
                  ]}
                />
              </div>

              <div>
                <Label>Kategori Pekerjaan</Label>
                <SelectInput
                  value="Pilih Kategori"
                  options={[
                    "Pilih Kategori",
                    "Teknologi Informasi",
                    "Desain Kreatif",
                    "Administrasi Bisnis",
                    "Teknik & Mekanik",
                  ]}
                />
              </div>

              <div className="create-job__full-width">
                <Label>Tipe Pekerjaan</Label>
                <SelectInput
                  value="Penuh Waktu (Full-time)"
                  options={[
                    "Penuh Waktu (Full-time)",
                    "Paruh Waktu (Part-time)",
                    "Magang (Internship)",
                    "Kontrak",
                  ]}
                />
              </div>
            </div>

            <div className="create-job__divider" />

            <SectionTitle icon={<MapPin size={16} />} title="Lokasi & Logistik" />

            <div className="create-job__grid-two">
              <div>
                <Label>Lokasi</Label>
                <TextInput placeholder="Contoh: Jakarta Selatan, Indonesia" />
              </div>

              <div>
                <Label>Pengaturan Kerja</Label>
                <SelectInput
                  value="WFO (Di Kantor)"
                  options={["WFO (Di Kantor)", "Hybrid", "Remote"]}
                />
              </div>

              <div className="create-job__full-width">
                <Label>Kisaran Gaji / Insentif</Label>

                <div className="create-job__salary-grid">
                  <div className="create-job__salary-input-wrap">
                    <span className="create-job__currency">Rp</span>
                    <input
                      placeholder="Min"
                      className="create-job__salary-input create-job__salary-input--left"
                    />
                  </div>

                  <div className="create-job__salary-input-wrap create-job__salary-input-wrap--overlap">
                    <span className="create-job__currency">Rp</span>
                    <input
                      placeholder="Max"
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
                <RichEditorMock placeholder="Jelaskan tanggung jawab dan peran..." />
              </div>

              <div>
                <Label>Persyaratan</Label>
                <RichEditorMock placeholder="Sebutkan kualifikasi, keahlian, dan pendidikan yang dibutuhkan..." />
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
                <TextInput placeholder="mm/dd/yyyy" />
              </div>

              <div>
                <Label>Tanggal Mulai Kerja / Magang</Label>
                <TextInput placeholder="mm/dd/yyyy" />
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
                    defaultChecked
                    className="create-job__radio create-job__radio--open"
                  />
                  <span>Buka (Open)</span>
                </label>

                <label className="create-job__radio-label">
                  <input
                    type="radio"
                    name="jobStatus"
                    className="create-job__radio create-job__radio--closed"
                  />
                  <span>Tutup (Closed)</span>
                </label>
              </div>
            </div>

            <div className="create-job__actions">
              <button
                onClick={() => navigate("/lowongan")}
                className="create-job__cancel-btn"
              >
                Batal
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
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
                onClick={() => navigate("/lowongan/pratinjau")}
                className="create-job__modal-confirm"
              >
                Iya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}