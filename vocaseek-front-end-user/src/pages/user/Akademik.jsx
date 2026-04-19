import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Akademik.css";
import Pendidikan from "./Pendidikan";
import Pengalaman from "./Pengalaman";
import Sertifikasi from "./Sertifikasi";
import { Pencil, Trash2, Briefcase, Award, FileText } from "lucide-react";
import { getApiErrorMessage } from "../../services/auth";
import {
  getInternProfile,
  updateInternProfile,
  getExperiences,
  addExperience,
  deleteExperience,
  getLicenses,
  addLicense,
  deleteLicense,
} from "../../services/intern";
import {
  getScopedItem,
  removeScopedItem,
  setScopedItem,
  USER_STORAGE_KEYS,
} from "../../utils/userScopedStorage";

export default function Akademik() {
  const [openPendidikan, setOpenPendidikan]   = useState(false);
  const [openPengalaman, setOpenPengalaman]   = useState(false);
  const [openSertifikasi, setOpenSertifikasi] = useState(false);
  const navigate = useNavigate();

  const defaultAkademik = {
    pendidikan: {
      institusi: "",
      jurusan: "",
      statusPendidikan: "Saya Masih Kuliah Disini",
      semester: "",
      tahunLulus: "",
      ipk: "",
    },
    pengalaman: [],
    sertifikasi: [],
  };

  const [akademikData, setAkademikData] = useState(defaultAkademik);
  const [isLoaded, setIsLoaded]         = useState(false);
  const [isSaving, setIsSaving]         = useState(false);

  const normalizeAkademikData = (data) => ({
    ...defaultAkademik,
    ...(data || {}),
    pendidikan: {
      ...defaultAkademik.pendidikan,
      ...((data && data.pendidikan) || {}),
    },
    pengalaman:  Array.isArray(data?.pengalaman)  ? data.pengalaman  : [],
    sertifikasi: Array.isArray(data?.sertifikasi) ? data.sertifikasi : [],
  });

  const hasSavedAcademicData = (data) => {
    if (!data) return false;
    const pendidikan  = data?.pendidikan  || {};
    const pengalaman  = Array.isArray(data?.pengalaman)  ? data.pengalaman  : [];
    const sertifikasi = Array.isArray(data?.sertifikasi) ? data.sertifikasi : [];
    return (
      Boolean(pendidikan.institusi) &&
      Boolean(pendidikan.jurusan) &&
      pengalaman.length > 0 &&
      sertifikasi.length > 0
    );
  };

  // ── Load pendidikan dari backend + localStorage ──
  useEffect(() => {
    let isMounted = true;
    const loadAkademik = async () => {
      try {
        const draftData  = getScopedItem(USER_STORAGE_KEYS.akademikDraft);
        const savedData  = getScopedItem(USER_STORAGE_KEYS.akademik);
        const isEditMode = getScopedItem(USER_STORAGE_KEYS.akademikEditMode) === "true";

        if (draftData) {
          if (isMounted) setAkademikData(normalizeAkademikData(JSON.parse(draftData)));
          return;
        }

        let mergedData = savedData
          ? normalizeAkademikData(JSON.parse(savedData))
          : defaultAkademik;

        try {
          const response       = await getInternProfile();
          const backendProfile = response?.data?.data || {};
          mergedData = normalizeAkademikData({
            ...mergedData,
            pendidikan: {
              ...mergedData.pendidikan,
              institusi: backendProfile.universitas || mergedData.pendidikan.institusi,
              jurusan:   backendProfile.jurusan     || mergedData.pendidikan.jurusan,
              ipk:       backendProfile.ipk         || mergedData.pendidikan.ipk,
            },
          });
        } catch (error) {
          console.error("Gagal memuat data akademik dari backend:", error);
        }

        if (isMounted) {
          if (hasSavedAcademicData(mergedData) && !isEditMode) {
            navigate("/profil/data-akademik/simpan", { replace: true });
            return;
          }
          setAkademikData(mergedData);
        }
      } catch (error) {
        console.error("Gagal membaca data akademik:", error);
        if (isMounted) setAkademikData(defaultAkademik);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    };
    loadAkademik();
    return () => { isMounted = false; };
  }, [navigate]);

  // ── Load pengalaman & lisensi dari DB ──
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const [expRes, licRes] = await Promise.all([
          getExperiences(),
          getLicenses(),
        ]);
        // backend return { data: [...] }
        setAkademikData((prev) => ({
          ...prev,
          pengalaman:  expRes.data.data  ?? [],
          sertifikasi: licRes.data.data  ?? [],
        }));
      } catch (err) {
        console.error("Gagal load pengalaman/lisensi:", err);
      }
    };
    loadFromBackend();
  }, []);

  // ── Simpan draft ke localStorage ──
  useEffect(() => {
    if (!isLoaded) return;
    try {
      setScopedItem(USER_STORAGE_KEYS.akademikDraft, JSON.stringify(akademikData));
    } catch (error) {
      console.error("Gagal menyimpan draft:", error);
    }
  }, [akademikData, isLoaded]);

  // ── Pendidikan ──
  const handleSubmitPendidikan = (data) => {
    if (!data) return;
    setAkademikData((prev) => ({
      ...prev,
      pendidikan: { ...prev.pendidikan, ...data },
    }));
    setOpenPendidikan(false);
  };

  const handleDeletePendidikan = () => {
    setAkademikData((prev) => ({
      ...prev,
      pendidikan: {
        institusi: "",
        jurusan: "",
        statusPendidikan: "Saya Masih Kuliah Disini",
        semester: "",
        tahunLulus: "",
        ipk: "",
      },
    }));
  };

  // ── Pengalaman ──
  // Frontend kirim field sesuai kolom DB: title, company, period
  const handleSubmitPengalaman = async (data) => {
    if (!data) return;
    try {
      const res = await addExperience({
        title:   data.jabatan    || data.title   || "",
        company: data.perusahaan || data.company || "",
        period:  data.mulai && data.akhir
          ? `${data.mulai} - ${data.akhir}`
          : data.mulai || data.period || "",
      });
      const newItem = res.data.data;
      setAkademikData((prev) => ({
        ...prev,
        pengalaman: [...prev.pengalaman, newItem],
      }));
      setOpenPengalaman(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pengalaman kerja.");
    }
  };

  const handleDeletePengalaman = async (index) => {
    const item = akademikData.pengalaman[index];
    // Guard: pastikan id ada sebelum kirim request
    if (!item?.id) {
      console.error("ID pengalaman tidak ditemukan:", item);
      alert("Tidak dapat menghapus: ID tidak valid.");
      return;
    }
    try {
      await deleteExperience(item.id);
      setAkademikData((prev) => ({
        ...prev,
        pengalaman: prev.pengalaman.filter((_, i) => i !== index),
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus pengalaman.");
    }
  };

  // ── Sertifikasi ──
  // Frontend kirim field sesuai kolom DB: name
  const handleSubmitSertifikasi = async (data) => {
    if (!data) return;
    try {
      const res = await addLicense({
        name: data.nama || data.nama_sertifikat || data.name || "",
      });
      const newItem = res.data.data;
      setAkademikData((prev) => ({
        ...prev,
        sertifikasi: [...prev.sertifikasi, newItem],
      }));
      setOpenSertifikasi(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan sertifikasi.");
    }
  };

  const handleDeleteSertifikasi = async (index) => {
    const item = akademikData.sertifikasi[index];
    // Guard: pastikan id ada sebelum kirim request
    if (!item?.id) {
      console.error("ID sertifikasi tidak ditemukan:", item);
      alert("Tidak dapat menghapus: ID tidak valid.");
      return;
    }
    try {
      await deleteLicense(item.id);
      setAkademikData((prev) => ({
        ...prev,
        sertifikasi: prev.sertifikasi.filter((_, i) => i !== index),
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus sertifikasi.");
    }
  };

  // ── Save semua ke backend ──
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const pendidikanPayload = akademikData?.pendidikan || {};
      const payload = new FormData();
      payload.append("universitas", pendidikanPayload.institusi  || "");
      payload.append("jurusan",     pendidikanPayload.jurusan    || "");
      payload.append("ipk",         pendidikanPayload.ipk        || "");
      payload.append("tahun_lulus", pendidikanPayload.tahunLulus || "");

      await updateInternProfile(payload);

      setScopedItem(USER_STORAGE_KEYS.akademik, JSON.stringify(akademikData));
      removeScopedItem(USER_STORAGE_KEYS.akademikDraft);
      removeScopedItem(USER_STORAGE_KEYS.akademikEditMode);
      window.dispatchEvent(new Event("akademik-updated"));
      window.dispatchEvent(new Event("career-journey-updated"));
      navigate("/profil/data-akademik/simpan", { replace: true });
    } catch (error) {
      console.error("Gagal menyimpan data akademik:", error);
      alert(getApiErrorMessage(error, "Terjadi kesalahan saat menyimpan data akademik."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    try {
      const data = getScopedItem(USER_STORAGE_KEYS.akademik);
      removeScopedItem(USER_STORAGE_KEYS.akademikDraft);
      if (data) {
        const normalizedData = normalizeAkademikData(JSON.parse(data));
        setAkademikData(normalizedData);
        if (hasSavedAcademicData(normalizedData)) {
          removeScopedItem(USER_STORAGE_KEYS.akademikEditMode);
          navigate("/profil/data-akademik/simpan", { replace: true });
          return;
        }
      } else {
        setAkademikData(defaultAkademik);
      }
    } catch (error) {
      console.error("Gagal reset data akademik:", error);
      setAkademikData(defaultAkademik);
    }
  };

  if (!isLoaded) return null;

  const pendidikan      = akademikData?.pendidikan || defaultAkademik.pendidikan;
  const pengalamanList  = Array.isArray(akademikData?.pengalaman)  ? akademikData.pengalaman  : [];
  const sertifikasiList = Array.isArray(akademikData?.sertifikasi) ? akademikData.sertifikasi : [];
  const hasPendidikan   = Boolean(pendidikan.institusi || pendidikan.jurusan);
  const isMasihKuliah   = pendidikan.statusPendidikan === "Saya Masih Kuliah Disini";

  return (
    <div className="ak-wrap">
      <div className="ak-divider" />

      {/* ── Pendidikan ── */}
      <section className="ak-section">
        <h2 className="ak-title">Pendidikan</h2>
        <p className="ak-subtitle">
          Tambah riwayat pendidikan kamu untuk menambah peluang di Vocaseek
        </p>
        <button type="button" className="ak-addBtn" onClick={() => setOpenPendidikan(true)}>
          <span className="ak-plus">+</span>
          <span>{hasPendidikan ? "Edit Pendidikan" : "Tambah Pendidikan"}</span>
        </button>
        {hasPendidikan && (
          <div className="card-pendidikan">
            <div className="card-left">
              <div className="card-icon"><FileText size={20} /></div>
              <div className="card-content">
                <strong>{pendidikan.institusi}</strong>
                <p>{pendidikan.jurusan}</p>
                <p>IPK: {pendidikan.ipk || "-"}</p>
                <p>
                  {isMasihKuliah ? "Semester" : "Tahun Lulus"}:{" "}
                  {isMasihKuliah ? pendidikan.semester || "-" : pendidikan.tahunLulus || "-"}
                </p>
              </div>
            </div>
            <div className="card-action">
              <button type="button" onClick={() => setOpenPendidikan(true)}><Pencil size={18} /></button>
              <button type="button" onClick={handleDeletePendidikan}><Trash2 size={18} /></button>
            </div>
          </div>
        )}
      </section>

      {/* ── Pengalaman ── */}
      <section className="ak-section">
        <h2 className="ak-title">Pengalaman</h2>
        <button type="button" className="ak-addBtn" onClick={() => setOpenPengalaman(true)}>
          <span className="ak-plus">+</span>
          <span>Tambah Pengalaman</span>
        </button>
        {pengalamanList.map((item, index) => (
          <div className="card-pendidikan" key={item.id ?? index}>
            <div className="card-left">
              <div className="card-icon"><Briefcase size={20} /></div>
              <div className="card-content">
                {/* Kolom DB: company, title, period */}
                <strong>{item.company || "-"}</strong>
                <p>{item.title  || "-"}</p>
                <p>{item.period || "-"}</p>
              </div>
            </div>
            <div className="card-action">
              <button type="button"><Pencil size={18} /></button>
              <button type="button" onClick={() => handleDeletePengalaman(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ── Lisensi & Sertifikasi ── */}
      <section className="ak-section">
        <h2 className="ak-title">Lisensi dan Sertifikasi</h2>
        <button type="button" className="ak-addBtn" onClick={() => setOpenSertifikasi(true)}>
          <span className="ak-plus">+</span>
          <span>Tambah Sertifikasi</span>
        </button>
        {sertifikasiList.map((item, index) => (
          <div className="card-pendidikan" key={item.id ?? index}>
            <div className="card-left">
              <div className="card-icon"><Award size={20} /></div>
              <div className="card-content">
                {/* Kolom DB: name */}
                <strong>{item.name || "-"}</strong>
              </div>
            </div>
            <div className="card-action">
              <button type="button"><Pencil size={18} /></button>
              <button type="button" onClick={() => handleDeleteSertifikasi(index)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>

      <div className="ak-bottomDivider" />

      <div className="ak-footer">
        <button type="button" className="ak-cancel" onClick={handleCancel}>
          Batalkan
        </button>
        <button
          type="button"
          className="ak-saveChanges"
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <Pendidikan
        open={openPendidikan}
        onClose={() => setOpenPendidikan(false)}
        onSubmit={handleSubmitPendidikan}
        initialData={pendidikan}
      />
      <Pengalaman
        open={openPengalaman}
        onClose={() => setOpenPengalaman(false)}
        onSubmit={handleSubmitPengalaman}
      />
      <Sertifikasi
        open={openSertifikasi}
        onClose={() => setOpenSertifikasi(false)}
        onSubmit={handleSubmitSertifikasi}
      />
    </div>
  );
}