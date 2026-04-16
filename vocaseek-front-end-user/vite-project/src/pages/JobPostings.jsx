import "../styles/JobPostings.css";
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Plus,
  BriefcaseBusiness,
  CircleCheck,
  FileX2,
  FilePenLine,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Headphones,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

      <button onClick={onClick} className="job-postings__applicant-link">
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
          <div
            className={`job-postings__job-tag ${row.tagBg} ${row.tagText}`}
          >
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
              <button onClick={onApplicants} className="job-postings__applicant-link">
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

const INITIAL_ROWS = [
  {
    tag: "UX",
    tagBg: "job-postings__tag-bg--ux",
    tagText: "job-postings__tag-text--ux",
    title: "Senior UI/UX Designer",
    id: "ID: #JOB-2023-001",
    dept: "Design",
    team: "Product Team",
    applicantsType: "many",
    applicantsLabel: "View All 15",
    date: "Oct 24, 2023",
    status: "Open",
    actions: "edit",
  },
  {
    tag: "FE",
    tagBg: "job-postings__tag-bg--fe",
    tagText: "job-postings__tag-text--fe",
    title: "Frontend Developer",
    id: "ID: #JOB-2023-005",
    dept: "Engineering",
    team: "Web Team",
    applicantsType: "few",
    applicantsLabel: "View All 2",
    date: "Oct 20, 2023",
    status: "Open",
    actions: "edit",
  },
  {
    tag: "PM",
    tagBg: "job-postings__tag-bg--pm",
    tagText: "job-postings__tag-text--pm",
    title: "Product Manager",
    id: "ID: #JOB-2023-008",
    dept: "Product",
    team: "Core Product",
    applicantsType: "none",
    applicantsLabel: "No applicants yet",
    date: "-",
    status: "Draft",
    actions: "edit",
  },
  {
    tag: "QA",
    tagBg: "job-postings__tag-bg--qa",
    tagText: "job-postings__tag-text--qa",
    title: "QA Engineer",
    id: "ID: #JOB-2023-002",
    dept: "Engineering",
    team: "QA Team",
    applicantsType: "none",
    applicantsLabel: "View Applicants",
    date: "Sep 15, 2023",
    status: "Closed",
    actions: "restore",
    applicantCountBubble: true,
  },
];

export default function JobPostings() {
  const navigate = useNavigate();
  const [jobRows, setJobRows] = React.useState(INITIAL_ROWS);

  const handleEditJob = (row) => {
    navigate("/lowongan/pratinjau", { state: { job: row } });
  };

  const handleDeleteJob = (jobId) => {
    setJobRows((prev) => prev.filter((row) => row.id !== jobId));
  };

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
              onClick={() => navigate("/lowongan/tambah")}
              className="job-postings__create-btn"
            >
              <Plus size={20} />
              Create New Job
            </button>
          </div>

          <div className="job-postings__stats-grid">
            <StatBox
              title="Total Jobs"
              value="24"
              subtitle="+4 new this month"
              subtitleColor="job-postings__subtitle--green"
              icon={<BriefcaseBusiness size={20} />}
              iconBg="job-postings__icon-bg--blue"
              iconColor="job-postings__icon-color--blue"
            />
            <StatBox
              title="Active Openings"
              value="12"
              subtitle="48 active applicants"
              icon={<CircleCheck size={20} />}
              iconBg="job-postings__icon-bg--green"
              iconColor="job-postings__icon-color--green"
            />
            <StatBox
              title="Closed Jobs"
              value="8"
              subtitle="Archived recently"
              icon={<FileX2 size={20} />}
              iconBg="job-postings__icon-bg--red"
              iconColor="job-postings__icon-color--red"
            />
            <StatBox
              title="Drafts"
              value="4"
              subtitle="Pending review"
              icon={<FilePenLine size={20} />}
              iconBg="job-postings__icon-bg--yellow"
              iconColor="job-postings__icon-color--yellow"
            />
          </div>

          <div className="job-postings__table-card">
            <div className="job-postings__table-toolbar">
              <div className="job-postings__tabs">
                <button className="job-postings__tab job-postings__tab--active">
                  All Jobs
                </button>
                <button className="job-postings__tab">Open</button>
                <button className="job-postings__tab">Closed</button>
                <button className="job-postings__tab">Draft</button>
              </div>

              <div className="job-postings__toolbar-actions">
                <button className="job-postings__filter-btn">
                  <SlidersHorizontal size={18} className="job-postings__filter-icon" />
                  Newest First
                  <ChevronDown size={18} className="job-postings__filter-icon" />
                </button>

                <div className="job-postings__search-wrap">
                  <Search size={18} className="job-postings__search-icon" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="job-postings__search-input"
                  />
                </div>
              </div>
            </div>

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
                  {jobRows.map((row, index) => (
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
                              onClick={() => navigate("/lowongan/applicants")}
                              className="job-postings__applicant-link"
                            >
                              View Applicants
                            </button>
                          </div>
                        ) : (
                          <ApplicantAvatars
                            type={row.applicantsType}
                            label={row.applicantsLabel}
                            onClick={() => navigate("/lowongan/applicants")}
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
                              onClick={() => handleDeleteJob(row.id)}
                              className="job-postings__table-icon-btn job-postings__table-icon-btn--delete"
                              aria-label={`Hapus ${row.title}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="job-postings__table-icon-btn"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="job-postings__mobile-list">
              {jobRows.map((row, index) => (
                <MobileJobCard
                  key={index}
                  row={row}
                  onEdit={() => handleEditJob(row)}
                  onDelete={() => handleDeleteJob(row.id)}
                  onApplicants={() => navigate("/lowongan/applicants")}
                  onRestore={() => {}}
                />
              ))}
            </div>

            <div className="job-postings__pagination">
              <div className="job-postings__pagination-text">
                Showing 1 to {jobRows.length} of 24 results
              </div>

              <div className="job-postings__pagination-controls">
                <button className="job-postings__page-btn job-postings__page-btn--left">
                  <ChevronLeft size={18} />
                </button>
                <button className="job-postings__page-btn job-postings__page-btn--active">
                  1
                </button>
                <button className="job-postings__page-btn">2</button>
                <button className="job-postings__page-btn">3</button>
                <button className="job-postings__page-btn job-postings__page-btn--right">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="job-postings__footer">
            <div>© 2026 VOCASEEK ACADEMY • UNIFIED ADMIN ECOSYSTEM</div>

            <div className="job-postings__footer-links">
              <div className="job-postings__footer-link-item">
                <Shield size={16} />
                <span>PRIVACY</span>
              </div>
              <div className="job-postings__footer-link-item">
                <Headphones size={16} />
                <span>HELP DESK</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}