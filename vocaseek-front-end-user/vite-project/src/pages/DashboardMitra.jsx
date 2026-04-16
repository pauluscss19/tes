import "../styles/DashboardMitra.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ApplicantsTable from "../components/ApplicantsTable";

export default function DashboardMitra() {
  return (
    <div className="dashboard-mitra">
      <Sidebar />

      <div className="dashboard-mitra__main">
        <Topbar />

        <div className="dashboard-mitra__content">
          <p className="dashboard-mitra__breadcrumb">
            <span>ADMIN &gt; </span>
            <span className="dashboard-mitra__breadcrumb-active">
              OVERVIEW DASHBOARD
            </span>
          </p>

          <h1 className="dashboard-mitra__title">Company Overview</h1>

          <div className="dashboard-mitra__stats">
            <StatCard
              title="TOTAL APPLICANTS"
              value="1,248"
              subtitle="+12.5% vs last month"
            />
            <StatCard
              title="ACTIVE JOB POSTS"
              value="8"
              subtitle="+2 New this week"
            />
            <StatCard
              title="SHORTLISTED"
              value="42"
              subtitle="Reviewing 15 candidates"
            />
          </div>

          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
}