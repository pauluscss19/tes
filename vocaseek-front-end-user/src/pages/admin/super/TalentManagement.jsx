import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserRoundCheck,
  UserPlus,
  Eye,
  Trash2,
} from "lucide-react";
import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import "../../../styles/TalentManagement.css";
import {
  getPageNumbers,
  getPaginationMeta,
  paginateItems,
} from "../../../utils/pagination";
import { getApiErrorMessage } from "../../../services/auth";
import { deleteAdminTalent, getAdminTalents } from "../../../services/admin";

const ITEMS_PER_PAGE = 5;

function extractTalentCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.talents)) return payload.talents;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getTalentStatus(item) {
  const status = String(
    item?.status ||
      item?.application_status ||
      item?.review_status ||
      "REVIEWING",
  ).toUpperCase();

  if (["ACCEPTED", "SHORTLISTED", "ACTIVE"].includes(status)) return "ACCEPTED";
  if (["REJECTED", "DECLINED", "INACTIVE"].includes(status)) return "DECLINED";
  return "REVIEWING";
}

function getStatusClass(status) {
  if (status === "ACCEPTED") return "accepted";
  if (status === "DECLINED") return "declined";
  return "reviewing";
}

function getStatusLabel(status) {
  if (status === "ACCEPTED") return "Accepted";
  if (status === "DECLINED") return "Declined";
  return "Reviewing";
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

function mapTalentRow(item, index) {
  const name = item?.nama || item?.name || item?.user?.nama || "Talent";
  const university = item?.universitas || item?.university || item?.kampus || "-";
  const major = item?.jurusan || item?.major || item?.program_studi || "-";
  const email = item?.email || item?.user?.email || "Email belum tersedia";
  const registeredAt = item?.created_at || item?.registered_at || item?.tanggal_daftar || "-";
  const status = getTalentStatus(item);

  return {
    id: String(item?.user_id || item?.id || `talent-${index}`),
    name,
    email,
    university,
    universityShort: getInitials(university),
    major,
    majorClass: ["blue", "purple", "orange"][index % 3],
    date: registeredAt,
    status,
  };
}

function StatCard({ title, value, change, changeType, icon, iconClass }) {
  return (
    <div className="tm-stat-card">
      <div className="tm-stat-top">
        <div>
          <div className="tm-stat-title">{title}</div>
          <div className="tm-stat-value">{value}</div>
          <div className={`tm-stat-change ${changeType}`}>{change}</div>
        </div>
        <div className={iconClass}>{icon}</div>
      </div>
    </div>
  );
}

export default function TalentManagement() {
  const navigate = useNavigate();
  const [talents, setTalents] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  const loadTalents = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAdminTalents();
      const payload = response?.data?.data || response?.data || {};
      const collection = extractTalentCollection(payload);
      setTalents(collection.map(mapTalentRow));
    } catch (error) {
      setTalents([]);
      setErrorMessage(getApiErrorMessage(error, "Gagal memuat data talenta."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTalents();
  }, [loadTalents]);

  const handleDelete = async (id) => {
    try {
      await deleteAdminTalent(id);
      setTalents((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Gagal menghapus data talenta."));
    }
  };

  const stats = React.useMemo(() => {
    const total = talents.length;
    const active = talents.filter((item) => item.status === "ACCEPTED").length;
    const reviewing = talents.filter((item) => item.status === "REVIEWING").length;

    return [
      {
        title: "Total Talenta",
        value: String(total),
        change: total > 0 ? `${total} data tersedia` : "Belum ada data talenta",
        changeType: total > 0 ? "positive" : "neutral",
        icon: <Users size={22} />,
        iconClass: "tm-stat-icon blue",
      },
      {
        title: "Talenta Aktif",
        value: String(active),
        change: active > 0 ? `${active} talenta aktif` : "Belum ada talenta aktif",
        changeType: active > 0 ? "positive" : "neutral",
        icon: <UserRoundCheck size={22} />,
        iconClass: "tm-stat-icon purple",
      },
      {
        title: "Talenta Baru (Bulan Ini)",
        value: String(reviewing),
        change: reviewing > 0 ? `${reviewing} menunggu review` : "Belum ada review baru",
        changeType: reviewing > 0 ? "warning" : "neutral",
        icon: <UserPlus size={22} />,
        iconClass: "tm-stat-icon orange",
      },
    ];
  }, [talents]);

  const { totalPages, pageItems: paginatedTalents } = React.useMemo(
    () => paginateItems(talents, currentPage, ITEMS_PER_PAGE),
    [talents, currentPage],
  );

  const paginationMeta = React.useMemo(
    () => getPaginationMeta(talents.length, currentPage, ITEMS_PER_PAGE),
    [talents.length, currentPage],
  );

  const pageNumbers = React.useMemo(
    () => getPageNumbers(paginationMeta.currentPage, paginationMeta.totalPages),
    [paginationMeta.currentPage, paginationMeta.totalPages],
  );

  React.useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  return (
    <div className="tm-layout">
      <Sidebar />

      <main className="tm-main">
        <Topbar />

        <section className="tm-content">
          <div className="tm-breadcrumb">
            <span>ADMIN</span>
            <span>&rsaquo;</span>
            <span className="active">TALENT MANAGEMENT</span>
          </div>

          <h1 className="tm-page-title">Talent Pool Management</h1>

          {errorMessage && (
            <div style={{ marginBottom: 16, color: "#d93025", fontWeight: 500 }}>
              {errorMessage}
            </div>
          )}

          <div className="tm-stats-grid">
            {stats.map((item) => (
              <StatCard key={item.title} {...item} />
            ))}
          </div>

          <div className="tm-table-card">
            <div className="tm-table-wrap">
              <table className="tm-table">
                <thead>
                  <tr>
                    <th>NAMA TALENTA</th>
                    <th>UNIVERSITAS</th>
                    <th>JURUSAN</th>
                    <th>TANGGAL DAFTAR</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {!isLoading && paginatedTalents.length > 0 ? (
                    paginatedTalents.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="tm-talent-cell">
                            <div
                              className="tm-table-avatar"
                              style={{
                                display: "grid",
                                placeItems: "center",
                                background: "#dbe7ff",
                                color: "#3267e3",
                                fontWeight: 700,
                              }}
                            >
                              {getInitials(item.name)}
                            </div>
                            <div>
                              <div className="tm-table-name">{item.name}</div>
                              <div className="tm-table-email">{item.email}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="tm-university-cell">
                            <span className="tm-uni-badge">{item.universityShort}</span>
                            <span className="tm-university-name">{item.university}</span>
                          </div>
                        </td>

                        <td>
                          <span className={`tm-major-badge ${item.majorClass}`}>
                            {item.major}
                          </span>
                        </td>

                        <td className="tm-date-cell">{item.date}</td>

                        <td>
                          <span className={`tm-status-badge ${getStatusClass(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>

                        <td>
                          <div className="tm-action-group">
                            <button
                              type="button"
                              className="tm-icon-btn"
                              onClick={() => navigate(`/admin/talent/${item.id}`)}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="tm-icon-btn"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ padding: "32px 16px", textAlign: "center", color: "#6b7280" }}
                      >
                        {isLoading ? "Memuat data talenta..." : "Belum ada data talenta."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tm-footer-row">
            <div className="tm-footer-text">
              SHOWING {paginationMeta.start}-{paginationMeta.end} OF {talents.length} TALENTS
            </div>

            {talents.length > 0 && (
              <div className="tm-pagination tm-pagination--dynamic">
                <button
                  className="tm-page-btn"
                  type="button"
                  disabled={paginationMeta.currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  &lsaquo;
                </button>
                {pageNumbers.map((pageNumber, index) =>
                  pageNumber === "ellipsis" ? (
                    <button key={`ellipsis-${index}`} className="tm-page-dots" type="button" disabled>
                      …
                    </button>
                  ) : (
                    <button
                      key={pageNumber}
                      className={`tm-page-btn ${pageNumber === paginationMeta.currentPage ? "active" : ""}`}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}
                <button
                  className="tm-page-btn"
                  type="button"
                  disabled={paginationMeta.currentPage === paginationMeta.totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))
                  }
                >
                  &rsaquo;
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
