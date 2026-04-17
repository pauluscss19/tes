import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import StatCard from "../../../components/admin/StatCard";
import ActivityTable from "../../../components/admin/ActivityTable";
import "../../../styles/Dashboard.css";
import {
  GraduationCap,
  Building2,
  Briefcase,
  CalendarDays,
} from "lucide-react";
import { getApiErrorMessage } from "../../../services/auth";
import { getAdminOverview } from "../../../services/admin";

const POLL_INTERVAL = 30_000; // 30 detik

function pickStatValue(stat) {
  if (stat?.value !== undefined && stat?.value !== null) {
    return String(stat.value);
  }
  return "0";
}

function pickStatNote(stat, fallbackNote) {
  return stat?.growth || stat?.label || fallbackNote;
}

function getInitials(name) {
  return String(name || "NA")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapActivity(item) {
  const name = item?.name || item?.nama || item?.identity || "Aktivitas";

  return {
    initials: item?.initials || getInitials(name),
    name,
    role:
      item?.role ||
      item?.role_category ||
      item?.category ||
      item?.tipe ||
      "-",
    organization:
      item?.organization || item?.perusahaan || item?.company || "-",
    status: item?.status || item?.status_mitra || "REVIEWING",
  };
}

export default function DashboardStaff() {
  const [overview, setOverview] = useState({});
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ── fetch data (silent = tidak reset loading/error) ──────────────────────
  const loadOverview = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setErrorMessage("");
    }

    try {
      const response = await getAdminOverview();
      const payload = response?.data?.data || response?.data || {};
      const statsPayload =
        payload?.dashboard_data ||
        payload?.stats ||
        payload?.overview ||
        payload;
      const activityPayload =
        payload?.activities ||
        payload?.recent_activity ||
        payload?.recentActivities ||
        [];

      setOverview(statsPayload);
      setActivities(
        Array.isArray(activityPayload)
          ? activityPayload.map(mapActivity)
          : []
      );
    } catch (error) {
      if (!silent) {
        setOverview({});
        setActivities([]);
        setErrorMessage(
          getApiErrorMessage(error, "Gagal memuat overview dashboard.")
        );
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // ── load pertama kali ─────────────────────────────────────────────────────
  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // ── polling setiap 30 detik ───────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => loadOverview(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [loadOverview]);

  // ── refresh saat tab aktif kembali ────────────────────────────────────────
  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === "visible") loadOverview(true);
    };
    document.addEventListener("visibilitychange", handleVisible);
    return () => document.removeEventListener("visibilitychange", handleVisible);
  }, [loadOverview]);

  // ── listen event dari halaman lain (AddAdmin, EditAdmin, dll) ─────────────
  useEffect(() => {
    const handleUpdate = () => loadOverview(true);
    window.addEventListener("adminUpdated", handleUpdate);
    window.addEventListener("partnerUpdated", handleUpdate);
    window.addEventListener("talentUpdated", handleUpdate);
    return () => {
      window.removeEventListener("adminUpdated", handleUpdate);
      window.removeEventListener("partnerUpdated", handleUpdate);
      window.removeEventListener("talentUpdated", handleUpdate);
    };
  }, [loadOverview]);

  const stats = [
    {
      title: "TOTAL TALENTS",
      value: pickStatValue(overview?.total_talents),
      note: pickStatNote(overview?.total_talents, "Data talenta dari backend"),
      type: "positive",
      icon: <GraduationCap size={20} />,
    },
    {
      title: "PARTNERS",
      value: pickStatValue(overview?.partners),
      note: pickStatNote(overview?.partners, "Data mitra dari backend"),
      type: "positive",
      icon: <Building2 size={20} />,
    },
    {
      title: "OPENINGS",
      value: pickStatValue(overview?.openings),
      note: pickStatNote(overview?.openings, "Data lowongan dari backend"),
      type: "warning",
      icon: <Briefcase size={20} />,
    },
    {
      title: "MEETINGS",
      value: pickStatValue(overview?.meetings),
      note: pickStatNote(overview?.meetings, "Data meeting dari backend"),
      type: "warning",
      icon: <CalendarDays size={20} />,
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <section className="content-area">
          <div className="breadcrumb">
            <span>ADMIN</span>
            <span>&rsaquo;</span>
            <span className="active">MASTER DASHBOARD</span>
          </div>

          <h1 className="page-title">Overview Dashboard</h1>

          {errorMessage && (
            <div className="dashboard-alert error">{errorMessage}</div>
          )}

          <div className="stats-grid">
            {isLoading
              ? stats.map((_, i) => (
                  <div key={i} className="stat-card-skeleton" />
                ))
              : stats.map((item, index) => (
                  <StatCard key={index} {...item} />
                ))}
          </div>

          <ActivityTable activities={activities} isLoading={isLoading} />
        </section>
      </main>
    </div>
  );
}