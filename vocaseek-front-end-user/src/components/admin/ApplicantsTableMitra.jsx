import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import "../../styles/admin/ApplicantsTableMitra.css";

export default function ApplicantsTable() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState("all");

  const data = [];

  const STATUS_OPTIONS = [
    { value: "all", label: "Semua Status" },
    { value: "PENDING", label: "Pending" },
    { value: "SHORTLISTED", label: "Shortlisted" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const filteredData = data.filter((item) => {
    return statusFilter === "all" ? true : item.status === statusFilter;
  });

  const statusClass = (status) => {
    if (status === "PENDING") return "status-badge pending";
    if (status === "SHORTLISTED") return "status-badge shortlisted";
    if (status === "REJECTED") return "status-badge rejected";
    return "status-badge default";
  };

  const handleRowClick = (item) => {
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="applicants-table">
      <div className="applicants-table__header">
        <div className="applicants-table__title-wrap">
          <h2 className="applicants-table__title">Recent Applicants</h2>
          <p className="applicants-table__subtitle">
            Candidates waiting for initial review
          </p>
        </div>

        <div className="applicants-table__actions">
          <div className="applicants-table__filter-wrap">
            <button
              type="button"
              className={`applicants-table__btn applicants-table__btn--outline ${filterOpen ? "is-active" : ""}`}
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <SlidersHorizontal size={16} />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`applicants-table__filter-chevron ${filterOpen ? "open" : ""}`}
              />
            </button>

            {filterOpen && (
              <div className="applicants-table__filter-dropdown">
                <div className="applicants-table__filter-group">
                  <label className="applicants-table__filter-label">
                    Status Kandidat
                  </label>
                  <select
                    className="applicants-table__filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="applicants-table__filter-actions">
                  <button
                    type="button"
                    className="applicants-table__filter-reset"
                    onClick={() => setStatusFilter("all")}
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    className="applicants-table__filter-apply"
                    onClick={() => setFilterOpen(false)}
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="applicants-table__btn applicants-table__btn--soft"
          >
            See All
          </button>
        </div>
      </div>

      <div className="applicants-table__desktop">
        <table className="applicants-table__table">
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Candidate</th>
              <th>Applied Position</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={item.link ? "is-clickable" : ""}
                >
                  <td className="muted">{item.id}</td>
                  <td className="semi-bold">{item.name}</td>
                  <td>{item.position}</td>
                  <td className="muted">{item.date}</td>
                  <td>
                    <span className={statusClass(item.status)}>{item.status}</span>
                  </td>
                  <td className="align-right">
                    <button type="button" className="applicants-table__icon-btn">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="muted" style={{ textAlign: "center", padding: "32px 16px" }}>
                  Belum ada pelamar terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="applicants-table__mobile">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              className={`applicant-card ${item.link ? "is-clickable" : ""}`}
              onClick={() => handleRowClick(item)}
            >
              <div className="applicant-card__top">
                <div>
                  <p className="applicant-card__id">{item.id}</p>
                  <h3 className="applicant-card__name">{item.name}</h3>
                </div>

                <button type="button" className="applicants-table__icon-btn">
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="applicant-card__body">
                <div className="applicant-card__row">
                  <span className="label">Position</span>
                  <span className="value">{item.position}</span>
                </div>

                <div className="applicant-card__row">
                  <span className="label">Applied Date</span>
                  <span className="value muted">{item.date}</span>
                </div>

                <div className="applicant-card__row">
                  <span className="label">Status</span>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="applicant-card">
            <h3 className="applicant-card__name">Belum ada pelamar</h3>
            <p className="value muted">Data pelamar terbaru akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
