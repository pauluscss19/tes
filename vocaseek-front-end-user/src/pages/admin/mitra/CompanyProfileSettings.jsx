import "../../../styles/admin/CompanyProfileSettings.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import MapComponent from "../../../components/admin/MapComponentMitra";
import { getApiErrorMessage } from "../../../services/auth";
import {
  getCompanyFallbackLogo,
  getCompanyProfile,
  getCompanyProfileData,
  updateCompanyProfile,
} from "../../../services/companyProfile";
import {
  Eye,
  Info,
  Image as ImageIcon,
  Share2,
  Phone,
  MapPin,
  UploadCloud,
  Save,
  X,
  Link as LinkIcon,
} from "lucide-react";

function Card({ children, className = "" }) {
  return <div className={`company-settings__card ${className}`}>{children}</div>;
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
  required = false,
  readOnly = false,
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
          required={required}
          readOnly={readOnly}
          className={`company-settings__input ${icon ? "has-icon" : ""}`}
        />
      </div>

      {helper ? <p className="company-settings__helper">{helper}</p> : null}
    </div>
  );
}

const emptyForm = {
  nama_perusahaan: "",
  industri: "",
  ukuran_perusahaan: "",
  website_url: "",
  deskripsi: "",
  notelp: "",
  alamat_kantor_pusat: "",
  linkedin_url: "",
  instagram_url: "",
  twitter_url: "",
};

export default function CompanyProfileSettings() {
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [profileMeta, setProfileMeta] = useState({
    logo_url: "",
    banner_url: "",
    nib: "",
    status_mitra: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getCompanyProfile();
        if (!isMounted) return;

        const data = getCompanyProfileData(response);
        setForm({
          nama_perusahaan: data.nama_perusahaan || "",
          industri: data.industri || "",
          ukuran_perusahaan: data.ukuran_perusahaan || "",
          website_url: data.website_url || "",
          deskripsi: data.deskripsi || "",
          notelp: data.notelp || "",
          alamat_kantor_pusat: data.alamat_kantor_pusat || "",
          linkedin_url: data.linkedin_url || "",
          instagram_url: data.instagram_url || "",
          twitter_url: data.twitter_url || "",
        });
        setProfileMeta({
          logo_url: data.logo_url || "",
          banner_url: data.banner_url || "",
          nib: data.nib || "",
          status_mitra: data.status_mitra || "",
        });
        setLogoPreview(data.logo_url || "");
        setBannerPreview(data.banner_url || "");
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(
          getApiErrorMessage(error, "Gagal memuat pengaturan profil.")
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackLogo = useMemo(
    () => getCompanyFallbackLogo(form.nama_perusahaan),
    [form.nama_perusahaan]
  );

  const handleInputChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setMessage("");
    setErrorMessage("");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(profileMeta.logo_url || "");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(profileMeta.banner_url || "");
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const normalizeUrl = (value) => {
    const trimmedValue = String(value || "").trim();

    if (!trimmedValue) {
      return "";
    }

    if (/^https?:\/\//i.test(trimmedValue)) {
      return trimmedValue;
    }

    return `https://${trimmedValue}`;
  };

  const handleSaveProfile = async () => {
    if (!form.nama_perusahaan.trim()) {
      setErrorMessage("Nama perusahaan wajib diisi.");
      setShowSaveModal(false);
      return;
    }

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    const payload = new FormData();
    payload.append("nama_perusahaan", form.nama_perusahaan.trim());
    payload.append("industri", form.industri.trim());
    payload.append("ukuran_perusahaan", form.ukuran_perusahaan.trim());
    payload.append("website_url", normalizeUrl(form.website_url));
    payload.append("deskripsi", form.deskripsi.trim());
    payload.append("notelp", form.notelp.trim());
    payload.append("alamat_kantor_pusat", form.alamat_kantor_pusat.trim());
    payload.append("linkedin_url", normalizeUrl(form.linkedin_url));
    payload.append("instagram_url", normalizeUrl(form.instagram_url));
    payload.append("twitter_url", normalizeUrl(form.twitter_url));

    if (logoFile) {
      payload.append("logo", logoFile);
    }

    if (bannerFile) {
      payload.append("banner", bannerFile);
    }

    try {
      await updateCompanyProfile(payload);
      setMessage("Profil perusahaan berhasil disimpan.");
      setShowSaveModal(false);
      navigate("/admin/mitra/company-profile");
    } catch (error) {
      setShowSaveModal(false);
      setErrorMessage(
        getApiErrorMessage(error, "Gagal menyimpan profil perusahaan.")
      );
    } finally {
      setIsSaving(false);
    }
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
              onClick={() => navigate("/admin/mitra/company-profile")}
              className="company-settings__preview-btn"
            >
              <Eye size={16} />
              Preview Public Profile
            </button>
          </div>

          {isLoading && (
            <div className="company-settings__alert company-settings__alert--info">
              Memuat profil perusahaan...
            </div>
          )}

          {errorMessage && (
            <div className="company-settings__alert">{errorMessage}</div>
          )}

          {message && (
            <div className="company-settings__alert company-settings__alert--success">
              {message}
            </div>
          )}

          <div className="company-settings__grid">
            <div className="company-settings__left">
              <Card className="company-settings__card-padding-lg">
                <SectionTitle icon={<Info size={18} />} title="General Information" />

                <div className="company-settings__stack-lg">
                  <Input
                    label="Company Name"
                    placeholder="Nama perusahaan"
                    value={form.nama_perusahaan}
                    onChange={handleInputChange("nama_perusahaan")}
                    required
                  />

                  <div className="company-settings__two-col">
                    <Input
                      label="Industry"
                      placeholder="Contoh: Teknologi, Finance, Edukasi"
                      value={form.industri}
                      onChange={handleInputChange("industri")}
                    />
                    <Input
                      label="Company Size"
                      placeholder="Contoh: 51-200 karyawan"
                      value={form.ukuran_perusahaan}
                      onChange={handleInputChange("ukuran_perusahaan")}
                    />
                  </div>

                  <Input
                    label="Website URL"
                    placeholder="https://company.com"
                    value={form.website_url}
                    onChange={handleInputChange("website_url")}
                  />

                  <div>
                    <label className="company-settings__label">Company Description</label>
                    <p className="company-settings__helper company-settings__helper--mb">
                      Informasi ini akan tampil di profil perusahaan.
                    </p>
                    <textarea
                      value={form.deskripsi}
                      onChange={handleInputChange("deskripsi")}
                      placeholder="Ceritakan profil, budaya kerja, dan keunggulan perusahaan..."
                      className="company-settings__textarea"
                    />
                  </div>
                </div>
              </Card>

              <Card className="company-settings__card-padding-lg">
                <SectionTitle icon={<Phone size={18} />} title="Contact Information" />

                <div className="company-settings__two-col">
                  <Input
                    label="Phone Number"
                    placeholder="+62..."
                    helper="Nomor kontak utama perusahaan."
                    icon={<Phone size={16} />}
                    value={form.notelp}
                    onChange={handleInputChange("notelp")}
                  />
                  <Input
                    label="NIB"
                    placeholder="Nomor induk berusaha"
                    helper="NIB dari pendaftaran perusahaan."
                    value={profileMeta.nib}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
              </Card>

              <Card className="company-settings__card-padding-lg">
                <SectionTitle icon={<MapPin size={18} />} title="Office Location" />

                <Input
                  label="Headquarters Address"
                  placeholder="Alamat kantor pusat"
                  value={form.alamat_kantor_pusat}
                  onChange={handleInputChange("alamat_kantor_pusat")}
                />

                <div className="company-settings__map-box">
                  <div className="company-settings__map-fill">
                    <MapComponent />
                  </div>
                </div>
              </Card>
            </div>

            <div className="company-settings__right">
              <Card className="company-settings__card-padding-md">
                <SectionTitle icon={<ImageIcon size={18} />} title="Branding Assets" />

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
                        fallbackLogo
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
                        Rasio 1:1, maksimal 2MB, JPG atau PNG.
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
                        <UploadCloud size={18} className="company-settings__banner-upload-icon" />
                        <div className="company-settings__banner-upload-text">
                          Click to upload banner
                        </div>
                      </>
                    )}
                  </div>

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
              </Card>

              <Card className="company-settings__card-padding-md">
                <SectionTitle icon={<Share2 size={18} />} title="Social Presence" />

                <div className="company-settings__stack-sm">
                  <div className="company-settings__social-input-wrap">
                    <input
                      type="url"
                      value={form.linkedin_url}
                      onChange={handleInputChange("linkedin_url")}
                      placeholder="LinkedIn URL"
                      className="company-settings__social-input"
                    />
                    <span className="company-settings__social-prefix">IN</span>
                  </div>

                  <div className="company-settings__social-input-wrap">
                    <input
                      type="url"
                      value={form.twitter_url}
                      onChange={handleInputChange("twitter_url")}
                      placeholder="Twitter URL"
                      className="company-settings__social-input"
                    />
                    <span className="company-settings__social-prefix">TW</span>
                  </div>

                  <div className="company-settings__social-input-wrap">
                    <LinkIcon size={14} className="company-settings__social-link-icon" />
                    <input
                      type="url"
                      value={form.instagram_url}
                      onChange={handleInputChange("instagram_url")}
                      placeholder="Instagram URL"
                      className="company-settings__social-input company-settings__social-input--link"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="company-settings__footer-actions">
            <div className="company-settings__saved-text">
              Status mitra: {profileMeta.status_mitra || "pending"}
            </div>

            <div className="company-settings__action-buttons">
              <button
                onClick={() => navigate("/admin/mitra/company-profile")}
                className="company-settings__cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={isSaving}
                className="company-settings__save-btn"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
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
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="company-settings__modal-save"
              >
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
