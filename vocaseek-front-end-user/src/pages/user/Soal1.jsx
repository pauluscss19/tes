import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Soal1.css";
import {
  PRETEST_DURATION_MS,
  PRETEST_QUESTION_BANK,
  PRETEST_STORAGE_KEYS,
} from "../../utils/pretestAssessment";
import { getScopedItem, setScopedItem } from "../../utils/userScopedStorage";
import { submitInternTest, startInternTest } from "../../services/intern";

function getPretestStartedAt() {
  const savedStartedAt = Number(getScopedItem(PRETEST_STORAGE_KEYS.startedAt));

  if (Number.isFinite(savedStartedAt) && savedStartedAt > 0) {
    return savedStartedAt;
  }

  const now = Date.now();
  setScopedItem(PRETEST_STORAGE_KEYS.startedAt, String(now));
  return now;
}

function getRemainingTime(startedAt) {
  return Math.max(0, PRETEST_DURATION_MS - (Date.now() - startedAt));
}

function formatRemainingTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Soal1() {
  const navigate = useNavigate();
  const total = 20;
  const [startedAt] = useState(() => getPretestStartedAt());
  const [remainingMs, setRemainingMs] = useState(() =>
    getRemainingTime(getPretestStartedAt()),
  );
  const [activeNo, setActiveNo] = useState(1);
  const [answers, setAnswers] = useState(() => {
    const saved = PRETEST_STORAGE_KEYS.readAnswers();
    return saved ? JSON.parse(saved) : {};
  });

  // Pakai ref agar timer bisa baca jawaban terkini tanpa re-render
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const questions = useMemo(() => PRETEST_QUESTION_BANK, []);

  // ── Kirim jawaban ke backend ─────────────────────────────────────────────
  const submitToBackend = useCallback(
    async (currentAnswers) => {
      try {
        // Format sesuai yang diharapkan InternController::submitPreTest:
        // answers: [ { question: "...", selected_option: "iya/tidak" }, ... ]
        const formatted = Object.entries(questions).map(([no, q]) => ({
          question: q.title,
          selected_option: currentAnswers[no] || "tidak dijawab",
        }));

        await submitInternTest({ answers: formatted });
      } catch (error) {
        // Jangan interrupt user flow jika API gagal
        console.error("Gagal mengirim jawaban ke backend:", error);
      }
    },
    [questions],
  );

  // ── Selesaikan tes ───────────────────────────────────────────────────────
  const isFinishingRef = useRef(false); // cegah double-submit
  const finishTest = useCallback(
    async (currentAnswers) => {
      if (isFinishingRef.current) return;
      isFinishingRef.current = true;

      // 1. Simpan ke localStorage (backup offline)
      setScopedItem(PRETEST_STORAGE_KEYS.completed, "true");
      setScopedItem(PRETEST_STORAGE_KEYS.answers, JSON.stringify(currentAnswers));
      setScopedItem(PRETEST_STORAGE_KEYS.questions, JSON.stringify(questions));

      // 2. ✅ Kirim ke backend — INI YANG SEBELUMNYA HILANG
      await submitToBackend(currentAnswers);

      // 3. Arahkan ke halaman selesai
      navigate("/selesai-test");
    },
    [questions, navigate, submitToBackend],
  );

  const timeText = formatRemainingTime(remainingMs);

  // Simpan jawaban ke localStorage setiap berubah
  useEffect(() => {
    setScopedItem(PRETEST_STORAGE_KEYS.answers, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    setScopedItem(PRETEST_STORAGE_KEYS.questions, JSON.stringify(questions));
  }, [questions]);

  // ── Beritahu backend bahwa tes dimulai ───────────────────────────────────
  useEffect(() => {
    startInternTest().catch((err) =>
      console.warn("startInternTest gagal (mungkin sudah dimulai sebelumnya):", err),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const nextRemainingMs = getRemainingTime(startedAt);
      setRemainingMs(nextRemainingMs);

      if (nextRemainingMs <= 0) {
        // Baca jawaban terkini dari ref agar tidak stale
        finishTest(answersRef.current);
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt]);

  const currentQuestion = questions[activeNo];

  const handlePickNumber = (n) => setActiveNo(n);

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [activeNo]: value }));
  };

  const handlePrev = () => setActiveNo((prev) => Math.max(1, prev - 1));

  const handleNext = () => {
    if (activeNo < total) {
      setActiveNo((prev) => prev + 1);
    } else {
      finishTest(answers);
    }
  };

  const isLast = activeNo === total;
  const currentAnswer = answers[activeNo] || "";

  return (
    <div className="assessPage">
      <header className="assessHeader">
        <div className="assessHeaderInner">
          <div className="assessLogo">
            <img
              src="/logovocaseek.png"
              alt="Vocaseek"
              className="assessLogoImg"
            />
          </div>

          <div className="assessHeaderRight">
            <div className="assessTimer" role="status" aria-label="Timer">
              <span className="assessTimerDot" aria-hidden="true" />
              <span className="assessTimerText">{timeText}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="assessBody">
        <aside className="assessAside" aria-label="Navigasi Soal">
          <div className="assessAsideInner">
            <div className="assessAsideLabel">KATEGORI SOAL</div>
            <div className="assessAsideTitle">Cognitive &amp; Problem Solving</div>

            <div className="assessAsideDivider" />

            <div className="assessNumGrid">
              {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
                const isActiveBtn = n === activeNo;
                const isAnswered = !!answers[n];

                return (
                  <button
                    key={n}
                    type="button"
                    className={`assessNumBtn ${isActiveBtn ? "isActive" : ""} ${
                      isAnswered ? "isAnswered" : ""
                    }`}
                    onClick={() => handlePickNumber(n)}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <div className="assessAsideFooter">
              © 2026 Vocaseek Education. Seluruh hak cipta dilindungi.
            </div>
          </div>
        </aside>

        <main className="assessMain">
          <div className="assessMainInner">
            <div className="assessQuestionWrap">
              <h1 className="assessQuestion">{currentQuestion.title}</h1>
            </div>

            <div className="assessAnswerGrid">
              <button
                type="button"
                className={`answerCard ${currentAnswer === "iya" ? "selected" : ""}`}
                onClick={() => handleAnswer("iya")}
              >
                <div className="answerIcon yesIcon" aria-hidden="true">
                  ✓
                </div>
                <div className="answerTitle">Iya</div>
                <div className="answerDesc">Saya setuju pernyataan</div>
              </button>

              <button
                type="button"
                className={`answerCard ${currentAnswer === "tidak" ? "selected" : ""}`}
                onClick={() => handleAnswer("tidak")}
              >
                <div className="answerIcon noIcon" aria-hidden="true">
                  ✕
                </div>
                <div className="answerTitle">Tidak</div>
                <div className="answerDesc">Tidak sesuai dengan pernyataan</div>
              </button>
            </div>

            <div className="assessBottomBar">
              <button
                className="backLink"
                type="button"
                onClick={handlePrev}
                disabled={activeNo === 1}
              >
                ‹ Sebelumnya
              </button>

              <button
                className="assessNextBtn"
                type="button"
                onClick={handleNext}
              >
                {isLast ? "Selesai" : "Selanjutnya"} <span>›</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
