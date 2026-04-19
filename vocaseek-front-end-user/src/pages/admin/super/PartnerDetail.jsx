import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "../../../styles/PartnerDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronRight, Trash2, Building2, UserCircle2,
  Mail, Phone, CircleCheckBig, Clock3, FileText, History, ArrowLeft,
} from "lucide-react";
import { getApiErrorMessage } from "../../../services/auth";
import api from "../../../lib/api";

export default function PartnerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadPartner = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/admin/partners/${id}`);
        if (isMounted) setData(res.data?.data ?? null);
      } catch (requestError) {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, "Gagal memuat detail partner dari backend."));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadPartner();
    return () => { isMounted = false; };
  }, [id]);

  // ✅ FIX: data langsung flat, tidak ada nested 'perusahaan'
  const partner   = data ?? null;
  const pic       = data?.pic ?? null;
  const lowongans = data?.lowongans ?? [];

  // Dokumen dari loa_url dan akta_url
  const documents = [];
  if (data?.loa_url)   documents.push({ status: "verified", statusLabel: "Terverifikasi", title: "LOA / Surat Pernyataan", url: data.loa_url });
  if (data?.akta_url)  documents.push({ status: "verified", statusLabel: "Terverifikasi", title: "Akta Perusahaan", url: data.akta_url });

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
                {loading ? "Memuat..." : partner?.nama_perusahaan || "Detail Partner"}
              </h1>
            </div>
            <button className="pd-delete-btn" type="button" disabled>
              <Trash2 size={18} />
              <span>Hapus Mitra</span>
            </button>
          </div>

          {error && <div style={{ color: "#d93025", marginBottom: "16px" }}>{error}</div>}

          <div className="pd-company-card">
            <div className="pd-company-head">
              <div className="pd-company-logo">
                {partner?.logo_url
                  ? <img src={partner.logo_url} alt="logo" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
                  : <Building2 size={28} />}
              </div>
              <div className="pd-company-main">
                <div className="pd-company-title-row">
                  <h2>{partner?.nama_perusahaan || "-"}</h2>
                  <span className="pd-mou-badge">
                    {(partner?.status_mitra || "pending").toUpperCase()}
                  </span>
                </div>
                <div className="pd-company-meta">
                  <div><span>INDUSTRI</span><strong>{partner?.industri || "-"}</strong></div>
                  <div><span>KONTAK</span><strong>{partner?.notelp || "-"}</strong></div>
                  <div>
                    <span>TGL BERGABUNG</span>
                    <strong>{partner?.tanggal_bergabung || "-"}</strong>
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
                      <div className="pd-contact-name">{pic?.nama || "-"}</div>
                      <div className="pd-contact-role">Perusahaan Mitra</div>
                    </div>
                  </div>
                  <div className="pd-contact-info">
                    <div className="pd-contact-item">
                      <Mail size={20} />
                      <span>{pic?.email || "-"}</span>
                    </div>
                    <div className="pd-contact-item">
                      <Phone size={20} />
                      <span>{pic?.phone || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pd-card">
                <div className="pd-card-title">
                  <History size={22} />
                  <h3>Ringkasan Status</h3>
                </div>
                <div className="pd-timeline">
                  <div className="pd-timeline-item active">
                    <div className="pd-timeline-dot" />
                    <div className="pd-timeline-content">
                      <span>Status saat ini</span>
                      <p>Partner berada pada status <strong>{partner?.status_mitra || "-"}</strong>.</p>
                    </div>
                  </div>
                  {lowongans.map((job) => (
                    <div className="pd-timeline-item" key={job.id}>
                      <div className="pd-timeline-dot" />
                      <div className="pd-timeline-content">
                        <span>{job.created_at}</span>
                        <p>{job.judul} — <strong>{job.status}</strong></p>
                      </div>
                    </div>
                  ))}
                  <div className="pd-timeline-item">
                    <div className="pd-timeline-dot" />
                    <div className="pd-timeline-content">
                      <span>Alamat Kantor</span>
                      <p>{partner?.alamat_kantor_pusat || "Belum tersedia."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pd-right-column">
              <div className="pd-card pd-doc-card">
                <div className="pd-doc-head">
                  <h3>Dokumen Kerjasama</h3>
                </div>
                <div className="pd-doc-list">
                  {!loading && documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.title} className="pd-doc-item">
                        <div className={`pd-doc-status ${doc.status === "verified" ? "verified" : "review"}`}>
                          {doc.status === "verified" ? <CircleCheckBig size={16} /> : <Clock3 size={16} />}
                          <span>{doc.statusLabel}</span>
                        </div>
                        <div className="pd-doc-body">
                          <div className="pd-doc-icon red"><FileText size={24} /></div>
                          <div className="pd-doc-meta">
                            <strong>{doc.title}</strong>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="pd-doc-btn secondary">Lihat</a>
                          <a href={doc.url} download className="pd-doc-btn primary">Unduh</a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#6b7280", textAlign: "center", padding: "20px 0" }}>
                      {loading ? "Memuat dokumen partner..." : "Belum ada dokumen partner."}
                    </div>
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