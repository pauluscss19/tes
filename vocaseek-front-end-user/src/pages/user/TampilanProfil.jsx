import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TampilanProfil.css";
import {
  getScopedItem,
  setScopedItem,
  USER_STORAGE_KEYS,
} from "../../utils/userScopedStorage";

const defaultProfile = {
  about: "",
  photo: "",
  fullName: "-",
  gender: "-",
  birthDate: "",
  birthPlaceType: "",
  birthCity: "-",
  email: "-",
  phone: "-",
  province: "-",
  kabupaten: "-",
  addressDetail: "-",
  linkedin: "",
  instagram: "",
};

export default function TampilanProfil() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const loadProfile = () => {
      const saved = getScopedItem(USER_STORAGE_KEYS.dataDiri);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error("Gagal membaca data localStorage:", error);
        }
      }
    };

    loadProfile();

    window.addEventListener("storage", loadProfile);
    window.addEventListener("profile-updated", loadProfile);

    return () => {
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("profile-updated", loadProfile);
    };
  }, []);

  const formattedBirthDate = useMemo(() => {
    if (!profile.birthDate) return "-";

    const date = new Date(profile.birthDate);
    if (Number.isNaN(date.getTime())) return profile.birthDate;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [profile.birthDate]);

  const fullAddress = useMemo(() => {
    const parts = [
      profile.addressDetail,
      profile.kabupaten,
      profile.province,
    ].filter((item) => item && item !== "-");

    return parts.length ? parts.join(", ") : "-";
  }, [profile.addressDetail, profile.kabupaten, profile.province]);

  const aboutText = profile.about || 'Belum ada deskripsi "Tentang Saya".';

  const handleEdit = () => {
    setScopedItem(USER_STORAGE_KEYS.dataDiriEditMode, "true");
    navigate("/profil", { replace: true });
  };

  return (
    <div className="tpWrap">
      <div className="tpHeader">
        <div>
          <h2 className="tpTitle">Data Pribadi</h2>
          <p className="tpSubtitle">
            Pastikan data pribadi benar untuk mempermudah proses pendaftaran
          </p>
        </div>

        <button
          className="tpEditBtn"
          type="button"
          aria-label="Edit"
          onClick={handleEdit}
        >
          ✎
        </button>
      </div>

      <div className="tpSection">
        <div className="tpSectionLabel">BIODATA</div>

        <div className="tpBlock">
          <div className="tpBlockTitle">Tentang Saya</div>

          <div className="tpAboutCard">
            <p className="tpAboutText">{aboutText}</p>
          </div>

          <div className="tpGrid">
            <div className="tpField">
              <div className="tpFieldLabel">NAMA LENGKAP</div>
              <div className="tpFieldValue">{profile.fullName || "-"}</div>
            </div>

            <div className="tpField">
              <div className="tpFieldLabel">JENIS KELAMIN</div>
              <div className="tpFieldValue">{profile.gender || "-"}</div>
            </div>

            <div className="tpField">
              <div className="tpFieldLabel">TEMPAT LAHIR</div>
              <div className="tpFieldValue">{profile.birthCity || "-"}</div>
            </div>

            <div className="tpField">
              <div className="tpFieldLabel">TANGGAL LAHIR</div>
              <div className="tpFieldValue">{formattedBirthDate}</div>
            </div>

            <div className="tpField">
              <div className="tpFieldLabel">EMAIL ADDRESS</div>
              <div className="tpFieldValue">{profile.email || "-"}</div>
            </div>

            <div className="tpField">
              <div className="tpFieldLabel">NO HANDPHONE</div>
              <div className="tpFieldValue">{profile.phone || "-"}</div>
            </div>

            <div className="tpField tpFieldFull">
              <div className="tpFieldLabel">ALAMAT TEMPAT TINGGAL</div>
              <div className="tpFieldValue">{fullAddress}</div>
            </div>
          </div>
        </div>

        <div className="tpDivider" />

        <div className="tpBlock">
          <div className="tpSectionLabel tpSectionLabelBottom">SOCIAL MEDIA</div>

          <div className="tpSocialRow">
            <button
              className="tpSocialBtn"
              type="button"
              onClick={() => profile.linkedin && window.open(profile.linkedin, "_blank")}
            >
              <span className="tpSocialIcon" aria-hidden="true">
                in
              </span>
              <span>{profile.linkedin ? "LinkedIn" : "LinkedIn kosong"}</span>
            </button>

            <button
              className="tpSocialBtn"
              type="button"
              onClick={() => profile.instagram && window.open(profile.instagram, "_blank")}
            >
              <span className="tpSocialIcon ig" aria-hidden="true">
                ⦿
              </span>
              <span>{profile.instagram ? "Instagram" : "Instagram kosong"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
