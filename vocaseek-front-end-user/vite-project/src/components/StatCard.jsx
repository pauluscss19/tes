import "../styles/StatCard.css";

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <p className="stat-card__title">{title}</p>
      <h2 className="stat-card__value">{value}</h2>
      <p className="stat-card__subtitle">{subtitle}</p>
    </div>
  );
}

/* ===== STATUS HELPERS (optional, bisa dipakai di komponen lain) ===== */

export const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFERED", label: "Offered" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

export const STATUS_BADGE_MAP = {
  PENDING: "status-badge pending",
  SHORTLISTED: "status-badge shortlisted",
  REJECTED: "status-badge rejected",
  INTERVIEWING: "status-badge interviewing",
  OFFERED: "status-badge offered",
  HIRED: "status-badge hired",
};

export function getStatusLabel(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status;
}

export function getStatusClass(status) {
  return STATUS_BADGE_MAP[status] || "status-badge default";
}