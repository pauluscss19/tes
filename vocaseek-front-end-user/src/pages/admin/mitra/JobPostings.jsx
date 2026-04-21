import "../../../styles/admin/JobPostings.css";
import React from "react";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import {
  Plus,
  BriefcaseBusiness,
  CircleCheck,
  FileX2,
  FilePenLine,
  Search,
  Pencil,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../../services/auth";
import {
  deleteCompanyJob,
  getCompanyJobs,
  mapCompanyJobRow,
  updateCompanyJob,
} from "../../../services/jobs";
import {
  getPageNumbers,
  getPaginationMeta,
  paginateItems,
} from "../../../utils/pagination";

const ITEMS_PER_PAGE = 5;

function StatBox({
  title,
  value,
  subtitle,
  subtitleColor = "",
  icon,
  iconBg = "",
  iconColor = "",
}) {
  return (
    <div className="job-postings__stat-box">
      <div className="job-postings__stat-box-inner">
        <div>
          <p className="job-postings__stat-title">{title}</p>
          <h3 className="job-postings__stat-value">{value}</h3>
          <p className={`job-postings__stat-subtitle ${subtitleColor}`}>
            {subtitle}
          </p>
        </div>

        <div className={`job-postings__stat-icon-box ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Open: "job-postings__status-badge job-postings__status-badge--open",
    Draft: "job-postings__status-badge job-postings__status-badge--draft",
    Closed: "job-postings__status-badge job-postings__status-badge--closed",
  };

  return <span className={styles[status]}>{status}</span>;
}

function ApplicantAvatars({ type = "many", label, onClick }) {
  if (type === "none") {
    return <div className="job-postings__applicant-empty-label">{label}</div>;
  }

  return (
    <div>
      <div className="job-postings__avatar-group">
        {type === "many" ? (
          <>
            <div className="job-postings__avatar-bubble job-postings__avatar-bubble--many-1" />
            <div className="job-postings__avatar-bubble job-postings__avatar-bubble--many-2" />
            <div className="job-postings__avatar-bubble job-postings__avatar-bubble--many-3" />
            <div className="job-postings__avatar-bubble job-postings__avatar-bubble--count">
              +12
            </div>
          </>
        ) : (
          <>
            <div className="job-postings__avatar-bubble job-postings__avatar-bubble--few-1" />
            <div className="job-postings__avatar-bubble job-postings__avatar-bubble--few-2" />
          </>
        )}
      </div>

      <button type="button" onClick={onClick} className="job-postings__applicant-link">
        {label}
      </button>
    </div>
  );
}

function MobileJobCard({ row, onEdit, onDelete, onApplicants, onRestore }) {
  return (
    <div className="job-postings__mobile-card">
      <div className="job-postings__mobile-card-top">
        <div className="job-postings__job-main">
          <div className={`job-postings__job-tag ${row.tagBg} ${row.tagText}`}>
            {row.tag}
          </div>

          <div>
            <div className="job-postings__job-title">{row.title}</div>
            <div className="job-postings__job-id">{row.id}</div>
          </div>
        </div>

        <StatusBadge status={row.status} />
      </div>

      <div className="job-postings__mobile-meta">
        <div className="job-postings__mobile-field">
          <div className="job-postings__mobile-label">Department</div>
          <div className="job-postings__department">{row.dept}</div>
          <div className="job-postings__team">{row.team}</div>
        </div>

        <div className="job-postings__mobile-field">
          <div className="job-postings__mobile-label">Posted Date</div>
          <div className="job-postings__date">{row.date}</div>
        </div>

        <div className="job-postings__mobile-field">
          <div className="job-postings__mobile-label">Applicants</div>

          {row.applicantCountBubble ? (
            <div>
              <div className="job-postings__applicant-count-bubble">8</div>
              <button type="button" onClick={onApplicants} className="job-postings__applicant-link">
                View Applicants
              </button>
            </div>
          ) : (
            <ApplicantAvatars
              type={row.applicantsType}
              label={row.applicantsLabel}
              onClick={onApplicants}
            />
          )}
        </div>
      </div>

      <div className="job-postings__mobile-actions">
        {row.actions === "edit" ? (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="job-postings__action-btn job-postings__action-btn--edit"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="job-postings__action-btn job-postings__action-btn--delete"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onRestore}
            className="job-postings__action-btn job-postings__action-btn--restore"
          >
            <RotateCcw size={16} />
            Restore
          </button>
        )}
      </div>
    </div>
  );
}

const INITIAL_ROWS = [];

export default function JobPostings() {
  const navigate = useNavigate();
  const [jobRows, setJobRows] = React.useState(INITIAL_ROWS);
  const [activeTab, setActiveTab] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  const loadJobs = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getCompanyJobs();
      const jobs = response?.data?.jobs || response?.data?.data || [];
      setJobRows(jobs.map(mapCompanyJobRow));
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "Gagal memuat daftar lowongan.")
      );
      setJobRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleEditJob = (row) => {
    navigate(`/admin/mitra/lowongan/${row.backendId}/edit`, { state: { job: row } });
  };

  const handleDeleteJob = async (row) => {
    if (!row.backendId) return;

    try {
      await deleteCompanyJob(row.backendId);
      setJobRows((prev) => prev.filter((item) => item.backendId !== row.backendId));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Lowongan gagal dihapus."));
    }
  };

  const handleRestoreJob = async (row) => {
    if (!row.backendId) return;

    try {
      await updateCompanyJob(row.backendId, { status: "ACTIVE" });
      setJobRows((prev) =>
        prev.map((item) =>
          item.backendId === row.backendId
            ? { ...item, status: "Open", actions: "edit", raw: { ...item.raw, status: "ACTIVE" } }
            : item
        )
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Lowongan gagal dibuka kembali."));
    }
  };

  const stats = React.useMemo(
    () => ({
      total: jobRows.length,
      active: jobRows.filter((row) => row.status === "Open").length,
      closed: jobRows.filter((row) => row.status === "Closed").length,
      draft: jobRows.filter((row) => row.status === "Draft").length,
    }),
    [jobRows]
  );

  const filteredRows = jobRows.filter((row) => {
    const matchesTab = activeTab === "All" || row.status === activeTab;
    const keyword = searchQuery.trim().toLowerCase();

    if (!matchesTab) return false;
    if (!keyword) return true;

    return [row.title, row.id, row.dept, row.team]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });

  const { totalPages, pageItems: paginatedRows } = React.useMemo(
    () => paginateItems(filteredRows, currentPage, ITEMS_PER_PAGE),
    [filteredRows, currentPage]
  );

  const paginationMeta = React.useMemo(
    () => getPaginationMeta(filteredRows.length, currentPage, ITEMS_PER_PAGE),
    [filteredRows.length, currentPage]
  );

  const pageNumbers = React.useMemo(
    () => getPageNumbers(paginationMeta.currentPage, paginationMeta.totalPages),
    [paginationMeta.currentPage, paginationMeta.totalPages]
  );

  React.useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="job-postings">
      <Sidebar />

      <main className="job-postings__main">
        <Topbar placeholder="Global search for talents, partners, or meetings..." />

        <section className="job-postings__section">
          <div className="job-postings__breadcrumb">
            <span className="job-postings__breadcrumb-muted">ADMIN</span>
            <span className="job-postings__breadcrumb-muted">›</span>
            <span className="job-postings__breadcrumb-active">
              MANAJEMEN LOWONGAN
            </span>
          </div>

          <div className="job-postings__header">
            <h1 className="job-postings__title">Job Postings</h1>

            <button
              type="button"
              onClick={() => navigate("/admin/mitra/lowongan/tambah")}
              className="job-postings__create-btn"
            >
              <Plus size={20} />
              Create New Job
            </button>
          </div>

          <div className="job-postings__stats-grid">
            <StatBox
              title="Total Jobs"
              value={stats.total}
              subtitle={stats.total > 0 ? "Total lowongan dibuat" : "Belum ada lowongan"}
              icon={<BriefcaseBusiness size={20} />}
              iconBg="job-postings__icon-bg--blue"
              iconColor="job-postings__icon-color--blue"
            />
            <StatBox
              title="Active Openings"
              value={stats.active}
              subtitle={stats.active > 0 ? "Lowongan sedang dibuka" : "Belum ada lowongan aktif"}
              icon={<CircleCheck size={20} />}
              iconBg="job-postings__icon-bg--green"
              iconColor="job-postings__icon-color--green"
            />
            <StatBox
              title="Closed Jobs"
              value={stats.closed}
              subtitle={stats.closed > 0 ? "Lowongan sudah ditutup" : "Belum ada lowongan ditutup"}
              icon={<FileX2 size={20} />}
              iconBg="job-postings__icon-bg--red"
              iconColor="job-postings__icon-color--red"
            />
            <StatBox
              title="Drafts"
              value={stats.draft}
              subtitle={stats.draft > 0 ? "Lowongan masih draft" : "Belum ada draft"}
              icon={<FilePenLine size={20} />}
              iconBg="job-postings__icon-bg--yellow"
              iconColor="job-postings__icon-color--yellow"
            />
          </div>

          <div className="job-postings__table-card">
            <div className="job-postings__table-toolbar">
              <div className="job-postings__tabs">
                <button
                  type="button"
                  className={`job-postings__tab ${activeTab === "All" ? "job-postings__tab--active" : ""}`}
                  onClick={() => setActiveTab("All")}
                >
                  All Jobs
                </button>
                <button
                  type="button"
                  className={`job-postings__tab ${activeTab === "Open" ? "job-postings__tab--active" : ""}`}
                  onClick={() => setActiveTab("Open")}
                >
                  Open
                </button>
                <button
                  type="button"
                  className={`job-postings__tab ${activeTab === "Closed" ? "job-postings__tab--active" : ""}`}
                  onClick={() => setActiveTab("Closed")}
                >
                  Closed
                </button>
                <button
                  type="button"
                  className={`job-postings__tab ${activeTab === "Draft" ? "job-postings__tab--active" : ""}`}
                  onClick={() => setActiveTab("Draft")}
                >
                  Draft
                </button>
              </div>

              <div className="job-postings__toolbar-actions">
                <div className="job-postings__search-wrap">
                  <Search size={18} className="job-postings__search-icon" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="job-postings__search-input"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="job-postings__alert">{errorMessage}</div>
            )}

            <div className="job-postings__table-wrap">
              <table className="job-postings__table">
                <thead className="job-postings__table-head">
                  <tr className="job-postings__table-head-row">
                    <th className="job-postings__table-head-cell job-postings__table-head-cell--first">
                      Job Title & ID
                    </th>
                    <th className="job-postings__table-head-cell">Department</th>
                    <th className="job-postings__table-head-cell">Applicants</th>
                    <th className="job-postings__table-head-cell">Posted Date</th>
                    <th className="job-postings__table-head-cell">Status</th>
                    <th className="job-postings__table-head-cell">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr className="job-postings__table-row">
                      <td className="job-postings__table-cell job-postings__table-cell--first" colSpan={6}>
                        <div style={{ padding: "32px 16px", textAlign: "center", color: "#6b7280" }}>
                          Memuat lowongan...
                        </div>
                      </td>
                    </tr>
                  ) : paginatedRows.length > 0 ? (
                    paginatedRows.map((row, index) => (
                      <tr key={index} className="job-postings__table-row">
                      <td className="job-postings__table-cell job-postings__table-cell--first">
                        <div className="job-postings__job-main">
                          <div className={`job-postings__job-tag ${row.tagBg} ${row.tagText}`}>
                            {row.tag}
                          </div>
                          <div>
                            <div className="job-postings__job-title">{row.title}</div>
                            <div className="job-postings__job-id">{row.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="job-postings__table-cell">
                        <div className="job-postings__department">{row.dept}</div>
                        <div className="job-postings__team">{row.team}</div>
                      </td>

                      <td className="job-postings__table-cell">
                        {row.applicantCountBubble ? (
                          <div>
                            <div className="job-postings__applicant-count-bubble">8</div>
                            <button
                              type="button"
                              onClick={() => navigate("/admin/mitra/lowongan/applicants")}
                              className="job-postings__applicant-link"
                            >
                              View Applicants
                            </button>
                          </div>
                        ) : (
                          <ApplicantAvatars
                            type={row.applicantsType}
                            label={row.applicantsLabel}
                            onClick={() => navigate("/admin/mitra/lowongan/applicants")}
                          />
                        )}
                      </td>

                      <td className="job-postings__table-cell job-postings__date">
                        {row.date}
                      </td>

                      <td className="job-postings__table-cell">
                        <StatusBadge status={row.status} />
                      </td>

                      <td className="job-postings__table-cell">
                        {row.actions === "edit" ? (
                          <div className="job-postings__table-actions">
                            <button
                              type="button"
                              onClick={() => handleEditJob(row)}
                              className="job-postings__table-icon-btn"
                              aria-label={`Edit ${row.title}`}
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteJob(row)}
                              className="job-postings__table-icon-btn job-postings__table-icon-btn--delete"
                              aria-label={`Hapus ${row.title}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestoreJob(row)}
                            className="job-postings__table-icon-btn"
                            aria-label={`Restore ${row.title}`}
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="job-postings__table-row">
                      <td className="job-postings__table-cell job-postings__table-cell--first" colSpan={6}>
                        <div style={{ padding: "32px 16px", textAlign: "center", color: "#6b7280" }}>
                          Belum ada lowongan yang dibuat.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="job-postings__mobile-list">
              {isLoading ? (
                <div className="job-postings__mobile-card">
                  <div className="job-postings__job-title">Memuat lowongan...</div>
                </div>
              ) : paginatedRows.length > 0 ? (
                paginatedRows.map((row, index) => (
                  <MobileJobCard
                    key={index}
                    row={row}
                    onEdit={() => handleEditJob(row)}
                    onDelete={() => handleDeleteJob(row)}
                    onApplicants={() => navigate("/admin/mitra/lowongan/applicants")}
                    onRestore={() => handleRestoreJob(row)}
                  />
                ))
              ) : (
                <div className="job-postings__mobile-card">
                  <div className="job-postings__job-title">Belum ada lowongan</div>
                  <div className="job-postings__job-id">
                    Lowongan yang sudah dibuat akan muncul di sini.
                  </div>
                </div>
              )}
            </div>

            <div className="job-postings__pagination">
              <div className="job-postings__pagination-text">
                Showing {paginationMeta.start} to {paginationMeta.end} of {filteredRows.length} results
              </div>

              {filteredRows.length > 0 && (
              <div className="job-postings__pagination-controls">
                <button
                  type="button"
                  className="job-postings__page-btn job-postings__page-btn--left"
                  disabled={paginationMeta.currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft size={18} />
                </button>
                {pageNumbers.map((pageNumber, index) =>
                  pageNumber === "ellipsis" ? (
                    <button
                      key={`ellipsis-${index}`}
                      type="button"
                      className="job-postings__page-btn"
                      disabled
                    >
                      ...
                    </button>
                  ) : (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`job-postings__page-btn ${
                        pageNumber === paginationMeta.currentPage
                          ? "job-postings__page-btn--active"
                          : ""
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
                <button
                  type="button"
                  className="job-postings__page-btn job-postings__page-btn--right"
                  disabled={paginationMeta.currentPage === paginationMeta.totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))
                  }
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
