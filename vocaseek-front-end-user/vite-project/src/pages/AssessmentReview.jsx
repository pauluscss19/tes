import "../styles/AssessmentReview.css";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  ArrowLeft,
  ClipboardCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuestionCard({ number, question, selected = "Iya", other = "Tidak" }) {
  return (
    <div className="assessment-review__question-card">
      <div className="assessment-review__question-row">
        <div className="assessment-review__question-number">{number}</div>

        <div className="assessment-review__question-content">
          <h3 className="assessment-review__question-title">{question}</h3>

          <div className="assessment-review__answer-grid">
            <div className="assessment-review__answer-box assessment-review__answer-box--selected">
              <div className="assessment-review__answer-label">
                Pilihan Terpilih
              </div>

              <div className="assessment-review__answer-value">
                {selected}
              </div>

              <div className="assessment-review__answer-check">
                <Check
                  size={16}
                  className="assessment-review__answer-check-icon"
                  strokeWidth={3}
                />
              </div>
            </div>

            <div className="assessment-review__answer-box assessment-review__answer-box--other">
              <div className="assessment-review__answer-label assessment-review__answer-label--muted">
                Opsi Lainnya
              </div>

              <div className="assessment-review__answer-value assessment-review__answer-value--muted">
                {other}
              </div>
            </div>
          </div>

          <div className="assessment-review__question-divider" />
        </div>
      </div>
    </div>
  );
}

export default function AssessmentReview() {
  const navigate = useNavigate();
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const allQuestions = [
    {
      number: 1,
      question:
        "Ketika melihat pekerjaan yang belum selesai, saya bersedia membantu meskipun itu bukan tanggung jawab utama saya.",
      selected: "Iya",
      other: "Tidak",
    },
    {
      number: 2,
      question:
        "Jika saya tidak memahami instruksi kerja, saya akan bertanya untuk memastikan pekerjaan dilakukan dengan benar.",
      selected: "Iya",
      other: "Tidak",
    },
    {
      number: 3,
      question:
        "Saya merasa nyaman menyampaikan ide atau pendapat kepada anggota tim.",
      selected: "Iya",
      other: "Tidak",
    },
    {
      number: 4,
      question:
        "Jika terjadi perbedaan pendapat dalam tim, saya mencoba berdiskusi untuk mencari solusi terbaik.",
      selected: "Iya",
      other: "Tidak",
    },
    {
      number: 5,
      question:
        "Saya selalu berusaha menyelesaikan tugas tepat waktu sesuai dengan deadline yang diberikan.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 6,
      question:
        "Ketika menghadapi masalah dalam pekerjaan, saya mencoba mencari solusi terlebih dahulu sebelum meminta bantuan.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 7,
      question:
        "Saya terbuka menerima kritik atau saran untuk memperbaiki hasil kerja saya.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 8,
      question:
        "Saya dapat menyesuaikan diri dengan cepat terhadap lingkungan kerja atau tugas baru.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 9,
      question:
        "Saya biasanya memeriksa kembali pekerjaan sebelum mengumpulkannya.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 10,
      question:
        "Jika tim tidak memiliki pemimpin dalam suatu tugas, saya bersedia membantu mengkoordinasikan pekerjaan.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 11,
      question:
        "Jika saya sudah menyelesaikan pekerjaan lebih cepat dari anggota tim lain, saya biasanya menawarkan bantuan kepada mereka.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 12,
      question:
        "Ketika menerima kritik terhadap pekerjaan saya, saya mencoba memahami maksudnya sebelum memberikan penjelasan.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 13,
      question:
        "Jika ada tugas yang sulit, saya tetap berusaha menyelesaikannya sebelum memutuskan untuk menyerah.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 14,
      question:
        "Saya tetap berusaha bekerja dengan baik meskipun tugas yang diberikan tidak terlalu saya sukai.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 15,
      question:
        "Jika saya melakukan kesalahan dalam pekerjaan, saya akan mengakuinya dan berusaha memperbaikinya.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 16,
      question:
        "Dalam bekerja, saya berusaha memahami tujuan pekerjaan agar hasilnya sesuai dengan yang diharapkan.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 17,
      question:
        "Saya merasa penting untuk menjaga komunikasi yang baik dengan anggota tim selama bekerja.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 18,
      question:
        "Jika terdapat cara yang lebih efektif untuk menyelesaikan pekerjaan, saya bersedia mencoba cara tersebut.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 19,
      question:
        "Saya tetap berusaha menyelesaikan pekerjaan dengan baik meskipun berada dalam tekanan waktu.",
      selected: "Ya",
      other: "Tidak",
    },
    {
      number: 20,
      question:
        "Saya merasa bertanggung jawab terhadap hasil pekerjaan yang saya kerjakan, baik secara individu maupun dalam tim.",
      selected: "Ya",
      other: "Tidak",
    },
  ];

  const visibleQuestions = showAllQuestions
    ? allQuestions
    : allQuestions.slice(0, 4);

  return (
    <div className="assessment-review">
      <Sidebar />

      <main className="assessment-review__main">
        <Topbar />

        <section className="assessment-review__section">
          <div className="assessment-review__breadcrumb">
            <span className="assessment-review__breadcrumb-muted">ADMIN</span>
            <span className="assessment-review__breadcrumb-muted">›</span>
            <span className="assessment-review__breadcrumb-muted">
              TALENT MANAGEMENT
            </span>
            <span className="assessment-review__breadcrumb-muted">›</span>
            <span className="assessment-review__breadcrumb-muted">
              DETAIL PROFIL
            </span>
            <span className="assessment-review__breadcrumb-muted">›</span>
            <span className="assessment-review__breadcrumb-active">
              ASSESSMENT REVIEW
            </span>
          </div>

          <div className="assessment-review__header">
            <button
              onClick={() => navigate("/talent/kdt-001")}
              className="assessment-review__back-btn"
            >
              <ArrowLeft size={24} />
            </button>

            <h1 className="assessment-review__title">
              Assessment Character Profile
            </h1>
          </div>

          <div className="assessment-review__grid">
            <div className="assessment-review__summary-card">
              <div className="assessment-review__profile-wrap">
                <div className="assessment-review__avatar-wrap">
                  <div className="assessment-review__avatar">
                    <img
                      src="/Sarah_Jenkins.png"
                      alt="Sarah Jenkins"
                      className="assessment-review__avatar-image"
                    />
                  </div>

                  <div className="assessment-review__avatar-status" />
                </div>

                <div className="assessment-review__profile-text">
                  <div className="assessment-review__profile-name">
                    Sarah Jenkins
                  </div>
                  <div className="assessment-review__profile-role">
                    Mechanical Engineer Candidate
                  </div>
                </div>
              </div>

              <div className="assessment-review__summary-section">
                <div className="assessment-review__summary-label">
                  Summary Karakter
                </div>

                <div className="assessment-review__summary-box">
                  <p className="assessment-review__summary-text">
                    "Sarah menunjukkan kemampuan analitis yang sangat kuat,
                    terutama dalam pemecahan masalah teknis. Ia cenderung
                    mengambil keputusan berdasarkan data dan fakta. Meskipun sisi
                    kreatifnya lebih rendah, pendekatannya yang sistematis sangat
                    cocok untuk peran teknis yang membutuhkan presisi tinggi."
                  </p>
                </div>
              </div>
            </div>

            <div className="assessment-review__content-card">
              <div className="assessment-review__content-header">
                <div className="assessment-review__content-icon-box">
                  <ClipboardCheck
                    size={24}
                    className="assessment-review__content-icon"
                  />
                </div>

                <div>
                  <h2 className="assessment-review__content-title">
                    Review Jawaban
                  </h2>
                  <p className="assessment-review__content-subtitle">
                    Detail tanggapan untuk setiap pertanyaan assessment
                  </p>
                </div>
              </div>

              <div className="assessment-review__question-list">
                {visibleQuestions.map((item) => (
                  <QuestionCard
                    key={item.number}
                    number={item.number}
                    question={item.question}
                    selected={item.selected}
                    other={item.other}
                  />
                ))}
              </div>

              {!showAllQuestions && (
                <div className="assessment-review__load-more-wrap">
                  <button
                    onClick={() => setShowAllQuestions(true)}
                    className="assessment-review__load-more-btn"
                  >
                    Load 16 More Questions
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}