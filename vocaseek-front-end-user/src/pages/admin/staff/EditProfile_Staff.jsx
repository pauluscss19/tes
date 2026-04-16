import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import "../../../styles/EditProfile.css";
import {
  ArrowLeft,
  Camera,
  UserRound,
  Mail,
  Phone,
  Save,
  User,
  CircleHelp,
  Trash2,
} from "lucide-react";
import { getApiErrorMessage } from "../../../services/auth";
import { getAdminProfile, updateAdminProfile } from "../../../services/admin";

function normalizeAdminProfile(payload) {
  const source = payload?.data?.data || payload?.data || payload || {};

  return {
    profileImage: source?.foto || source?.photo || "",
    fullName: source?.nama || source?.name || "",
    email: source?.email || "",
    phone: source?.notelp || source?.phone || "",
    role: "STAFF ADMIN",
  };
}

function syncAdminProfileStorage(profile) {
  localStorage.setItem("adminProfile", JSON.stringify(profile));
  window.dispatchEvent(new Event("profileUpdated"));
}

function SaveProfileModal({ open, onClose, onConfirm, isSaving }) {
  if (!open) return null;

  return (
    <div className="ep-modal-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ep-modal-icon-wrap">
          <div className="ep-modal-icon-ring">
            <CircleHelp size={28} />
          </div>
        </div>

        <h3 className="ep-modal-title">Simpan Perubahan?</h3>
        <p className="ep-modal-text">
          Apakah Anda yakin ingin menyimpan
          <br />
          perubahan profil ini?
        </p>

        <div className="ep-modal-actions">
          <button type="button" className="ep-modal-cancel" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="ep-modal-confirm"
            onClick={onConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProfileStaff() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const fallbackProfile = JSON.parse(localStorage.getItem("adminProfile")) || {};

  const [profileImage, setProfileImage] = React.useState(fallbackProfile.profileImage || "");
  const [fullName, setFullName] = React.useState(fallbackProfile.fullName || "");
  const [email, setEmail] = React.useState(fallbackProfile.email || "");
  const [phone, setPhone] = React.useState(fallbackProfile.phone || "");
  const [openSaveModal, setOpenSaveModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getAdminProfile();
        const normalizedProfile = normalizeAdminProfile(response);
        setProfileImage(normalizedProfile.profileImage);
        setFullName(normalizedProfile.fullName);
        setEmail(normalizedProfile.email);
        setPhone(normalizedProfile.phone);
        syncAdminProfileStorage(normalizedProfile);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, "Gagal memuat profil staff admin."));
      }
    };

    loadProfile();
  }, []);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleRemoveProfileImage = () => {
    setProfileImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      await updateAdminProfile({
        nama: fullName,
        notelp: phone,
      });

      syncAdminProfileStorage({
        profileImage,
        fullName,
        email,
        phone,
        role: "STAFF ADMIN",
      });

      setOpenSaveModal(false);
      navigate("/admin/staff/profil");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Gagal menyimpan profil staff admin."));
      setOpenSaveModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ep-layout">
      <Sidebar />

      <main className="ep-main">
        <Topbar />

        <section className="ep-content">
          <div className="ep-breadcrumb">
            <span>Admin</span>
            <span>&rsaquo;</span>
            <span>Profil</span>
            <span>&rsaquo;</span>
            <span className="active">Edit Profile</span>
          </div>

          <h1 className="ep-page-title">
            <ArrowLeft
              size={20}
              className="ep-back-icon"
              onClick={() => navigate(-1)}
            />
            Edit Profile
          </h1>

          {errorMessage && (
            <div
              style={{
                marginBottom: 16,
                padding: "12px 14px",
                borderRadius: 12,
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div className="ep-card">
            <div className="ep-hero" />

            <div className="ep-body">
              <div className="ep-avatar-section">
                <div className="ep-avatar-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="ep-file-input"
                    onChange={handleProfileImageChange}
                  />

                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="ep-avatar" />
                  ) : (
                    <div className="ep-avatar ep-avatar-placeholder">
                      <User size={46} />
                    </div>
                  )}

                  <button
                    type="button"
                    className="ep-camera-btn"
                    onClick={handleOpenFilePicker}
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <div className="ep-avatar-info">
                  <h2>{fullName || "Staff Admin Vocaseek"}</h2>
                  <p>Ubah informasi akun utama staff admin.</p>

                  {profileImage && (
                    <button
                      type="button"
                      className="ep-remove-photo-btn"
                      onClick={handleRemoveProfileImage}
                    >
                      <Trash2 size={15} />
                      <span>Hapus Foto</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="ep-section-title">
                <UserRound size={20} />
                <h3>Informasi Profil</h3>
              </div>

              <div className="ep-form-grid">
                <div className="ep-input-group">
                  <label>Nama Lengkap</label>
                  <div className="ep-input-wrap">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="ep-input-group">
                  <label>Email Utama</label>
                  <div className="ep-input-wrap">
                    <Mail size={16} />
                    <input type="email" value={email} readOnly />
                  </div>
                </div>

                <div className="ep-input-group">
                  <label>Nomor Telepon</label>
                  <div className="ep-input-wrap">
                    <Phone size={16} />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="ep-footer">
              <button
                type="button"
                className="ep-cancel-btn"
                onClick={() => navigate(-1)}
              >
                Batal
              </button>

              <button
                type="button"
                className="ep-save-btn"
                onClick={() => setOpenSaveModal(true)}
                disabled={isSaving}
              >
                <Save size={16} />
                <span>{isSaving ? "Menyimpan..." : "Simpan Profile"}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <SaveProfileModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />
    </div>
  );
}
