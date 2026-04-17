import "../../../styles/admin/JobApplicants.css";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import {
  ArrowLeft, Search, ChevronDown, ChevronLeft, ChevronRight, Eye,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import {
  getPageNumbers,
  getPaginationMeta,
  paginateItems,
} from "../../../utils/pagination";
import { getAuthSession } from "../../../utils/authStorage";

const ITEMS_PER_PAGE = 5;
const API_URL = import.meta.env.VITE_API_URL;

const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-red-100", text: "text-red-700" },
];

function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function StatusBadge({ status }) {
  const statusClassMap = {
    SCREENING:    "job-applicants__status-badge job-applicants__status-badge--screening",
    INTERVIEWING: "job-applicants__status-badge job-applicants__status-badge--interviewing",
    REJECTED:     "job-applicants__status-badge job-applicants__status-badge--rejected",
    HIRED:        "job-applicants__status-badge job-applicants__status-badge--hired",
  };
  return (
    <span className={statusClassMap[status] || "job-applicants__status-badge job-applicants__status-badge--default"}>
      {status}
    </span>
  );
}

function ApplicantRow({ initials, initialsBg, initialsText, name, id, department, subDepartment, appliedDate, status, applicationId, onView }) {
  return (
    <tr className="job-applicants__table-row">
      <td className="job-applicants__cell job-applicants__cell--name">
        <div className="job-applicants__applicant">
          <div className={`job-applicants__avatar ${initialsBg} ${initialsText}`}>{initials}</div>
          <div>
            <div className="job-applicants__applicant-name">{name}</div>
            <div className="job-applicants__applicant-id">ID: {id}</div>
          </div>
        </div>
      </td>
      <td className="job-applicants__cell">
        <div className="job-applicants__department">{department}</div>
        <div className="job-applicants__sub-department">{subDepartment}</div>
      </td>
      <td className="job-applicants__cell job-applicants__date">{appliedDate}</td>
      <td className="job-applicants__cell"><StatusBadge status={status} /></td>
      <td className="job-applicants__cell">
        <div className="job-applicants__actions">
          <button className="job-applicants__icon-btn" onClick={() => onView(applicationId)} title="Lihat Detail">
            <Eye size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ApplicantCard({ initials, initialsBg, initialsText, name, id, department, subDepartment, appliedDate, status, applicationId, onView }) {
  return (
    <div className="job-applicants__card-item">
      <div className="job-applicants__card-top">
        <div className="job-applicants__applicant">
          <div className={`job-applicants__avatar ${initialsBg} ${initialsText}`}>{initials}</div>
          <div>
            <div className="job-applicants__applicant-name">{name}</div>
            <div className="job-applicants__applicant-id">ID: {id}</div>
          </div>
        </div>
        <button className="job-applicants__icon-btn" onClick={() => onView(applicationId)} title="Lihat Detail">
          <Eye size={18} />
        </button>
      </div>
      <div className="job-applicants__card-grid">
        <div className="job-applicants__card-field">
          <div className="job-applicants__card-label">Universitas</div>
          <div className="job-applicants__department">{department}</div>
          <div className="job-applicants__sub-department">{subDepartment}</div>
        </div>
        <div className="job-applicants__card-field">
          <div className="job-applicants__card-label">Applied Date</div>
          <div className="job-applicants__date">{appliedDate}</div>
        </div>
        <div className="job-applicants__card-field">
          <div className="job-applicants__card-label">Status</div>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}

export default function JobApplicants() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applicants, setApplicants]   = React.useState([]);
  const [jobTitle, setJobTitle]       = React.useState("Lowongan");
  const [loading, setLoading]         = React.useState(true);
  const [error, setError]             = React.useState("");
  const [search, setSearch]           = React.useState("");
  const [sortOrder, setSortOrder]     = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    if (!jobId) return;
    const session = getAuthSession();
    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/company/jobs/${jobId}/applicants`, { // ✅ FIX: /company/jobs/
      headers: {
        Authorization: `Bearer ${session?.token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setJobTitle(data.job || "Lowongan"); // ✅ FIX: data.job bukan data.job_title

        const mapped = (data.applicants || []).map((app, index) => {
          const color = getAvatarColor(index);

          // Backend return applied_at sudah diformat "d M Y" (bukan ISO)
          // Simpan juga created_at raw untuk sorting jika tersedia
          const appliedRaw = app.created_at || app.applied_at || "";
          const appliedDate = app.applied_at || "-"; // ✅ sudah formatted dari backend

          return {
            applicationId: app.application_id, // ✅ integer dari backend
            name:          app.nama || app.name || "-",
            id:            app.user_id || "-",
            initials:      (app.nama || app.name || "?")
                             .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            initialsBg:    color.bg,
            initialsText:  color.text,
            department:    app.universitas || "-",
            subDepartment: app.jurusan || "-",
            appliedDate,
            appliedRaw,
            status:        app.status || "SCREENING",
          };
        });

        setApplicants(mapped);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Gagal memuat data pelamar. Coba refresh halaman.");
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const filtered = React.useMemo(() => {
    let result = [...applicants];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.subDepartment.toLowerCase().includes(q)
      );
    }
    // Sort hanya efektif jika appliedRaw berisi ISO date
    result.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.appliedRaw) - new Date(a.appliedRaw)
        : new Date(a.appliedRaw) - new Date(b.appliedRaw)
    );
    return result;
  }, [applicants, search, sortOrder]);

  const { pageItems: paginated } = React.useMemo(
    () => paginateItems(filtered, currentPage, ITEMS_PER_PAGE),
    [filtered, currentPage]
  );

  const paginationMeta = React.useMemo(
    () => getPaginationMeta(filtered.length, currentPage, ITEMS_PER_PAGE),
    [filtered.length, currentPage]
  );

  const pageNumbers = React.useMemo(
    () => getPageNumbers(paginationMeta.currentPage, paginationMeta.totalPages),
    [paginationMeta.currentPage, paginationMeta.totalPages]
  );

  React.useEffect(() => { setCurrentPage(1); }, [search, sortOrder]);

  React.useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, paginationMeta.totalPages || 1));
  }, [paginationMeta.totalPages]);

  const handleView = (applicationId) => {
    navigate(`/admin/mitra/lowongan/${jobId}/pelamar/${applicationId}`);
  };

  return (
    <div className="job-applicants">
      <Sidebar />
      <main className="job-applicants__main">
        <Topbar placeholder="Global search for talents, partners, or meetings..." />
        <section className="job-applicants__section">
          <div className="job-applicants__breadcrumb">
            <span className="job-applicants__breadcrumb-muted">ADMIN</span>
            <span className="job-applicants__breadcrumb-muted">›</span>
            <span className="job-applicants__breadcrumb-muted">MANAJEMEN LOWONGAN</span>
            <span className="job-applicants__breadcrumb-muted">›</span>
            <span className="job-applicants__breadcrumb-active">{jobTitle.toUpperCase()} APPLICANTS</span>
          </div>

          <div className="job-applicants__header">
            <button onClick={() => navigate("/admin/mitra/lowongan")} className="job-applicants__back-btn">
              <ArrowLeft size={20} />
            </button>
            <h1 className="job-applicants__title">{jobTitle} Applicants</h1>
          </div>

          <div className="job-applicants__table-card">
            <div className="job-applicants__toolbar">
              <div className="job-applicants__toolbar-grid">
                <div className="job-applicants__search-wrap">
                  <Search size={20} className="job-applicants__search-icon" />
                  <input
                    type="text"
                    placeholder="Cari nama, universitas, atau jurusan..."
                    className="job-applicants__search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="job-applicants__select-wrap">
                  <select
                    className="job-applicants__select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                  </select>
                  <ChevronDown size={18} className="job-applicants__select-icon" />
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "48px", textAlign: "center", color: "#6b7280" }}>
                Memuat data pelamar...
              </div>
            ) : error ? (
              <div style={{ padding: "48px", textAlign: "center", color: "#dc2626" }}>
                {error}
              </div>
            ) : (
              <>
                <div className="job-applicants__desktop-table-wrap">
                  <table className="job-applicants__table">
                    <thead className="job-applicants__table-head">
                      <tr className="job-applicants__table-head-row">
                        <th className="job-applicants__head-cell job-applicants__head-cell--name">Nama & ID</th>
                        <th className="job-applicants__head-cell">Universitas / Jurusan</th>
                        <th className="job-applicants__head-cell">Tanggal Melamar</th>
                        <th className="job-applicants__head-cell">Status</th>
                        <th className="job-applicants__head-cell">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length > 0 ? (
                        paginated.map((a, i) => (
                          <ApplicantRow key={i} {...a} onView={handleView} />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                              {search ? "Tidak ada hasil pencarian." : "Belum ada pelamar untuk lowongan ini."}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="job-applicants__mobile-list">
                  {paginated.length > 0 ? (
                    paginated.map((a, i) => (
                      <ApplicantCard key={i} {...a} onView={handleView} />
                    ))
                  ) : (
                    <div className="job-applicants__card-item">
                      <div className="job-applicants__applicant-name">
                        {search ? "Tidak ada hasil." : "Belum ada pelamar."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="job-applicants__pagination">
              <div className="job-applicants__pagination-text">
                Showing {paginationMeta.start} to {paginationMeta.end} of {filtered.length} results
              </div>
              {filtered.length > ITEMS_PER_PAGE && (
                <div className="job-applicants__pagination-controls job-applicants__pagination-controls--dynamic">
                  <button
                    className="job-applicants__page-btn job-applicants__page-btn--left"
                    disabled={paginationMeta.currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {pageNumbers.map((n, i) =>
                    n === "ellipsis" ? (
                      <button key={`e-${i}`} className="job-applicants__page-btn" disabled>...</button>
                    ) : (
                      <button
                        key={n}
                        className={`job-applicants__page-btn ${n === paginationMeta.currentPage ? "job-applicants__page-btn--active" : ""}`}
                        onClick={() => setCurrentPage(n)}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <button
                    className="job-applicants__page-btn job-applicants__page-btn--right"
                    disabled={paginationMeta.currentPage === paginationMeta.totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, paginationMeta.totalPages))}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}