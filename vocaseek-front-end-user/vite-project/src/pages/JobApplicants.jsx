import "../styles/JobApplicants.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function StatusBadge({ status }) {
  const statusClassMap = {
    SCREENING: "job-applicants__status-badge job-applicants__status-badge--screening",
    INTERVIEWING:
      "job-applicants__status-badge job-applicants__status-badge--interviewing",
    REJECTED: "job-applicants__status-badge job-applicants__status-badge--rejected",
    HIRED: "job-applicants__status-badge job-applicants__status-badge--hired",
  };

  return (
    <span
      className={
        statusClassMap[status] ||
        "job-applicants__status-badge job-applicants__status-badge--default"
      }
    >
      {status}
    </span>
  );
}

function ApplicantRow({
  initials,
  initialsBg,
  initialsText,
  name,
  id,
  department,
  subDepartment,
  appliedDate,
  status,
}) {
  return (
    <tr className="job-applicants__table-row">
      <td className="job-applicants__cell job-applicants__cell--name">
        <div className="job-applicants__applicant">
          <div
            className={`job-applicants__avatar ${initialsBg} ${initialsText}`}
          >
            {initials}
          </div>

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

      <td className="job-applicants__cell job-applicants__date">
        {appliedDate}
      </td>

      <td className="job-applicants__cell">
        <StatusBadge status={status} />
      </td>

      <td className="job-applicants__cell">
        <div className="job-applicants__actions">
          <button className="job-applicants__icon-btn">
            <Pencil size={18} />
          </button>
          <button className="job-applicants__icon-btn">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ApplicantCard({
  initials,
  initialsBg,
  initialsText,
  name,
  id,
  department,
  subDepartment,
  appliedDate,
  status,
}) {
  return (
    <div className="job-applicants__card-item">
      <div className="job-applicants__card-top">
        <div className="job-applicants__applicant">
          <div
            className={`job-applicants__avatar ${initialsBg} ${initialsText}`}
          >
            {initials}
          </div>

          <div>
            <div className="job-applicants__applicant-name">{name}</div>
            <div className="job-applicants__applicant-id">ID: {id}</div>
          </div>
        </div>

        <div className="job-applicants__actions">
          <button className="job-applicants__icon-btn">
            <Pencil size={18} />
          </button>
          <button className="job-applicants__icon-btn">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="job-applicants__card-grid">
        <div className="job-applicants__card-field">
          <div className="job-applicants__card-label">Department</div>
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

  const applicants = [
    {
      initials: "AR",
      initialsBg: "bg-[#DBEAFE]",
      initialsText: "text-[#2563EB]",
      name: "Alex Rivera",
      id: "#KDT-2023-001",
      department: "Design",
      subDepartment: "UI/UX Team",
      appliedDate: "Oct 12, 2023",
      status: "SCREENING",
    },
    {
      initials: "SC",
      initialsBg: "bg-[#F3E8FF]",
      initialsText: "text-[#9333EA]",
      name: "Sarah Chen",
      id: "#KDT-2023-005",
      department: "Design",
      subDepartment: "UX Research",
      appliedDate: "Oct 14, 2023",
      status: "INTERVIEWING",
    },
    {
      initials: "MS",
      initialsBg: "bg-[#FDE2E2]",
      initialsText: "text-[#DC2626]",
      name: "Michael Scott",
      id: "#KDT-2023-009",
      department: "Product",
      subDepartment: "Management",
      appliedDate: "Oct 15, 2023",
      status: "REJECTED",
    },
    {
      initials: "LW",
      initialsBg: "bg-[#DCFCE7]",
      initialsText: "text-[#16A34A]",
      name: "Lisa Wong",
      id: "#KDT-2023-012",
      department: "Design",
      subDepartment: "Visual Team",
      appliedDate: "Oct 18, 2023",
      status: "HIRED",
    },
  ];

  return (
    <div className="job-applicants">
      <Sidebar />

      <main className="job-applicants__main">
        <Topbar placeholder="Global search for talents, partners, or meetings..." />

        <section className="job-applicants__section">
          <div className="job-applicants__breadcrumb">
            <span className="job-applicants__breadcrumb-muted">ADMIN</span>
            <span className="job-applicants__breadcrumb-muted">›</span>
            <span className="job-applicants__breadcrumb-muted">
              MANAJEMEN LOWONGAN
            </span>
            <span className="job-applicants__breadcrumb-muted">›</span>
            <span className="job-applicants__breadcrumb-active">
              SENIOR UX DESIGNER APPLICANTS
            </span>
          </div>

          <div className="job-applicants__header">
            <button
              onClick={() => navigate("/lowongan")}
              className="job-applicants__back-btn"
            >
              <ArrowLeft size={20} />
            </button>

            <h1 className="job-applicants__title">
              Senior UX Designer Applicants
            </h1>
          </div>

          <div className="job-applicants__table-card">
            <div className="job-applicants__toolbar">
              <div className="job-applicants__toolbar-grid">
                <div className="job-applicants__search-wrap">
                  <Search
                    size={20}
                    className="job-applicants__search-icon"
                  />
                  <input
                    type="text"
                    placeholder="Search applicants by name, skill, or experience..."
                    className="job-applicants__search-input"
                  />
                </div>

                <div className="job-applicants__select-wrap">
                  <select className="job-applicants__select">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="job-applicants__select-icon"
                  />
                </div>
              </div>
            </div>

            <div className="job-applicants__desktop-table-wrap">
              <table className="job-applicants__table">
                <thead className="job-applicants__table-head">
                  <tr className="job-applicants__table-head-row">
                    <th className="job-applicants__head-cell job-applicants__head-cell--name">
                      Applicant Name & ID
                    </th>
                    <th className="job-applicants__head-cell">Department</th>
                    <th className="job-applicants__head-cell">Applied Date</th>
                    <th className="job-applicants__head-cell">Status</th>
                    <th className="job-applicants__head-cell">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applicants.map((applicant, index) => (
                    <ApplicantRow key={index} {...applicant} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="job-applicants__mobile-list">
              {applicants.map((applicant, index) => (
                <ApplicantCard key={index} {...applicant} />
              ))}
            </div>

            <div className="job-applicants__pagination">
              <div className="job-applicants__pagination-text">
                Showing 1 to 4 of 24 results
              </div>

              <div className="job-applicants__pagination-controls">
                <button className="job-applicants__page-btn job-applicants__page-btn--left">
                  ‹
                </button>
                <button className="job-applicants__page-btn job-applicants__page-btn--active">
                  1
                </button>
                <button className="job-applicants__page-btn">2</button>
                <button className="job-applicants__page-btn">3</button>
                <button className="job-applicants__page-btn job-applicants__page-btn--right">
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}