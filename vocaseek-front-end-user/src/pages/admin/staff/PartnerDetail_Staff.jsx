import { useState, useEffect } from "react";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import "../../../styles/PartnerDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Trash2, Building2, ExternalLink,
  UserCircle2, Mail, Phone, Plus, History, ArrowLeft, Loader2,
} from "lucide-react";
import { getAdminPartnerDetail, deleteAdminPartner } from "../../../services/admin"; // ← GANTI

export default function PartnerDetail() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [partner,  setPartner]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await getAdminPartnerDetail(id); // ← GANTI
        setPartner(res.data?.data ?? res.data ?? null);
      } catch {
        setError("Gagal memuat data mitra.");
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Hapus mitra "${partner?.nama_perusahaan}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    setDeleting(true);
    try {
      await deleteAdminPartner(id); // ← GANTI
      navigate("/admin/staff/partners");
    } catch {
      alert("Gagal menghapus mitra. Coba lagi.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="pd-layout">
        <Sidebar />
        <main className="pd-main">
          <Topbar />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
            <Loader2 size={32} className="spin" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-layout">
        <Sidebar />
        <main className="pd-main">
          <Topbar />
          <div style={{ padding: "2rem", color: "red" }}>{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="pd-layout">
      <Sidebar />
      <main className="pd-main">
        <Topbar />
        <section className="pd-content">
          <div className="pd-top-row">
            <div>
              <div className="pd-breadcrumb">
                <span>ADMIN</span>
                <ChevronRight size={14} />
                <span>PARTNERS</span>
                <ChevronRight size={14} />
                <span className="active">DETAIL MITRA</span>
              </div>
              <h1 className="pd-page-title">
                <ArrowLeft size={20} className="pd-back-icon" onClick={() => navigate(-1)} />
                {partner?.nama_perusahaan ?? "-"}
              </h1>
            </div>
            <button
              className="pd-delete-btn"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={18} />
              <span>{deleting ? "Menghapus..." : "Hapus Mitra"}</span>
            </button>
          </div>

          <div className="pd-company-card">
            <div className="pd-company-head">
              <div className="pd-company-logo">
                {partner?.logo_url
                  ? <img src={partner.logo_url} alt="logo" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
                  : <Building2 size={28} />
                }
              </div>
              <div className="pd-company-main">
                <div className="pd-company-title-row">
                  <h2>{partner?.nama_perusahaan ?? "-"}</h2>
                </div>
                <a href={partner?.website_url ?? "#"} className="pd-company-link" target="_blank" rel="noreferrer">
                  {partner?.website_url ?? "Belum ada website"} <ExternalLink size={18} />
                </a>
                <div className="pd-company-meta">
                  <div>
                    <span>INDUSTRI</span>
                    <strong>{partner?.industri ?? "-"}</strong>
                  </div>
                  <div>
                    <span>KANTOR PUSAT</span>
                    <strong>{partner?.alamat_kantor_pusat ?? "-"}</strong>
                  </div>
                  <div>
                    <span>TGL BERGABUNG</span>
                    <strong>{partner?.tanggal_bergabung ?? "-"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pd-grid">
            <div className="pd-left-column">
              <div className="pd-card">
                <div className="pd-card-title">
                  <UserCircle2 size={22} />
                  <h3>Informasi Kontak (PIC)</h3>
                </div>
                <div className="pd-contact-row">
                  <div className="pd-contact-user">
                    <div className="pd-contact-avatar" />
                    <div>
                      <div className="pd-contact-name">{partner?.pic?.nama ?? "-"}</div>
                      <div className="pd-contact-role">{partner?.pic?.jabatan ?? "Perusahaan Mitra"}</div>
                    </div>
                  </div>
                  <div className="pd-contact-info">
                    <div className="pd-contact-item">
                      <Mail size={20} />
                      <span>{partner?.pic?.email ?? "-"}</span>
                    </div>
                    <div className="pd-contact-item">
                      <Phone size={20} />
                      <span>{partner?.pic?.phone ?? "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pd-card">
                <div className="pd-card-title">
                  <History size={22} />
                  <h3>Riwayat Aktivitas</h3>
                </div>
                {partner?.lowongans?.length > 0 ? (
                  partner.lowongans.map((job) => (
                    <div key={job.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
                      <strong>{job.judul}</strong>
                      <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>
                        {job.status} · {job.created_at}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="pd-empty-state">Belum ada aktivitas.</div>
                )}
              </div>
            </div>

            <div className="pd-right-column">
              <div className="pd-card pd-doc-card">
                <div className="pd-doc-head">
                  <h3>Dokumen Kerjasama</h3>
                  <button className="pd-plus-btn" type="button"><Plus size={22} /></button>
                </div>
                <div className="pd-doc-list">
                  {partner?.loa_url || partner?.akta_url ? (
                    [
                      partner.loa_url  && { title: "LOA / Surat Pernyataan", url: partner.loa_url },
                      partner.akta_url && { title: "Akta Perusahaan",         url: partner.akta_url },
                    ]
                    .filter(Boolean)
                    .map((doc, index) => (
                      <div key={index} className="pd-doc-item">
                        <div className="pd-doc-body">
                          <div className="pd-doc-meta">
                            <strong>{doc.title}</strong>
                          </div>
                        </div>
                        <div className="pd-doc-actions">
                          <a href={doc.url} target="_blank" rel="noreferrer" className="pd-doc-btn secondary">Lihat</a>
                          <a href={doc.url} download className="pd-doc-btn primary">Unduh</a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pd-empty-state">Belum ada dokumen kerjasama.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}