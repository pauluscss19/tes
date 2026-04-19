import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../../components/admin/SidebarStaff";
import Topbar from "../../../components/admin/TopbarStaff";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PRETEST_QUESTION_BANK } from "../../../utils/pretestAssessment";

function normalizeAnswer(raw) {
  if (raw === "iya") return "Iya";
  if (raw === "tidak") return "Tidak";
  return "Belum dijawab";
}

function getOtherOption(raw) {
  if (raw === "iya") return "Tidak";
  if (raw === "tidak") return "Iya";
  return "-";
}

export default function TalentAssessmentReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Email talent dikirim via navigate state dari TalentDetail
  const talentEmail = location.state?.email || "";
  const talentName  = location.state?.name  || "Talent";

  const reviewList = useMemo(() => {
    // Baca jawaban dari localStorage talent berdasarkan email
    let storedAnswers = {};
    if (talentEmail) {
      try {
        const key = `pretestAnswers::${talentEmail}`;
        const raw = localStorage.getItem(key);
        storedAnswers = raw ? JSON.parse(raw) : {};
      } catch {
        storedAnswers = {};
      }
    }

    return Object.keys(PRETEST_QUESTION_BANK)
      .map((key) => {
        const number     = Number(key);
        const question   = PRETEST_QUESTION_BANK[key];
        const rawAnswer  = storedAnswers[key] || "";
        return {
          no:        number,
          trait:     question.trait,
          pertanyaan: question.title,
          rawAnswer,
          pilihan:   normalizeAnswer(rawAnswer),
          opsiLain:  getOtherOption(rawAnswer),
        };
      })
      .sort((a, b) => a.no - b.no);
  }, [talentEmail]);

  const answeredCount = reviewList.filter(
    (item) => item.rawAnswer === "iya" || item.rawAnswer === "tidak"
  ).length;

  return (
    <div className="detail-talent-layout">
      <Sidebar />
      <main className="detail-talent-main">
        <Topbar />
        <section className="detail-talent-content">

          <div className="detail-breadcrumb">
            <span>ADMIN</span>
            <span>&rsaquo;</span>
            <span>TALENT MANAGEMENT</span>
            <span>&rsaquo;</span>
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate(-1)}
            >
              DETAIL PROFIL
            </span>
            <span>&rsaquo;</span>
            <span className="active">REVIEW JAWABAN</span>
          </div>

          <div className="detail-header">
            <div className="detail-header-left">
              <button
                onClick={() => navigate(-1)}
                className="detail-back-button"
                type="button"
              >
                <ArrowLeft size={28} />
              </button>
              <div>
                <h1 className="detail-page-title">Review Jawaban Assessment</h1>
                <p style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>
                  {talentName} &mdash; {answeredCount}/{reviewList.length} pertanyaan dijawab
                </p>
              </div>
            </div>
          </div>

          {!talentEmail && (
            <div style={{ padding: "1rem", color: "#d93025", marginBottom: 16 }}>
              Email talent tidak ditemukan. Data jawaban tidak bisa dimuat.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviewList.map((item) => (
              <div
                key={item.no}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  border: "1px solid #f0f0f0",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    minWidth: 28, height: 28, borderRadius: "50%",
                    background: "#1e3a5f", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {item.no}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 4 }}>
                      {item.pertanyaan}
                    </p>
                    <span style={{
                      fontSize: 11, fontWeight: 600, letterSpacing: 1,
                      color: "#6b7280", textTransform: "uppercase",
                      background: "#f3f4f6", borderRadius: 4, padding: "2px 8px",
                    }}>
                      {item.trait}
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{
                    background: item.rawAnswer ? "#eef7f0" : "#f9fafb",
                    border: `1px solid ${item.rawAnswer ? "#86efac" : "#e5e7eb"}`,
                    borderRadius: 8, padding: "0.75rem 1rem",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>
                      PILIHAN TERPILIH
                    </div>
                    <div style={{ fontWeight: 600, color: item.rawAnswer ? "#166534" : "#9ca3af" }}>
                      {item.pilihan}
                      {item.rawAnswer && <span style={{ marginLeft: 6, color: "#22c55e" }}>✓</span>}
                    </div>
                  </div>

                  <div style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8, padding: "0.75rem 1rem",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>
                      OPSI LAINNYA
                    </div>
                    <div style={{ color: "#9ca3af" }}>{item.opsiLain}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviewList.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <ShieldCheck size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <p>Belum ada data jawaban assessment untuk talent ini.</p>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}