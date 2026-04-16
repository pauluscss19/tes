import "../styles/TambahKandidat.css";
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  ChevronDown,
  Save,
  User,
  Upload,
  Link as LinkIcon,
  X,
  CheckCircle2,
  FileText,
  ImagePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VOCATIONAL_SKILL_OPTIONS = [
  "Teknologi Informasi",
  "Desain Kreatif",
  "Mekanik & Teknik",
  "Administrasi Bisnis",
  "Keuangan & Akuntansi",
  "Pemasaran & Penjualan",
  "Manajemen Proyek",
  "Operasional & Logistik",
  "Customer Service",
  "Data & Analitik",
];

const WORK_EXPERIENCE_OPTIONS = [
  "Fresh Graduate / Belum Ada Pengalaman",
  "Magang",
  "Kurang dari 1 Tahun",
  "1 - 2 Tahun",
  "3 - 5 Tahun",
  "6 - 10 Tahun",
  "Lebih dari 10 Tahun",
];

const EDUCATION_LEVEL_OPTIONS = [
  "SMP / Sederajat",
  "SMA / SMK / MA / Sederajat",
  "D1",
  "D2",
  "D3",
  "D4",
  "S1",
  "S2",
  "S3",
  "Profesi",
  "Sertifikasi Keahlian / Bootcamp",
  "Lainnya",
];

const SKILL_SUGGESTIONS = {
  "Teknologi Informasi": [
    "React",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "UI/UX",
    "Figma",
    "Testing",
    "DevOps",
  ],
  "Desain Kreatif": [
    "Figma",
    "Adobe Illustrator",
    "Photoshop",
    "Branding",
    "Prototyping",
    "Motion Design",
  ],
  "Mekanik & Teknik": [
    "AutoCAD",
    "SolidWorks",
    "PLC",
    "Maintenance",
    "Mechanical Drawing",
  ],
  "Administrasi Bisnis": [
    "Microsoft Excel",
    "Data Entry",
    "Document Control",
    "Administration",
  ],
  "Keuangan & Akuntansi": [
    "Accounting",
    "Tax",
    "Bookkeeping",
    "Financial Report",
    "Excel",
  ],
  "Pemasaran & Penjualan": [
    "Digital Marketing",
    "SEO",
    "Content Marketing",
    "Sales",
    "CRM",
  ],
  "Manajemen Proyek": [
    "Project Planning",
    "Scrum",
    "Agile",
    "Jira",
    "Stakeholder Management",
  ],
  "Operasional & Logistik": [
    "Inventory",
    "Warehouse",
    "Supply Chain",
    "Procurement",
  ],
  "Customer Service": [
    "Communication",
    "Complaint Handling",
    "CRM",
    "Call Center",
  ],
  "Data & Analitik": [
    "SQL",
    "Excel",
    "Power BI",
    "Tableau",
    "Python",
    "Data Cleaning",
  ],
};

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="tambah-kandidat__label">
        {label} {required && <span className="tambah-kandidat__required">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="tambah-kandidat__input"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="tambah-kandidat__label">
        {label} {required && <span className="tambah-kandidat__required">*</span>}
      </label>

      <div className="tambah-kandidat__select-wrap">
        <select
          value={value}
          onChange={onChange}
          className="tambah-kandidat__select"
        >
          <option value="">{placeholder}</option>
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <ChevronDown size={18} className="tambah-kandidat__select-icon" />
      </div>
    </div>
  );
}

function SectionCard({ number, title, children }) {
  return (
    <div className="tambah-kandidat__section-card">
      <div className="tambah-kandidat__section-header">
        <div className="tambah-kandidat__section-number">{number}</div>
        <h2 className="tambah-kandidat__section-title">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ValidationModal({ open, errors, onClose }) {
  if (!open) return null;

  return (
    <div className="tambah-kandidat__modal-overlay">
      <div className="tambah-kandidat__modal">
        <div className="tambah-kandidat__modal-header">
          <div className="tambah-kandidat__modal-title-wrap">
            <CheckCircle2 size={22} className="tambah-kandidat__modal-title-icon" />
            <h2 className="tambah-kandidat__modal-title">Validasi Form Kandidat</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="tambah-kandidat__modal-close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tambah-kandidat__modal-body">
          {errors.length === 0 ? (
            <div className="tambah-kandidat__modal-success">
              Semua data kandidat sudah lengkap dan siap disimpan.
            </div>
          ) : (
            <>
              <div className="tambah-kandidat__modal-text">
                Mohon lengkapi data berikut sebelum menyimpan:
              </div>

              <div className="tambah-kandidat__modal-error-list">
                {errors.map((error, index) => (
                  <div key={index} className="tambah-kandidat__modal-error-item">
                    {error}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="tambah-kandidat__modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="tambah-kandidat__modal-ok"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TambahKandidat() {
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    vocationalSkill: "",
    workExperience: "",
    educationLevel: "",
    portfolioUrl: "",
  });

  const [skillInput, setSkillInput] = React.useState("");
  const [skillTags, setSkillTags] = React.useState(["Figma", "Prototyping"]);

  const [photoFile, setPhotoFile] = React.useState(null);
  const [photoPreview, setPhotoPreview] = React.useState("");

  const [cvFile, setCvFile] = React.useState(null);

  const [showValidationModal, setShowValidationModal] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState([]);

  const photoInputRef = React.useRef(null);
  const cvInputRef = React.useRef(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
  };

  const addSkillTag = (value) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    if (skillTags.includes(cleanValue)) return;

    setSkillTags((prev) => [...prev, cleanValue]);
    setSkillInput("");
  };

  const removeSkillTag = (tag) => {
    setSkillTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillTag(skillInput);
    }
  };

  const suggestedSkills = SKILL_SUGGESTIONS[form.vocationalSkill] || [];

  const validateForm = () => {
    const errors = [];

    if (!form.fullName.trim()) errors.push("Nama lengkap wajib diisi.");
    if (!form.email.trim()) errors.push("Alamat email wajib diisi.");
    if (!form.phone.trim()) errors.push("Nomor telepon wajib diisi.");
    if (!form.birthDate) errors.push("Tanggal lahir wajib dipilih.");
    if (!form.address.trim()) errors.push("Alamat domisili wajib diisi.");
    if (!form.vocationalSkill)
      errors.push("Keahlian utama / klasifikasi wajib dipilih.");
    if (!form.workExperience)
      errors.push("Klasifikasi pengalaman kerja wajib dipilih.");
    if (!form.educationLevel)
      errors.push("Tingkat pendidikan wajib dipilih.");
    if (skillTags.length === 0)
      errors.push("Minimal 1 skill tag harus ditambahkan.");
    if (!photoFile) errors.push("Foto profil wajib diupload.");
    if (!cvFile) errors.push("Resume / CV wajib diupload.");

    return errors;
  };

  const handleSaveCandidate = () => {
    const errors = validateForm();
    setValidationErrors(errors);
    setShowValidationModal(true);

    if (errors.length === 0) {
      console.log("Candidate saved:", {
        form,
        skillTags,
        photoFile,
        cvFile,
      });
    }
  };

  return (
    <>
      <div className="tambah-kandidat">
        <Sidebar />

        <main className="tambah-kandidat__main">
          <Topbar placeholder="Global search for talents, partners, or meetings..." />

          <section className="tambah-kandidat__section">
            <div className="tambah-kandidat__breadcrumb">
              <span className="tambah-kandidat__breadcrumb-muted">ADMIN</span>
              <span className="tambah-kandidat__breadcrumb-muted">›</span>
              <span className="tambah-kandidat__breadcrumb-muted">
                MANAJEMEN TALENT
              </span>
              <span className="tambah-kandidat__breadcrumb-muted">›</span>
              <span className="tambah-kandidat__breadcrumb-active">
                TAMBAH KANDIDAT
              </span>
            </div>

            <div className="tambah-kandidat__header">
              <div>
                <h1 className="tambah-kandidat__page-title">Tambah Kandidat Baru</h1>
                <p className="tambah-kandidat__page-subtitle">
                  Lengkapi informasi kandidat, unggah dokumen, lalu simpan data ke
                  talent pool.
                </p>
              </div>

              <div className="tambah-kandidat__header-actions">
                <button
                  type="button"
                  onClick={() => navigate("/talent/semua-kandidat")}
                  className="tambah-kandidat__cancel-btn"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSaveCandidate}
                  className="tambah-kandidat__save-btn"
                >
                  <Save size={18} />
                  Simpan Kandidat
                </button>
              </div>
            </div>

            <div className="tambah-kandidat__grid">
              <div className="tambah-kandidat__left-column">
                <SectionCard number="1" title="Informasi Pribadi">
                  <div className="tambah-kandidat__two-col">
                    <InputField
                      label="Nama Lengkap"
                      placeholder="Contoh: Budi Santoso"
                      value={form.fullName}
                      onChange={handleChange("fullName")}
                      required
                    />

                    <InputField
                      label="Alamat Email"
                      placeholder="email@domain.com"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      required
                    />

                    <InputField
                      label="Nomor Telepon"
                      placeholder="+62 812 3456 7890"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      required
                    />

                    <InputField
                      label="Tanggal Lahir"
                      type="date"
                      value={form.birthDate}
                      onChange={handleChange("birthDate")}
                      required
                    />
                  </div>

                  <div className="tambah-kandidat__field-top">
                    <label className="tambah-kandidat__label">
                      Alamat Domisili <span className="tambah-kandidat__required">*</span>
                    </label>

                    <textarea
                      value={form.address}
                      onChange={handleChange("address")}
                      placeholder="Alamat lengkap kandidat..."
                      className="tambah-kandidat__textarea"
                    />
                  </div>
                </SectionCard>

                <SectionCard number="2" title="Keahlian & Pengalaman">
                  <div className="tambah-kandidat__two-col">
                    <SelectField
                      label="Klasifikasi Keahlian Utama"
                      placeholder="Pilih klasifikasi keahlian..."
                      value={form.vocationalSkill}
                      onChange={handleChange("vocationalSkill")}
                      options={VOCATIONAL_SKILL_OPTIONS}
                      required
                    />

                    <SelectField
                      label="Klasifikasi Pengalaman Kerja"
                      placeholder="Pilih klasifikasi pengalaman..."
                      value={form.workExperience}
                      onChange={handleChange("workExperience")}
                      options={WORK_EXPERIENCE_OPTIONS}
                      required
                    />
                  </div>

                  <div className="tambah-kandidat__field-top">
                    <label className="tambah-kandidat__label">
                      Skill Tags <span className="tambah-kandidat__required">*</span>
                    </label>

                    <div className="tambah-kandidat__tag-box">
                      <div className="tambah-kandidat__tag-list">
                        {skillTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => removeSkillTag(tag)}
                            className="tambah-kandidat__tag-item"
                          >
                            {tag}
                            <span className="tambah-kandidat__tag-close">×</span>
                          </button>
                        ))}

                        {skillTags.length === 0 && (
                          <span className="tambah-kandidat__tag-empty">
                            Belum ada skill tag
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Ketik skill lalu tekan Enter (misal: React, AutoCAD, Excel)"
                        className="tambah-kandidat__tag-input"
                      />
                    </div>

                    {form.vocationalSkill && suggestedSkills.length > 0 && (
                      <div className="tambah-kandidat__suggestion-wrap">
                        <div className="tambah-kandidat__suggestion-title">
                          Rekomendasi skill untuk klasifikasi{" "}
                          <span className="tambah-kandidat__suggestion-highlight">
                            {form.vocationalSkill}
                          </span>
                        </div>

                        <div className="tambah-kandidat__suggestion-list">
                          {suggestedSkills.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => addSkillTag(skill)}
                              className="tambah-kandidat__suggestion-item"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>

              <div className="tambah-kandidat__right-column">
                <SectionCard number="3" title="Pendidikan & Berkas">
                  <div>
                    <label className="tambah-kandidat__label">
                      Foto Profil <span className="tambah-kandidat__required">*</span>
                    </label>

                    <div className="tambah-kandidat__photo-card">
                      <div className="tambah-kandidat__photo-row">
                        <div className="tambah-kandidat__photo-preview">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Preview kandidat"
                              className="tambah-kandidat__photo-image"
                            />
                          ) : (
                            <User size={34} className="tambah-kandidat__photo-icon" />
                          )}
                        </div>

                        <div className="tambah-kandidat__photo-info">
                          <div className="tambah-kandidat__photo-title">
                            Upload foto kandidat
                          </div>

                          <div className="tambah-kandidat__photo-text">
                            Format JPG, PNG, atau JPEG. Disarankan rasio 1:1.
                          </div>

                          {photoFile && (
                            <div className="tambah-kandidat__photo-file">
                              {photoFile.name}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="tambah-kandidat__upload-photo-btn"
                          >
                            <ImagePlus size={16} />
                            Upload Foto
                          </button>

                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="tambah-kandidat__hidden-input"
                            onChange={handlePhotoChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tambah-kandidat__field-top">
                    <SelectField
                      label="Tingkat Pendidikan"
                      placeholder="Pilih tingkat pendidikan..."
                      value={form.educationLevel}
                      onChange={handleChange("educationLevel")}
                      options={EDUCATION_LEVEL_OPTIONS}
                      required
                    />
                  </div>

                  <div className="tambah-kandidat__field-top">
                    <label className="tambah-kandidat__label">
                      Resume / CV <span className="tambah-kandidat__required">*</span>
                    </label>

                    <div
                      onClick={() => cvInputRef.current?.click()}
                      className="tambah-kandidat__cv-dropzone"
                    >
                      <Upload size={24} className="tambah-kandidat__cv-icon" />
                      <div className="tambah-kandidat__cv-title">
                        Upload file CV / Resume
                      </div>
                      <div className="tambah-kandidat__cv-text">
                        Klik untuk upload atau drag and drop
                      </div>
                      <div className="tambah-kandidat__cv-note">
                        PDF, DOC, DOCX hingga 10MB
                      </div>

                      {cvFile && (
                        <div className="tambah-kandidat__cv-file">
                          <FileText size={16} />
                          {cvFile.name}
                        </div>
                      )}

                      <input
                        ref={cvInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="tambah-kandidat__hidden-input"
                        onChange={handleCvChange}
                      />
                    </div>
                  </div>

                  <div className="tambah-kandidat__field-top">
                    <label className="tambah-kandidat__label">
                      Portfolio URL (Opsional)
                    </label>

                    <div className="tambah-kandidat__link-wrap">
                      <LinkIcon size={18} className="tambah-kandidat__link-icon" />
                      <input
                        type="text"
                        value={form.portfolioUrl}
                        onChange={handleChange("portfolioUrl")}
                        placeholder="https://portfolio.com"
                        className="tambah-kandidat__link-input"
                      />
                    </div>
                  </div>
                </SectionCard>

                <div className="tambah-kandidat__summary-card">
                  <div className="tambah-kandidat__summary-title">Ringkasan Input</div>

                  <div className="tambah-kandidat__summary-list">
                    <div>
                      <span className="tambah-kandidat__summary-label">Nama:</span>{" "}
                      {form.fullName || "-"}
                    </div>
                    <div>
                      <span className="tambah-kandidat__summary-label">Keahlian:</span>{" "}
                      {form.vocationalSkill || "-"}
                    </div>
                    <div>
                      <span className="tambah-kandidat__summary-label">Pengalaman:</span>{" "}
                      {form.workExperience || "-"}
                    </div>
                    <div>
                      <span className="tambah-kandidat__summary-label">Pendidikan:</span>{" "}
                      {form.educationLevel || "-"}
                    </div>
                    <div>
                      <span className="tambah-kandidat__summary-label">
                        Jumlah Skill Tags:
                      </span>{" "}
                      {skillTags.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ValidationModal
        open={showValidationModal}
        errors={validationErrors}
        onClose={() => setShowValidationModal(false)}
      />
    </>
  );
}