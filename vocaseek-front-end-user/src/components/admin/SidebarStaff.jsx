import "../../styles/Sidebar.css";
import {
  LayoutGrid,
  Users,
  Handshake,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth";
import { clearAuthSession } from "../../utils/authStorage";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    profileImage: "",
  });

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      path: "/admin/staff/dashboard",
      active: location.pathname.startsWith("/admin/staff/dashboard"),
    },
    {
      label: "Talent Management",
      icon: Users,
      path: "/admin/staff/talent-management",
      active: location.pathname.startsWith("/admin/staff/talent-management"),
    },
    {
      label: "Partners",
      icon: Handshake,
      path: "/admin/staff/partners",
      active: location.pathname.startsWith("/admin/staff/partners"),
    },
    {
      label: "Profil",
      icon: User,
      path: "/admin/staff/profil",
      active: location.pathname.startsWith("/admin/staff/profil"),
    },
  ];

  const loadProfileFromStorage = () => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("adminProfile")) || {};
      setProfileData({
        fullName: savedProfile.fullName || "",
        profileImage: savedProfile.profileImage || "",
      });
    } catch (error) {
      console.error("Gagal membaca profile dari localStorage:", error);
      setProfileData({
        fullName: "",
        profileImage: "",
      });
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout backend gagal, sesi lokal tetap dibersihkan:", error);
    } finally {
      clearAuthSession();
      localStorage.removeItem("adminProfile");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    setIsOpen(false);
    loadProfileFromStorage();
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

  useEffect(() => {
    const handleProfileUpdate = () => {
      loadProfileFromStorage();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
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
            <p className="sidebar-subtitle">STAFF ADMIN</p>
          </div>

          <div className="sidebar-menu-heading">Core Menu</div>

          <div className="sidebar-menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`sidebar-menu-item ${item.active ? "active" : ""}`}
                >
                  <Icon size={18} strokeWidth={2.1} />
                  <span className="sidebar-menu-text">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="sidebar-avatar-box">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt={profileData.fullName || "Admin"}
                  className="sidebar-avatar"
                />
              ) : (
                <div className="sidebar-avatar-placeholder">
                  <User size={18} />
                </div>
              )}
            </div>

            <div className="sidebar-user-info">
              <p className="sidebar-user-name">
                {profileData.fullName || "Admin Vokaseek"}
              </p>
              <p className="sidebar-user-role">STAFF ADMIN</p>
            </div>

            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}