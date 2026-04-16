import {
  getScopedItem,
  USER_STORAGE_KEYS,
} from "../../utils/userScopedStorage";

export const defaultProfile = {
  photo: "",
  fullName: "",
  email: "",
};

export function readProfileFromStorage() {
  try {
    const saved = getScopedItem(USER_STORAGE_KEYS.dataDiri);
    if (!saved) return defaultProfile;

    const parsed = JSON.parse(saved);

    return {
      photo: parsed?.photo || "",
      fullName: parsed?.fullName || "",
      email: parsed?.email || "",
    };
  } catch (error) {
    console.error("Gagal membaca data profil:", error);
    return defaultProfile;
  }
}

export function getShortEmail(email) {
  if (!email) return "";
  return email.length > 18 ? `${email.slice(0, 18)}...` : email;
}
