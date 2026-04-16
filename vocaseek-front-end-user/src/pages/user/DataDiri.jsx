import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/DataDiri.css";
import {
  getScopedItem,
  removeScopedItem,
  setScopedItem,
  USER_STORAGE_KEYS,
} from "../../utils/userScopedStorage";
import {
  getInternProfile,
  updateInternProfile,
} from "../../services/intern";
import {
  INDONESIA_PROVINCES,
  INDONESIA_REGIONS,
} from "../../data/indonesiaRegions";

const defaultForm = {
  about: "",
  photo: "",
  fullName: "",
  gender: "",
  birthDate: "",
  birthPlaceType: "",
  birthCity: "",
  email: "",
  phone: "",
  province: "",
  kabupaten: "",
  addressDetail: "",
  linkedin: "",
  instagram: "",
};

const isDataDiriComplete = (data) => {
  if (!data) return false;

  return Boolean(
    data.about?.trim() &&
    data.fullName?.trim() &&
    data.gender?.trim() &&
    data.birthDate?.trim() &&
    data.birthPlaceType?.trim() &&
    data.birthCity?.trim() &&
    data.email?.trim() &&
    data.phone?.trim() &&
    data.province?.trim() &&
    data.kabupaten?.trim() &&
    data.addressDetail?.trim(),
  );
};

export default function DataDiri() {
  const [form, setForm] = useState(() => {
    const saved = getScopedItem(USER_STORAGE_KEYS.dataDiri);
    if (!saved) return defaultForm;

    try {
      const parsed = JSON.parse(saved);
      return { ...defaultForm, ...parsed };
    } catch (error) {
      console.error("Gagal membaca data localStorage:", error);
      return defaultForm;
    }
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const maxAbout = 1500;
  const fileRef = useRef(null);
  const kabupatenOptions = useMemo(() => {
    return form.province ? INDONESIA_REGIONS[form.province] || [] : [];
  }, [form.province]);

  const readSavedProfile = () => {
    try {
      const saved = getScopedItem(USER_STORAGE_KEYS.dataDiri);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Gagal membaca data localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const saved = readSavedProfile();
    const isEditMode =
      getScopedItem(USER_STORAGE_KEYS.dataDiriEditMode) === "true";

    if (saved && !isEditMode && location.pathname === "/profil") {
      navigate("/profil/tampilan", { replace: true });
      return;
    }

    if (saved && isEditMode) {
      return;
    }

    if (!saved) return;
  }, [location.pathname, navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadProfileFromBackend = async () => {
      try {
        const response = await getInternProfile();
        const payload = response?.data?.data || {};

        if (!isMounted) return;

        setForm((prev) => ({
          ...prev,
          photo: payload.foto || prev.photo,
          about: payload.tentang_saya || prev.about,
          fullName: payload.nama || prev.fullName,
          gender: payload.jenis_kelamin || prev.gender,
          birthDate: payload.tanggal_lahir || prev.birthDate,
          birthCity: payload.tempat_lahir || prev.birthCity,
          email: payload.email || prev.email,
          phone: payload.notelp || prev.phone,
          province: payload.provinsi || prev.province,
          kabupaten: payload.kabupaten || prev.kabupaten,
          addressDetail: payload.detail_alamat || prev.addressDetail,
          linkedin: payload.linkedin || prev.linkedin,
          instagram: payload.instagram || prev.instagram,
          birthPlaceType:
            prev.birthPlaceType ||
            (payload.tempat_lahir ? "Dalam Negeri" : ""),
        }));
      } catch (error) {
        console.error("Gagal memuat profil intern dari backend:", error);
      }
    };

    loadProfileFromBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const aboutCount = useMemo(() => form.about.length, [form.about]);

  const openFile = () => {
    fileRef.current?.click();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      ...(field === "province"
        ? {
            kabupaten:
              value === prev.province
                ? prev.kabupaten
                : "",
          }
        : {}),
      [field]: value,
    }));
  };

  const changePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedPhotoFile(file);
      handleChange("photo", reader.result);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const resetProfile = () => {
    removeScopedItem(USER_STORAGE_KEYS.dataDiri);
    removeScopedItem(USER_STORAGE_KEYS.dataDiriEditMode);
    setForm(defaultForm);
    setShowDeleteModal(false);
    window.dispatchEvent(new Event("profile-updated"));
    window.dispatchEvent(new Event("career-journey-updated"));
    navigate("/profil", { replace: true });
  };

  const saveProfile = () => {
    setScopedItem(USER_STORAGE_KEYS.dataDiri, JSON.stringify(form));
    removeScopedItem(USER_STORAGE_KEYS.dataDiriEditMode);
    window.dispatchEvent(new Event("profile-updated"));
    window.dispatchEvent(new Event("career-journey-updated"));
  };

  const saveProfileToBackend = async () => {
    const payload = new FormData();

    payload.append("tentang_saya", form.about);
    payload.append("tempat_lahir", form.birthCity);
    payload.append("tanggal_lahir", form.birthDate);
    payload.append("jenis_kelamin", form.gender);
    payload.append("provinsi", form.province);
    payload.append("kabupaten", form.kabupaten);
    payload.append("detail_alamat", form.addressDetail);
    payload.append("linkedin", form.linkedin);
    payload.append("instagram", form.instagram);
    payload.append("notelp", form.phone);

    if (selectedPhotoFile) {
      payload.append("foto", selectedPhotoFile);
    }

    await updateInternProfile(payload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitter = e.nativeEvent.submitter;
    const action = submitter?.value || "save";

    try {
      if (action === "reset") {
        setShowDeleteModal(true);
        return;
      }

      if (!isDataDiriComplete(form)) {
        alert("Mohon lengkapi semua data wajib terlebih dahulu.");
        return;
      }

      await saveProfileToBackend();
      saveProfile();
      navigate("/profil/tampilan", { replace: true });
    } catch (error) {
      console.error("Gagal memproses data:", error);
      alert(
        error?.response?.data?.message ||
          "Terjadi kesalahan saat memproses data",
      );
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    resetProfile();
  };

  return (
    <>
      <form id="dataDiriForm" className="dpWrap" onSubmit={handleSubmit}>
        <div className="dpSection">
          <div className="dpSectionTitle">FOTO PROFIL</div>

          <div className="dpPhotoRow">
            <div className="dpPhotoCard">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="foto profil"
                  className="dpPhotoPreview"
                />
              ) : (
                <>
                  <div className="dpPhotoAvatar" />
                  <div className="dpPhotoBadge">!</div>
                </>
              )}
            </div>

            <div className="dpPhotoInfo">
              <div className="dpPhotoHint">Unggah foto 1:1 (square)</div>

              <button className="dpLinkBtn" type="button" onClick={openFile}>
                Ganti Foto
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={changePhoto}
              />
            </div>
          </div>
        </div>

        <div className="dpSection">
          <label className="dpLabel" htmlFor="about">
            Tentang Saya <span className="dpReq">*</span>
          </label>

          <div className="dpTextareaWrap">
            <textarea
              id="about"
              className="dpTextarea"
              placeholder="Ceritakan tentang diri Anda, minat, dan keahlian Anda..."
              value={form.about}
              onChange={(e) =>
                handleChange("about", e.target.value.slice(0, maxAbout))
              }
            />

            <div className="dpCounter">
              {aboutCount} / {maxAbout} Karakter
            </div>
          </div>
        </div>

        <div className="dpGrid">
          <div className="dpField dpFieldFull">
            <label className="dpLabel">
              Nama Lengkap <span className="dpReq">*</span>
            </label>
            <input
              className="dpInput"
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Jenis Kelamin <span className="dpReq">*</span>
            </label>

            <div className="dpSelectWrap">
              <select
                className="dpSelect"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="" disabled>
                  Pilih jenis kelamin
                </option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Tanggal Lahir <span className="dpReq">*</span>
            </label>
            <input
              className="dpInput"
              type="date"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Tempat Lahir <span className="dpReq">*</span>
            </label>

            <div className="dpSelectWrap">
              <select
                className="dpSelect"
                value={form.birthPlaceType}
                onChange={(e) => handleChange("birthPlaceType", e.target.value)}
              >
                <option value="" disabled>
                  Pilih tempat lahir
                </option>
                <option value="Dalam Negeri">Dalam Negeri</option>
                <option value="Luar Negeri">Luar Negeri</option>
              </select>
            </div>
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Kota Lahir <span className="dpReq">*</span>
            </label>
            <input
              className="dpInput"
              type="text"
              value={form.birthCity}
              onChange={(e) => handleChange("birthCity", e.target.value)}
            />
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Email <span className="dpReq">*</span>
            </label>
            <input
              className="dpInput"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="dpField">
            <label className="dpLabel">
              No Handphone <span className="dpReq">*</span>
            </label>
            <input
              className="dpInput"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="dpField dpFieldFull">
            <label className="dpLabel">Alamat Sesuai KTP</label>
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Provinsi <span className="dpReq">*</span>
            </label>

            <div className="dpSelectWrap">
              <select
                className="dpSelect"
                value={form.province}
                onChange={(e) => handleChange("province", e.target.value)}
              >
                <option value="" disabled>
                  Pilih provinsi
                </option>
                {INDONESIA_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dpField">
            <label className="dpLabel">
              Kabupaten <span className="dpReq">*</span>
            </label>

            <div className="dpSelectWrap">
              <select
                className="dpSelect"
                value={form.kabupaten}
                onChange={(e) => handleChange("kabupaten", e.target.value)}
                disabled={!form.province}
              >
                <option value="" disabled>
                  {form.province ? "Pilih kabupaten / kota" : "Pilih provinsi dulu"}
                </option>
                {kabupatenOptions.map((kabupaten) => (
                  <option key={kabupaten} value={kabupaten}>
                    {kabupaten}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dpField dpFieldFull">
            <label className="dpLabel">
              Detail Alamat <span className="dpReq">*</span>
            </label>
            <textarea
              className="dpTextarea"
              value={form.addressDetail}
              onChange={(e) => handleChange("addressDetail", e.target.value)}
            />
          </div>
        </div>

        <div className="dpDivider" />

        <div className="dpSection dpSocialSection">
          <div className="dpSubTitle">Media Sosial</div>

          <div className="dpSocialList">
            <div className="dpSocialRow">
              <div className="dpSocialIcon">
                <img src="/LinkedIn.png" alt="LinkedIn" />
              </div>

              <input
                className="dpInput"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={form.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </div>

            <div className="dpSocialRow">
              <div className="dpSocialIcon">
                <img src="/Instagram.png" alt="Instagram" />
              </div>

              <input
                className="dpInput"
                type="url"
                placeholder="Instagram URL"
                value={form.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>

      {showDeleteModal && (
        <div className="dpModalOverlay" onClick={handleCloseDeleteModal}>
          <div className="dpDeleteModal" onClick={(e) => e.stopPropagation()}>
            <div className="dpDeleteIconWrap">
              <div className="dpDeleteIcon">!</div>
            </div>

            <h3 className="dpDeleteTitle">Hapus seluruh isi profil?</h3>

            <p className="dpDeleteDesc">
              Semua data yang sudah disimpan seperti foto profil, biodata,
              email, nomor handphone, alamat, dan media sosial akan dihapus dan
              dikosongkan kembali.
            </p>

            <div className="dpDeleteActions">
              <button
                type="button"
                className="dpDeleteCancelBtn"
                onClick={handleCloseDeleteModal}
              >
                Batal
              </button>

              <button
                type="button"
                className="dpDeleteConfirmBtn"
                onClick={handleConfirmDelete}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
