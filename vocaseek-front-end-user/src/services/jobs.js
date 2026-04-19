import api from "../lib/api";
import apiCompany from "../lib/apiCompany";

const COMPANY_JOBS_ENDPOINT = "/company/jobs";
const PUBLIC_JOBS_ENDPOINT = "/popular-vacancies";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSalary(value) {
  if (!value) return "Insentif tidak disebutkan";
  const formattedValue = String(value)
    .split("-")
    .map((item) => {
      const numberOnly = item.replace(/[^\d]/g, "");
      if (!numberOnly) return item.trim();
      return Number(numberOnly).toLocaleString("id-ID");
    })
    .join(" - ");
  return formattedValue;
}

function formatSalaryRange(min, max) {
  if (!min && !max) return "Insentif tidak disebutkan";
  if (min && max)
    return `Rp ${Number(min).toLocaleString("id-ID")} - Rp ${Number(max).toLocaleString("id-ID")}`;
  if (min) return `Rp ${Number(min).toLocaleString("id-ID")}`;
  return `Rp ${Number(max).toLocaleString("id-ID")}`;
}

function formatRelativeTime(value) {
  if (!value) return "Baru saja";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Baru saja";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

function normalizeWorkSetting(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "remote") return "Remote";
  if (normalized === "hybrid") return "Hybrid";
  if (normalized === "onsite") return "WFO";
  return value || "WFO";
}

function normalizeStatus(value) {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "CLOSED") return "Closed";
  if (normalized === "DRAFT") return "Draft";
  return "Open";
}

function getJobTag(title) {
  const words = String(title || "Job")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "JB";
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function splitLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// ─── API Calls ────────────────────────────────────────────────────────────────

// Public — tanpa auth, selalu ke backend-company (8003)
export function getPublicJobs() {
  return apiCompany.get(PUBLIC_JOBS_ENDPOINT);
}

// Company (butuh auth) — semua ke backend-company (8003)
export function getCompanyJobs() {
  return apiCompany.get(COMPANY_JOBS_ENDPOINT);
}

export function createCompanyJob(payload) {
  return apiCompany.post(COMPANY_JOBS_ENDPOINT, payload);
}

export function updateCompanyJob(id, payload) {
  return apiCompany.put(`${COMPANY_JOBS_ENDPOINT}/${id}`, payload);
}

export function deleteCompanyJob(id) {
  return apiCompany.delete(`${COMPANY_JOBS_ENDPOINT}/${id}`);
}

export function getCompanyJobApplicants(jobId) {
  return apiCompany.get(`/company/jobs/${jobId}/applicants`);
}

export function updateCompanyApplicationStatus(id, payload) {
  return apiCompany.put(`/company/applications/${id}/status`, payload);
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

export function mapCompanyJobRow(job) {
  // Support field baru (judul_pekerjaan) dan lama (judul_posisi)
  const title =
    job?.judul_pekerjaan || job?.judul_posisi || job?.title || "Lowongan";
  const status = normalizeStatus(job?.status);

  return {
    raw: job,
    backendId: job?.id,
    id: `JOB-${String(job?.id || "000").padStart(3, "0")}`,
    tag: getJobTag(title),
    tagBg: "job-postings__tag-bg--fe",
    tagText: "job-postings__tag-text--fe",
    title,
    dept: job?.kategori_pekerjaan || job?.kategori || "Umum",
    team: normalizeWorkSetting(job?.pengaturan_kerja || job?.tipe_magang),
    date: formatDate(job?.created_at),
    status,
    applicantsType: "none",
    applicantsLabel: "Belum ada pelamar",
    applicantCountBubble: false,
    actions: status === "Closed" ? "restore" : "edit",
  };
}

export function mapPublicJob(job) {
  // Support field baru dan lama
  const title =
    job?.judul_pekerjaan || job?.judul_posisi || job?.title || "Lowongan";
  const companyProfile = job?.company_profile || job?.companyProfile || {};
  const companyName =
    companyProfile?.nama_perusahaan ||
    companyProfile?.name ||
    job?.nama_perusahaan ||
    "Perusahaan";
  const companyAddress =
    companyProfile?.alamat_kantor_pusat ||
    companyProfile?.alamat_kantor ||
    job?.lokasi ||
    "Lokasi belum diisi";

  // Gaji: pakai gaji_min/gaji_max (field baru) atau gaji_per_bulan (field lama)
  const salaryDisplay =
    job?.gaji_min || job?.gaji_max
      ? formatSalaryRange(job.gaji_min, job.gaji_max)
      : formatSalary(job?.gaji_per_bulan);

  return {
    id: job?.id,
    title,
    company: companyName,
    location: job?.lokasi || companyAddress,
    type: job?.tipe_pekerjaan || job?.tipe_magang || "Magang",
    duration: salaryDisplay,
    work: normalizeWorkSetting(job?.pengaturan_kerja || job?.tipe_magang),
    postedAt: formatRelativeTime(job?.created_at),
    description:
      job?.deskripsi_pekerjaan ||
      "Deskripsi lowongan akan ditampilkan setelah perusahaan melengkapinya.",
    qualifications: splitLines(job?.persyaratan),
    benefits:
      job?.gaji_min || job?.gaji_max
        ? [`Insentif: ${formatSalaryRange(job.gaji_min, job.gaji_max)}`]
        : job?.gaji_per_bulan
        ? [`Insentif: ${formatSalary(job.gaji_per_bulan)}`]
        : [],
    education: null,
    documents: null,
    dates: {
      deadline: formatDate(job?.tgl_tutup_lamaran),
      start: formatDate(job?.tgl_mulai_kerja),
    },
    companyProfile: {
      name: companyName,
      industry:
        companyProfile?.industri ||
        companyProfile?.sektor_industri ||
        "Industri belum diisi",
      size:
        companyProfile?.ukuran_perusahaan || "Ukuran perusahaan belum diisi",
      website: companyProfile?.website_url || companyProfile?.website || "",
      description:
        companyProfile?.deskripsi ||
        "Profil perusahaan belum dilengkapi oleh perusahaan.",
      address: companyAddress,
      phone: companyProfile?.notelp || "",
      status: companyProfile?.status_mitra || "",
      logoUrl:
        companyProfile?.logo_perusahaan || companyProfile?.logo_url || "",
    },
    raw: job,
  };
}