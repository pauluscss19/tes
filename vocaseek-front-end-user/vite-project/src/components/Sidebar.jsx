import "../styles/Sidebar.css";
import {
  LayoutGrid,
  BriefcaseBusiness,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isDashboard = location.pathname === "/";
  const isLowongan = location.pathname.startsWith("/lowongan");
  const isTalent =
    location.pathname.startsWith("/talent") ||
    location.pathname.startsWith("/tambah-kandidat");
  const isCompanyProfile = location.pathname.startsWith("/company-profile");

  const isAllCandidates = location.pathname === "/talent/semua-kandidat";
  const isShortlisted = location.pathname === "/talent/kandidat-terpilih";

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      path: "/",
      active: isDashboard,
    },
    {
      label: "Manajemen Lowongan",
      icon: BriefcaseBusiness,
      path: "/lowongan",
      active: isLowongan,
    },
    {
      label: "Manajemen Talent",
      icon: Users,
      path: "/talent/semua-kandidat",
      active: isTalent,
    },
    {
      label: "Profil Perusahaan",
      icon: Building2,
      path: "/company-profile",
      active: isCompanyProfile,
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <div>
          <div className="sidebar-brand">
            <div className="sidebar-logo-box">
              <img
                src="/Logo_Vocaseek.png"
                alt="Logo Vocaseek"
                className="sidebar-logo"
              />
            </div>

            <h1 className="sidebar-title">VOCASEEK</h1>
            <p className="sidebar-subtitle">COMPANY PORTAL</p>
          </div>

          <div className="sidebar-menu-heading">Menu Utama</div>

          <div className="sidebar-menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="sidebar-menu-group">
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`sidebar-menu-item ${item.active ? "active" : ""}`}
                  >
                    <Icon size={18} strokeWidth={2.1} />
                    <span className="sidebar-menu-text">{item.label}</span>
                  </button>

                  {item.label === "Manajemen Talent" && item.active && (
                    <div className="sidebar-submenu">
                      <button
                        type="button"
                        onClick={() => handleNavigate("/talent/semua-kandidat")}
                        className={`sidebar-submenu-item ${
                          isAllCandidates ? "active" : ""
                        }`}
                      >
                        Semua Kandidat
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigate("/talent/kandidat-terpilih")}
                        className={`sidebar-submenu-item ${
                          isShortlisted ? "active highlight" : ""
                        }`}
                      >
                        Kandidat Terpilih
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="sidebar-avatar-box">
              <img
                src="/Sarah_Jenkins.png"
                alt="Sarah Jenkins"
                className="sidebar-avatar"
              />
            </div>

            <div className="sidebar-user-info">
              <p className="sidebar-user-name">Sarah Jenkins</p>
              <p className="sidebar-user-role">HR Manager</p>
            </div>

            <button type="button" className="sidebar-logout-btn">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}