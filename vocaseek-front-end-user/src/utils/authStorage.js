export const AUTH_STORAGE_KEY = "vocaseek_auth";
const AUTH_FLAG_KEY = "isLoggedIn";

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage; // ← GANTI: sessionStorage → localStorage
}

function removeLegacyLocalAuth() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_FLAG_KEY);
}

export function saveAuthSession(payload, meta = {}) {
  const normalized = {
    token:
      payload?.token ||
      payload?.access_token ||
      payload?.data?.token ||
      payload?.data?.access_token ||
      "",
    user: payload?.user || payload?.data?.user || null,
    role: payload?.role || payload?.data?.role || "",
    identifier:
      payload?.identifier ||
      payload?.data?.identifier ||
      payload?.user?.email ||
      payload?.data?.user?.email ||
      meta.email ||
      "",
    raw: payload,
  };

  const storage = getBrowserStorage();
  if (!storage) {
    return normalized;
  }

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
  storage.setItem(AUTH_FLAG_KEY, "true");
  window.dispatchEvent(new Event("auth-changed"));

  return normalized;
}

export function getAuthSession() {
  try {
    const storage = getBrowserStorage();
    if (!storage) return null;

    const saved = storage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Gagal membaca sesi auth:", error);
    return null;
  }
}

export function getAccessToken() {
  return getAuthSession()?.token || "";
}

export function getUserRole() {
  return getAuthSession()?.role || "";
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function resolveUserHomeRoute(roleValue) {
  const role = typeof roleValue === "string" ? roleValue : getUserRole();
  const normalizedRole = String(role).toLowerCase();

  if (normalizedRole.includes("intern") || normalizedRole.includes("pelamar")) {
    return "/home";
  }

  return resolveAdminRoute(role);
}

export function clearAuthSession() {
  const storage = getBrowserStorage();
  if (storage) {
    storage.removeItem(AUTH_STORAGE_KEY);
    storage.removeItem(AUTH_FLAG_KEY);
  }

  window.dispatchEvent(new Event("auth-changed"));
}

export function resolveAdminRoute(user) {
  const role =
    typeof user === "string"
      ? user
      : user?.role ||
        user?.user_role ||
        user?.type ||
        user?.level ||
        user?.position ||
        "";

  const normalizedRole = String(role).toLowerCase();

  if (normalizedRole.includes("super")) {
    return "/admin/dashboard";
  }

  if (normalizedRole.includes("staff")) {
    return "/admin/staff/dashboard";
  }

  if (normalizedRole.includes("company") || normalizedRole.includes("mitra")) {
    return "/admin/mitra/dashboard";
  }

  return "/admin/mitra/dashboard";
}