import api from "../lib/api";

const LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || "/login";
const REGISTER_ENDPOINT =
  import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || "/register";
const LOGOUT_ENDPOINT = import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || "/logout";
const FORGOT_PASSWORD_ENDPOINT =
  import.meta.env.VITE_AUTH_FORGOT_PASSWORD_ENDPOINT || "/forgot-password";
const VALIDATE_RESET_TOKEN_ENDPOINT =
  import.meta.env.VITE_AUTH_VALIDATE_RESET_TOKEN_ENDPOINT ||
  "/forgot-password/validate-token";
const RESET_PASSWORD_ENDPOINT =
  import.meta.env.VITE_AUTH_RESET_PASSWORD_ENDPOINT || "/reset-password";
const GOOGLE_AUTH_ENDPOINT =
  import.meta.env.VITE_AUTH_GOOGLE_ENDPOINT || "/auth/google";
const GOOGLE_TOKEN_ENDPOINT =
  import.meta.env.VITE_AUTH_GOOGLE_TOKEN_ENDPOINT || "/auth/google/token";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function joinApiUrl(baseUrl, endpoint) {
  const normalizedBase = String(baseUrl || "").replace(/\/+$/, "");
  const normalizedEndpoint = String(endpoint || "").replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedEndpoint}`;
}

export function loginApplicant(payload) {
  return api.post(LOGIN_ENDPOINT, payload);
}

export function loginCompany(payload) {
  return api.post(LOGIN_ENDPOINT, payload);
}

export function registerApplicant(payload) {
  return api.post(REGISTER_ENDPOINT, payload);
}

export function registerCompany(payload) {
  return api.post(REGISTER_ENDPOINT, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function logoutUser() {
  return api.post(LOGOUT_ENDPOINT);
}

export function requestPasswordReset(payload) {
  return api.post(FORGOT_PASSWORD_ENDPOINT, payload);
}

export function validatePasswordResetToken(payload) {
  return api.post(VALIDATE_RESET_TOKEN_ENDPOINT, payload);
}

export function resetPassword(payload) {
  return api.post(RESET_PASSWORD_ENDPOINT, payload);
}

export function getGoogleAuthUrl() {
  return joinApiUrl(api.defaults.baseURL, GOOGLE_AUTH_ENDPOINT);
}

export function loginWithGoogleAccessToken(payload) {
  return api.post(GOOGLE_TOKEN_ENDPOINT, payload);
}

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve(window.google);
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Gagal memuat Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () =>
      reject(new Error("Gagal memuat Google Identity Services."));
    document.head.appendChild(script);
  });
}

export async function requestGoogleAccessToken() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("VITE_GOOGLE_CLIENT_ID belum diatur.");
  }

  const google = await loadGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (response) => {
        if (response?.access_token) {
          resolve(response.access_token);
          return;
        }

        reject(new Error("Google tidak mengembalikan access token."));
      },
      error_callback: () => {
        reject(new Error("Proses autentikasi Google dibatalkan atau gagal."));
      },
    });

    tokenClient.requestAccessToken({
      prompt: "",
    });
  });
}

export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (responseData?.errors) {
    const firstError = Object.values(responseData.errors)[0];
    if (Array.isArray(firstError) && firstError[0]) {
      return firstError[0];
    }
  }

  return (
    responseData?.message ||
    error?.message ||
    fallbackMessage ||
    "Terjadi kesalahan saat menghubungi server."
  );
}
