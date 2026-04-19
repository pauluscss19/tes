import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PRETEST_QUESTION_BANK } from "../../../utils/pretestAssessment";
import "../../../styles/TalentDetail.css";

// ── helpers ──────────────────────────────────────────────────────────────────
const TRAIT_LABELS = {
  adaptabilitas: "Adaptabilitas",
  disiplin:      "Disiplin Kerja",
  inisiatif:     "Inisiatif",
  integritas:    "Integritas",
  ketelitian:    "Ketelitian",
  kolaborasi:    "Kolaborasi",
  komunikasi:    "Komunikasi",
  kepemimpinan:  "Kepemimpinan",
  resiliensi:    "Daya Tahan Kerja",
};

function normalizeAnswer(raw) {
  if (raw === "iya")   return "Iya";
  if (raw === "tidak") return "Tidak";
  return "Belum dijawab";
}

function badgeStyle(raw) {
  if (raw === "iya")   return { background: "#dcfce7", color: "#15803d" };
  if (raw === "tidak") return { background: "#fee2e2", color: "#b91c1c" };
  return { background: "#f3f4f6", color: "#6b7280" };
}

function getTraitBreakdown(list) {
  const map = list.reduce((acc, item) => {
    if (!item.trait) return acc;
    if (!acc[item.trait]) {
      acc[item.trait] = { key: item.trait, label: TRAIT_LABELS[item.trait] || item.trait, total: 0, yes: 0 };
    }
    acc[item.trait].total += 1;
    if (item.rawAnswer === "iya") acc[item.trait].yes += 1;
    return acc;
  }, {});

  return Object.values(map)
    .map((t) => ({ ...t, score: t.total ? t.yes / t.total : 0 }))
    .sort((a, b) => b.score - a.score);
}

// ── component ─────────────────────────────────────────────────────────────────
export default function AssessmentReviewStaff() {
  const navigate     = useNavigate();
  const { id }       = useParams();
  const location     = useLocation();
  const talentEmail  = location.state?.email || "";
  const talentName   = location.state?.name  || "Talent";

  // Baca jawaban dari localStorage dengan key pretestAnswers::<email>
  const reviewList = useMemo(() => {
    let storedAnswers = {};
    if (talentEmail) {
      try {
        const raw = localStorage.getItem(`pretestAnswers::${talentEmail}`);
        storedAnswers = raw ? JSON.parse(raw) : {};
      } catch {
        storedAnswers = {};
      }
    }

    return Object.keys(PRETEST_QUESTION_BANK)
      .map((key) => {
        const num       = Number(key);
        const question  = PRETEST_QUESTION_BANK[key];
        const rawAnswer = storedAnswers[key] || "";
        return {
          no:         num,
          trait:      question.trait,
          pertanyaan: question.title,
          rawAnswer,
          pilihan:    normalizeAnswer(rawAnswer),
        };
      })
      .sort((a, b) => a.no - b.no);
  }, [talentEmail]);

  const answeredCount = reviewList.filter(
    (item) => item.rawAnswer === "iya" || item.rawAnswer === "tidak"
  ).length;

  const traitBreakdown = getTraitBreakdown(reviewList);

  return (
    <div className="detail-talent-layout">
      <Sidebar />
      <main className="detail-talent-main">
        <Topbar />
        <section className="detail-talent-content">

          {/* Breadcrumb */}
          <div className="detail-breadcrumb">
            <span>ADMIN</span>
            <span>&rsaquo;</span>
            <span>TALENT MANAGEMENT</span>
            <span>&rsaquo;</span>
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate(`/admin/staff/talent/${id}`, {
                state: { email: talentEmail, name: talentName }
              })}
            >
              DETAIL PROFIL
            </span>
            <span>&rsaquo;</span>
            <span className="active">REVIEW JAWABAN</span>
          </div>

          {/* Header */}
          <div className="detail-header">
            <div className="detail-header-left">
              <button
                type="button"
                className="detail-back-button"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={28} />
              </button>
              <div>
                <h1 className="detail-page-title">Review Jawaban Assessment</h1>
                <p style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>
                  {talentName} &mdash;{" "}
                  <strong style={{ color: "#1e3a5f" }}>{answeredCount}</strong>
                  /{reviewList.length} pertanyaan dijawab
                </p>
              </div>
            </div>
          </div>

          {/* Warning jika email tidak ditemukan */}
          {!talentEmail && (
            <div style={{
              padding: "0.75rem 1rem", marginBottom: 16,
              background: "#fee2e2", borderRadius: 8, color: "#b91c1c", fontSize: 14,
            }}>
              Email talent tidak ditemukan. Data jawaban tidak dapat dimuat.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

            {/* ── Daftar Soal ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviewList.map((item) => (
                <div
                  key={item.no}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "1rem 1.25rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    border: "1px solid #f0f0f0",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  {/* Nomor */}
                  <div style={{
                    minWidth: 28, height: 28, borderRadius: "50%",
                    background: "#1e3a5f", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {item.no}
                  </div>

                  {/* Konten */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, fontSize: 14 }}>
                      {item.pertanyaan}
                    </p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {/* Badge trait */}
                      <span style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: 1,
                        color: "#6b7280", textTransform: "uppercase",
                        background: "#f3f4f6", borderRadius: 4, padding: "2px 8px",
                      }}>
                        {TRAIT_LABELS[item.trait] || item.trait}
                      </span>
                      {/* Badge jawaban */}
                      <span style={{
                        fontSize: 12, fontWeight: 700, borderRadius: 6,
                        padding: "3px 10px", ...badgeStyle(item.rawAnswer),
                      }}>
                        {item.pilihan}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Sidebar Trait Summary ── */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1.25rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              border: "1px solid #f0f0f0",
              position: "sticky",
              top: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <ShieldCheck size={18} color="#1e3a5f" />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>
                  Ringkasan Trait
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {traitBreakdown.map((trait) => (
                  <div key={trait.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                        {trait.label}
                      </span>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>
                        {trait.yes}/{trait.total}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      height: 6, borderRadius: 99,
                      background: "#f3f4f6", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.round(trait.score * 100)}%`,
                        borderRadius: 99,
                        background: trait.score >= 0.75
                          ? "#15803d"
                          : trait.score >= 0.5
                          ? "#d97706"
                          : "#dc2626",
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Legenda */}
              <div style={{ marginTop: 16, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Keterangan:</p>
                {[
                  { color: "#15803d", label: "≥ 75% — Kuat" },
                  { color: "#d97706", label: "50–74% — Sedang" },
                  { color: "#dc2626", label: "< 50% — Perlu Perhatian" },
                ].map((leg) => (
                  <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 99, background: leg.color }} />
                    <span style={{ fontSize: 11, color: "#6b7280" }}>{leg.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}