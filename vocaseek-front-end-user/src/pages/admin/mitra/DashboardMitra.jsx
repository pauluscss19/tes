import { useState, useEffect } from "react";
import "../../../styles/admin/DashboardMitra.css";
import Sidebar from "../../../components/admin/SidebarMitra";
import Topbar from "../../../components/admin/TopbarMitra";
import StatCard from "../../../components/admin/StatCardMitra";
import ApplicantsTable from "../../../components/admin/ApplicantsTableMitra";
import { getCompanyDashboard } from "../../../services/companyTalent";

export default function DashboardMitra() {
  const [stats, setStats] = useState({
    total_applicants: 0,
    active_jobs: 0,
    shortlisted: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCompanyDashboard()
      .then((res) => {
        const d = res?.data;
        setStats({
          total_applicants: d?.stats?.total_applicants ?? 0,
          active_jobs:      d?.stats?.active_jobs      ?? 0,
          shortlisted:      d?.stats?.shortlisted       ?? 0,
        });
        setRecentApplicants(d?.recent_applicants ?? []);
      })
      .catch((err) => console.error("Dashboard error:", err))
      .finally(() => setIsLoading(false));
  }, []);

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
              value={isLoading ? "..." : stats.total_applicants}
              subtitle="Total pelamar masuk"
            />
            <StatCard
              title="ACTIVE JOB POSTS"
              value={isLoading ? "..." : stats.active_jobs}
              subtitle="Lowongan aktif saat ini"
            />
            <StatCard
              title="SHORTLISTED"
              value={isLoading ? "..." : stats.shortlisted}
              subtitle="Kandidat direview"
            />
          </div>

          <ApplicantsTable applicants={recentApplicants} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}