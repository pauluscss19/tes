import "../../../styles/admin/DashboardMitra.css";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import StatCard from "../../../components/admin/StatCardMitra";
import ApplicantsTable from "../../../components/admin/ApplicantsTableMitra";

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
              value="0"
              subtitle="Belum ada pelamar"
            />
            <StatCard
              title="ACTIVE JOB POSTS"
              value="0"
              subtitle="Belum ada lowongan aktif"
            />
            <StatCard
              title="SHORTLISTED"
              value="0"
              subtitle="Belum ada kandidat direview"
            />
          </div>

          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
}
