import "../styles/CompanyProfileSettings.css";
import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MapComponent from "../components/MapComponent";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Info,
  Image as ImageIcon,
  Share2,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  ChevronDown,
  UploadCloud,
  Trash2,
  Save,
  X,
  Link as LinkIcon,
} from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div className={`company-settings__card ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="company-settings__section-title">
      <div className="company-settings__section-icon">{icon}</div>
      <h2 className="company-settings__section-heading">{title}</h2>
    </div>
  );
}

function Input({
  label,
  placeholder,
  helper,
  icon,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="company-settings__label">{label}</label>

      <div className="company-settings__input-wrap">
        {icon ? <span className="company-settings__input-icon">{icon}</span> : null}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`company-settings__input ${icon ? "has-icon" : ""}`}
        />
      </div>

      {helper ? <p className="company-settings__helper">{helper}</p> : null}
    </div>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="company-settings__label">{label}</label>

      <div className="company-settings__select-wrap">
        <select
          value={value}
          onChange={onChange}
          className="company-settings__select"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown size={18} className="company-settings__select-icon" />
      </div>
    </div>
  );
}

export default function CompanyProfileSettings() {
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [form, setForm] = useState({
    companyName: "TechNova Solutions",
    industry: "Technology & Software",
    companySize: "51-200 Employees",
    websiteUrl: "https://www.example.com",
    description:
      "Tell us about your company culture, mission, and what makes it a great place to work...",
    companyEmail: "contact@company.com",
    phoneNumber: "+1 (555) 000-0000",
    headquartersAddress: "123 Innovation Drive, Silicon Valley, CA 94025",
    taxId: "XX.XXX.XXX.X-XXX.XXX",
    foundationDate: "",
    linkedinUrl: "",
    twitterUrl: "",
    facebookUrl: "",
    otherSocialUrl: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [legalFile, setLegalFile] = useState({
    name: "Business_License_2024.pdf",
    size: "2.4 MB",
    uploadedAt: "Oct 24, 2023",
  });

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const legalInputRef = useRef(null);

  const companySizeOptions = [
    "1-10 Employees",
    "11-50 Employees",
    "51-200 Employees",
    "201-500 Employees",
    "501-1000 Employees",
    "1001-5000 Employees",
    "5000+ Employees",
    "10,000+ Employees",
  ];

  const industryOptions = [
    "Technology & Software",
    "Banking & Finance",
    "Education",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Telecommunications",
  ];

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${Math.round(kb)} KB`;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleLegalUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLegalFile({
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const removeLegalFile = () => {
    setLegalFile(null);
    if (legalInputRef.current) legalInputRef.current.value = "";
  };

  return (
    <div className="company-settings">
      <Sidebar />

      <main className="company-settings__main">
        <Topbar placeholder="Global search for talents, partners, or meetings..." />

        <section className="company-settings__section">
          <div className="company-settings__breadcrumb">
            <span className="muted">ADMIN</span>
            <span className="muted">›</span>
            <span className="muted">COMPANY PROFILE</span>
            <span className="muted">›</span>
            <span className="active">COMPANY PROFILE SETTINGS</span>
          </div>

          <div className="company-settings__header">
            <h1 className="company-settings__page-title">Profile Settings</h1>

            <button
              onClick={() => navigate("/company-profile")}
              className="company-settings__preview-btn"
            >
              <Eye size={16} />
              Preview Public Profile
            </button>
          </div>

          <div className="company-settings__grid">
            <div className="company-settings__left">
              <Card className="company-settings__card-padding-lg">
                <SectionTitle
                  icon={<Info size={18} />}
                  title="General Information"
                />

                <div className="company-settings__stack-lg">
                  <Input
                    label="Company Name"
                    placeholder="TechNova Solutions"
                    value={form.companyName}
                    onChange={handleInputChange("companyName")}
                  />

                  <div className="company-settings__two-col">
                    <Select
                      label="Industry"
                      value={form.industry}
                      onChange={handleInputChange("industry")}
                      options={industryOptions}
                    />
                    <Select
                      label="Company Size"
                      value={form.companySize}
                      onChange={handleInputChange("companySize")}
                      options={companySizeOptions}
                    />
                  </div>

                  <Input
                    label="Website URL"
                    placeholder="https://www.example.com"
                    value={form.websiteUrl}
                    onChange={handleInputChange("websiteUrl")}
                  />

                  <div>
                    <label className="company-settings__label">
                      Company Description
                    </label>
                    <p className="company-settings__helper company-settings__helper--mb">
                      This will be displayed on the student-facing portal.
                    </p>
                    <textarea
                      value={form.description}
                      onChange={handleInputChange("description")}
                      placeholder="Tell us about your company culture, mission, and what makes it a great place to work..."
                      className="company-settings__textarea"
                    />
                  </div>
                </div>
              </Card>

              <Card className="company-settings__card-padding-lg">
                <SectionTitle
                  icon={<Mail size={18} />}
                  title="Contact Information"
                />

                <div className="company-settings__two-col">
                  <Input
                    label="Company Email"
                    placeholder="contact@company.com"
                    helper="Official contact for inquiries."
                    icon={<Mail size={16} />}
                    value={form.companyEmail}
                    onChange={handleInputChange("companyEmail")}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    helper="Main office line."
                    icon={<Phone size={16} />}
                    value={form.phoneNumber}
                    onChange={handleInputChange("phoneNumber")}
                  />
                </div>
              </Card>

              <Card className="company-settings__card-padding-lg">
                <SectionTitle
                  icon={<MapPin size={18} />}
                  title="Office Location"
                />

                <Input
                  label="Headquarters Address"
                  placeholder="123 Innovation Drive, Silicon Valley, CA 94025"
                  value={form.headquartersAddress}
                  onChange={handleInputChange("headquartersAddress")}
                />

                <div className="company-settings__map-box">
                  <div className="company-settings__map-fill">
                    <MapComponent />
                  </div>

                  <button className="company-settings__map-btn">
                    Update Map Pin
                  </button>
                </div>

                <div className="company-settings__branch-section">
                  <div className="company-settings__row-between company-settings__row-between--mb">
                    <h3 className="company-settings__subheading">Branch Offices</h3>
                    <button className="company-settings__add-branch-btn">
                      + Add Branch
                    </button>
                  </div>

                  <div className="company-settings__stack-sm">
                    <div className="company-settings__branch-item">
                      <div className="company-settings__branch-item-left">
                        <div className="company-settings__branch-icon">
                          <Building2 size={15} />
                        </div>
                        <div>
                          <div className="company-settings__branch-title">
                            New York Office
                          </div>
                          <div className="company-settings__branch-address">
                            456 Broadway, NY 10012
                          </div>
                        </div>
                      </div>
                      <button className="company-settings__trash-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="company-settings__branch-item">
                      <div className="company-settings__branch-item-left">
                        <div className="company-settings__branch-icon">
                          <Building2 size={15} />
                        </div>
                        <div>
                          <div className="company-settings__branch-title">
                            London Hub
                          </div>
                          <div className="company-settings__branch-address">
                            10 Downing St, London SW1A 2AA
                          </div>
                        </div>
                      </div>
                      <button className="company-settings__trash-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="company-settings__card-padding-lg">
                <SectionTitle
                  icon={<FileText size={18} />}
                  title="Additional Information"
                />

                <div className="company-settings__two-col">
                  <Input
                    label="Tax ID / NPWP"
                    placeholder="XX.XXX.XXX.X-XXX.XXX"
                    value={form.taxId}
                    onChange={handleInputChange("taxId")}
                  />
                  <Input
                    label="Foundation Date"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    value={form.foundationDate}
                    onChange={handleInputChange("foundationDate")}
                  />
                </div>

                <div className="company-settings__legal-block">
                  <label className="company-settings__label">Legal Documents</label>

                  <input
                    ref={legalInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="company-settings__hidden-input"
                    onChange={handleLegalUpload}
                  />

                  <div
                    onClick={() => legalInputRef.current?.click()}
                    className="company-settings__upload-dropzone"
                  >
                    <div className="company-settings__upload-icon-box">
                      <UploadCloud size={20} className="company-settings__upload-icon" />
                    </div>
                    <div className="company-settings__upload-title">
                      Click to upload or drag and drop
                    </div>
                    <div className="company-settings__upload-subtitle">
                      PDF, DOCX up to 10MB. (e.g., Business License, Tax Forms)
                    </div>
                  </div>

                  {legalFile && (
                    <div className="company-settings__uploaded-file">
                      <div className="company-settings__uploaded-file-left">
                        <div className="company-settings__uploaded-file-icon">
                          <FileText size={15} />
                        </div>
                        <div>
                          <div className="company-settings__uploaded-file-name">
                            {legalFile.name}
                          </div>
                          <div className="company-settings__uploaded-file-meta">
                            {legalFile.size} • Uploaded on {legalFile.uploadedAt}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={removeLegalFile}
                        className="company-settings__remove-file-btn"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="company-settings__right">
              <Card className="company-settings__card-padding-md">
                <SectionTitle
                  icon={<ImageIcon size={18} />}
                  title="Branding Assets"
                />

                <div>
                  <label className="company-settings__label">Company Logo</label>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="company-settings__hidden-input"
                    onChange={handleLogoUpload}
                  />

                  <div className="company-settings__logo-row">
                    <div className="company-settings__logo-preview">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Company logo"
                          className="company-settings__logo-image"
                        />
                      ) : (
                        "Current Logo"
                      )}
                    </div>

                    <div className="company-settings__logo-info">
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="company-settings__upload-link"
                      >
                        Upload New Logo
                      </button>
                      <p className="company-settings__logo-note">
                        Recommended 1:1 ratio, max
                        <br />
                        2MB, JPG or PNG.
                      </p>

                      {logoFile && (
                        <div className="company-settings__logo-file-row">
                          <span className="company-settings__logo-file-name">
                            {logoFile.name}
                          </span>
                          <button
                            onClick={removeLogo}
                            className="company-settings__logo-file-remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="company-settings__banner-block">
                  <label className="company-settings__label">Profile Banner</label>

                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="company-settings__hidden-input"
                    onChange={handleBannerUpload}
                  />

                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    className="company-settings__banner-dropzone"
                  >
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner"
                        className="company-settings__banner-image"
                      />
                    ) : (
                      <>
                        <UploadCloud
                          size={18}
                          className="company-settings__banner-upload-icon"
                        />
                        <div className="company-settings__banner-upload-text">
                          Click to upload banner
                        </div>
                      </>
                    )}
                  </div>

                  <div className="company-settings__banner-footer">
                    <p className="company-settings__banner-note">
                      Recommended 1200×300px.
                    </p>

                    {bannerFile && (
                      <button
                        onClick={removeBanner}
                        className="company-settings__banner-remove"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="company-settings__card-padding-md">
                <SectionTitle
                  icon={<Share2 size={18} />}
                  title="Social Presence"
                />

                <div className="company-settings__stack-sm">
                  <div className="company-settings__social-input-wrap">
                    <input
                      type="text"
                      value={form.linkedinUrl}
                      onChange={handleInputChange("linkedinUrl")}
                      placeholder="LinkedIn URL"
                      className="company-settings__social-input"
                    />
                    <span className="company-settings__social-prefix">IN</span>
                  </div>

                  <div className="company-settings__social-input-wrap">
                    <input
                      type="text"
                      value={form.twitterUrl}
                      onChange={handleInputChange("twitterUrl")}
                      placeholder="Twitter URL"
                      className="company-settings__social-input"
                    />
                    <span className="company-settings__social-prefix">TW</span>
                  </div>

                  <div className="company-settings__social-input-wrap">
                    <input
                      type="text"
                      value={form.facebookUrl}
                      onChange={handleInputChange("facebookUrl")}
                      placeholder="Facebook URL"
                      className="company-settings__social-input"
                    />
                    <span className="company-settings__social-prefix">FB</span>
                  </div>

                  <div className="company-settings__social-input-wrap">
                    <LinkIcon
                      size={14}
                      className="company-settings__social-link-icon"
                    />
                    <input
                      type="text"
                      value={form.otherSocialUrl}
                      onChange={handleInputChange("otherSocialUrl")}
                      placeholder="Additional social / custom URL"
                      className="company-settings__social-input company-settings__social-input--link"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="company-settings__footer-actions">
            <div className="company-settings__saved-text">
              <span className="company-settings__saved-dot">◉</span> Last saved 2
              minutes ago
            </div>

            <div className="company-settings__action-buttons">
              <button className="company-settings__cancel-btn">Cancel</button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="company-settings__save-btn"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </main>

      {showSaveModal && (
        <div className="company-settings__modal-overlay">
          <div className="company-settings__modal">
            <div className="company-settings__modal-icon-wrap">
              <div className="company-settings__modal-icon-inner">?</div>
            </div>

            <h2 className="company-settings__modal-title">Simpan Perubahan?</h2>

            <p className="company-settings__modal-text">
              Apakah Anda yakin ingin menyimpan perubahan pada pengaturan profil ini?
            </p>

            <div className="company-settings__modal-actions">
              <button
                onClick={() => setShowSaveModal(false)}
                className="company-settings__modal-cancel"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  setShowSaveModal(false);
                }}
                className="company-settings__modal-save"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}