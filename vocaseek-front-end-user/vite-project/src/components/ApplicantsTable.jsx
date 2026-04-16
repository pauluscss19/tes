import { useNavigate } from "react-router-dom";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import "../styles/ApplicantsTable.css";

export default function ApplicantsTable() {
  const navigate = useNavigate();

  const data = [
    {
      id: "KDT-001",
      name: "Bagus Setiawan",
      position: "Senior UI/UX Designer",
      date: "Oct 24, 2026",
      status: "PENDING",
      link: "/talent/kdt-001",
    },
    {
      id: "KDT-002",
      name: "Rizky Pratama",
      position: "Frontend Engineer",
      date: "Oct 23, 2026",
      status: "SHORTLISTED",
    },
    {
      id: "KDT-003",
      name: "Adi Wijaya",
      position: "DevOps Specialist",
      date: "Oct 22, 2026",
      status: "REJECTED",
    },
  ];

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
          <button className="applicants-table__btn applicants-table__btn--outline">
            <SlidersHorizontal size={16} />
            <span>Filter</span>
          </button>

          <button className="applicants-table__btn applicants-table__btn--soft">
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
            {data.map((item) => (
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
                  <button className="applicants-table__icon-btn">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="applicants-table__mobile">
        {data.map((item) => (
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

              <button className="applicants-table__icon-btn">
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
        ))}
      </div>
    </div>
  );
}