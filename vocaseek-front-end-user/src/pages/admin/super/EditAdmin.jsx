import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "../../../styles/EditAdmin.css";
import {
  UserRound,
  ShieldCheck,
  ChevronDown,
  Save,
  CircleHelp,
  ArrowLeft,
} from "lucide-react";
import { getApiErrorMessage } from "../../../services/auth";
import { updateManagedAdminUser } from "../../../services/admin";

function SaveEditAdminModal({ open, onClose, onConfirm, isSaving }) {
  if (!open) return null;

  return (
    <div className="ea-modal-overlay" onClick={onClose}>
      <div className="ea-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ea-modal-icon-wrap">
          <div className="ea-modal-icon-ring">
            <CircleHelp size={28} />
          </div>
        </div>

        <h3 className="ea-modal-title">Simpan Perubahan?</h3>
        <p className="ea-modal-text">
          Apakah Anda yakin ingin menyimpan perubahan
          <br />
          pada data admin ini?
        </p>

        <div className="ea-modal-actions">
          <button
            type="button"
            className="ea-modal-cancel"
            onClick={onClose}
            disabled={isSaving}
          >
            Tidak
          </button>
          <button
            type="button"
            className="ea-modal-confirm"
            onClick={onConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Iya"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const admin = location.state || {
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "STAFF ADMIN",
    status: "Active",
  };

  const [form, setForm] = React.useState({
    nama: admin.name || "",
    email: admin.email || "",
    notelp: admin.phone || "",
    role: admin.role || "STAFF ADMIN",
    status: admin.status || "Active",
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleConfirmSave = async () => {
    if (!admin.id) {
      setErrorMessage("ID admin tidak ditemukan.");
      setOpenModal(false);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      await updateManagedAdminUser(admin.id, {
        nama: form.nama,
        email: form.email,
        notelp: form.notelp,
        role: form.role,
        status: form.status,
      });

      // ✅ Trigger UserManagement untuk refresh realtime
      window.dispatchEvent(new Event("adminUpdated"));

      setOpenModal(false);
      navigate("/admin/user-management");
    } catch (error) {
      setOpenModal(false);
      setErrorMessage(getApiErrorMessage(error, "Gagal menyimpan perubahan admin."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ea-layout">
      <Sidebar />

      <main className="ea-main">
        <Topbar />

        <section className="ea-content">
          <div className="ea-breadcrumb">
            <span>Admin</span>
            <span className="ea-breadcrumb-separator">›</span>
            <span>User Management</span>
            <span className="ea-breadcrumb-separator">›</span>
            <span className="active">Edit Admin</span>
          </div>

          <h1 className="ea-page-title">
            <ArrowLeft
              size={20}
              className="ea-back-icon"
              onClick={() => navigate(-1)}
            />
            Edit Admin
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

          <form className="ea-card" onSubmit={handleSubmit}>
            <div className="ea-card-head">
              <h2>Informasi Admin</h2>
              <p>Silakan perbarui data admin yang telah terdaftar.</p>
            </div>

            {/* INFORMASI AKUN */}
            <div className="ea-section">
              <div className="ea-section-title">
                <div className="ea-section-icon blue">
                  <UserRound size={18} />
                </div>
                <h3>Informasi Akun</h3>
              </div>

              <div className="ea-grid-2">
                <div className="ea-field">
                  <label>NAMA LENGKAP</label>
                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="ea-field">
                  <label>ALAMAT EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="ea-field full">
                <label>NOMOR TELEPON</label>
                <input
                  type="text"
                  name="notelp"
                  value={form.notelp}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ROLE & STATUS */}
            <div className="ea-section">
              <div className="ea-section-title">
                <div className="ea-section-icon yellow">
                  <ShieldCheck size={18} />
                </div>
                <h3>Pengaturan Peran</h3>
              </div>

              <div className="ea-grid-2">
                <div className="ea-field">
                  <label>PILIH ROLE / PERAN</label>
                  <div className="ea-select-wrap">
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="staff_admin">Staff Admin</option>
                    </select>
                    <ChevronDown size={18} className="ea-select-icon" />
                  </div>
                  <small>
                    Peran menentukan tingkat akses dan izin di dashboard internal.
                  </small>
                </div>

                <div className="ea-field">
                  <label>STATUS AKTIVASI ADMIN</label>
                  <div className="ea-select-wrap">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={18} className="ea-select-icon" />
                  </div>
                  <small>
                    Status menentukan apakah admin dapat login ke dashboard.
                  </small>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="ea-actions">
              <button
                type="button"
                className="ea-cancel-btn"
                onClick={() => navigate(-1)}
              >
                Batal
              </button>

              <button
                type="submit"
                className="ea-save-btn"
                disabled={isSaving}
              >
                <Save size={16} />
                <span>{isSaving ? "Menyimpan..." : "Simpan"}</span>
              </button>
            </div>
          </form>
        </section>
      </main>

      <SaveEditAdminModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />
    </div>
  );
}