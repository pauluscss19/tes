export function pickFirstValue(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
}

export function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

export function normalizeTalentStatus(value) {
  const status = String(value || "REVIEWING").toUpperCase();
  if (["ACCEPTED", "SHORTLISTED", "ACTIVE", "HIRED"].includes(status)) {
    return "ACCEPTED";
  }
  if (["REJECTED", "DECLINED", "INACTIVE"].includes(status)) {
    return "DECLINED";
  }
  return "REVIEWING";
}

export function formatTalentDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatBirthPlaceAndDate(place, dateValue) {
  const formattedDate = formatTalentDate(dateValue);
  if (place && formattedDate !== "-") return `${place}, ${formattedDate}`;
  return place || formattedDate || "-";
}

export function buildTalentAddress(source = {}) {
  const parts = [
    pickFirstValue(
      source.detail_alamat,
      source.addressDetail,
      source.alamat,
      source.address,
      source.address_domisili,
      source.domisili,
    ),
    pickFirstValue(source.kabupaten, source.city, source.kota, source.regency),
    pickFirstValue(source.provinsi, source.province, source.state),
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

export function buildTalentDocument(fileUrl, fallbackLabel) {
  if (!fileUrl) {
    return {
      available: false,
      title: fallbackLabel,
      subtitle: "Belum ada file",
      url: "",
    };
  }
  const fileName = String(fileUrl).split("/").pop() || fallbackLabel;
  return {
    available: true,
    title: fallbackLabel,
    subtitle: fileName,
    url: fileUrl,
  };
}

export function mapTalentDetailPayload(rawItem = {}) {
  // ─── Normalise nested struktur dari berbagai format response backend ──────
  const user =
    rawItem?.user ||
    rawItem?.intern ||
    rawItem?.candidate ||
    rawItem?.data?.user ||
    {};

  const profile =
    user?.intern_profile ||
    user?.internProfile ||
    rawItem?.intern_profile ||
    rawItem?.internProfile ||
    rawItem?.profile ||
    rawItem?.data?.profile ||
    rawItem?.data?.intern_profile ||
    rawItem?.data?.internProfile ||
    {};

  // ─── Data Pribadi ─────────────────────────────────────────────────────────
  const name = pickFirstValue(
    rawItem?.nama,
    rawItem?.name,
    user?.nama,
    user?.name,
    profile?.nama,
    "Talent",
  );
  const email = pickFirstValue(
    rawItem?.email,
    user?.email,
    profile?.email,
    "-",
  );
  const phone = pickFirstValue(
    rawItem?.notelp,
    rawItem?.phone,
    rawItem?.phone_number,
    rawItem?.no_hp,
    rawItem?.nomor_hp,
    user?.notelp,
    user?.phone,
    profile?.notelp,
    profile?.phone,
    profile?.phone_number,
    "-",
  );
  const about = pickFirstValue(
    rawItem?.tentang_saya,
    rawItem?.biodata,
    rawItem?.bio,
    rawItem?.about_me,
    rawItem?.about,
    profile?.tentang_saya,
    profile?.biodata,
    profile?.bio,
    profile?.about_me,
    profile?.about,
  );
  const photo = pickFirstValue(
    rawItem?.foto,
    rawItem?.photo,
    rawItem?.photo_url,
    rawItem?.avatar,
    rawItem?.avatar_url,
    rawItem?.profile_photo,
    profile?.foto,
    profile?.photo,
    profile?.photo_url,
    profile?.avatar,
    profile?.avatar_url,
    profile?.profile_photo,
    user?.foto,
    user?.photo,
    user?.avatar,
  );
  const gender = pickFirstValue(
    rawItem?.jenis_kelamin,
    rawItem?.gender,
    rawItem?.jenisKelamin,
    profile?.jenis_kelamin,
    profile?.gender,
    "-",
  );
  const birthPlace = pickFirstValue(
    rawItem?.tempat_lahir,
    rawItem?.place_of_birth,
    rawItem?.birth_place,
    profile?.tempat_lahir,
    profile?.place_of_birth,
    profile?.birth_place,
    "-",
  );
  const birthDate = pickFirstValue(
    rawItem?.tanggal_lahir,
    rawItem?.date_of_birth,
    rawItem?.birth_date,
    profile?.tanggal_lahir,
    profile?.date_of_birth,
    profile?.birth_date,
  );
  const address = buildTalentAddress({
    detail_alamat: pickFirstValue(
      rawItem?.detail_alamat,
      rawItem?.alamat,
      rawItem?.alamat_domisili,
      rawItem?.address,
      rawItem?.address_detail,
      profile?.detail_alamat,
      profile?.alamat,
      profile?.alamat_domisili,
      profile?.address,
      profile?.address_detail,
    ),
    kabupaten: pickFirstValue(
      rawItem?.kabupaten,
      rawItem?.kota,
      rawItem?.city,
      profile?.kabupaten,
      profile?.kota,
      profile?.city,
    ),
    provinsi: pickFirstValue(
      rawItem?.provinsi,
      rawItem?.province,
      rawItem?.state,
      profile?.provinsi,
      profile?.province,
      profile?.state,
    ),
  });
  const linkedin = pickFirstValue(
    rawItem?.linkedin,
    rawItem?.linkedin_url,
    profile?.linkedin,
    profile?.linkedin_url,
  );
  const instagram = pickFirstValue(
    rawItem?.instagram,
    rawItem?.instagram_url,
    profile?.instagram,
    profile?.instagram_url,
  );

  // ─── Data Akademik & Posisi ───────────────────────────────────────────────
  const position = pickFirstValue(
    rawItem?.posisi,
    rawItem?.position,
    rawItem?.job_title,
    rawItem?.lowongan?.judul_posisi,
    rawItem?.job?.judul_posisi,
    "-",
  );
  const university = pickFirstValue(
    rawItem?.universitas,
    rawItem?.university,
    rawItem?.campus,
    profile?.universitas,
    profile?.university,
    profile?.campus,
    "-",
  );
  const major = pickFirstValue(
    rawItem?.jurusan,
    rawItem?.major,
    rawItem?.program_studi,
    profile?.jurusan,
    profile?.major,
    profile?.program_studi,
    "-",
  );
  const ipk = pickFirstValue(
    rawItem?.ipk,
    rawItem?.gpa,
    profile?.ipk,
    profile?.gpa,
  );
  const registeredAt = pickFirstValue(
    rawItem?.created_at,
    rawItem?.registered_at,
    rawItem?.tanggal_daftar,
    user?.created_at,
  );
  const experiences = normalizeList(
  rawItem?.pengalaman_kerja ||      // ← key dari backend AdminTalentController
  rawItem?.pengalaman ||
  rawItem?.experiences ||
  rawItem?.work_experiences ||
  profile?.pengalaman_kerja ||
  profile?.pengalaman ||
  profile?.experiences,
);
const certifications = normalizeList(
  rawItem?.lisensi_keahlian ||      // ← key dari backend AdminTalentController
  rawItem?.sertifikasi ||
  rawItem?.certifications ||
  rawItem?.licenses ||
  profile?.lisensi_keahlian ||
  profile?.sertifikasi ||
  profile?.certifications,
);
  const skills = normalizeList(
    rawItem?.skills ||
    rawItem?.keahlian ||
    profile?.skills ||
    profile?.keahlian,
  );

  // ─── Dokumen ─────────────────────────────────────────────────────────────
  const cvUrl = pickFirstValue(
    rawItem?.cv,
    rawItem?.cv_url,
    rawItem?.cv_pdf,
    profile?.cv,
    profile?.cv_url,
    profile?.cv_pdf,
    user?.cv_pdf,
  );
  const portfolioUrl = pickFirstValue(
    rawItem?.portofolio,
    rawItem?.portfolio,
    rawItem?.portfolio_url,
    rawItem?.portofolio_pdf,
    profile?.portofolio_pdf,
    profile?.portfolio_url,
    profile?.portofolio,
    user?.portofolio_pdf,
  );
  const transcriptUrl = pickFirstValue(
    rawItem?.transkrip,
    rawItem?.transcript,
    rawItem?.transcript_url,
    rawItem?.transkrip_pdf,
    profile?.transkrip_pdf,
    profile?.transcript,
    profile?.transcript_url,
    profile?.transkrip,
    user?.transkrip_pdf,
  );
  const identityUrl = pickFirstValue(
    rawItem?.ktp,
    rawItem?.ktp_pdf,
    rawItem?.identity,
    rawItem?.identity_url,
    profile?.ktp_pdf,
    profile?.ktp,
    profile?.identity,
    profile?.identity_url,
    user?.ktp_pdf,
  );
  const recommendationUrl = pickFirstValue(
    rawItem?.surat_rekomendasi,
    rawItem?.surat_rekomendasi_pdf,
    rawItem?.recommendation,
    rawItem?.recommendation_url,
    profile?.surat_rekomendasi_pdf,
    profile?.surat_rekomendasi,
    profile?.recommendation,
    profile?.recommendation_url,
    user?.surat_rekomendasi_pdf,
  );
  const ktmUrl = pickFirstValue(
    rawItem?.ktm,
    rawItem?.ktm_pdf,
    rawItem?.student_card,
    profile?.ktm_pdf,
    profile?.ktm,
    user?.ktm_pdf,
  );

  // ─── Assessment ───────────────────────────────────────────────────────────
  const testStartedAt = pickFirstValue(
    rawItem?.test_started_at,
    rawItem?.assessment_started_at,
    rawItem?.started_at,
    profile?.test_started_at,
    profile?.assessment_started_at,
    rawItem?.assessment?.started_at,
    rawItem?.test_result?.started_at,
  );
  const testFinishedAt = pickFirstValue(
    rawItem?.test_finished_at,
    rawItem?.assessment_finished_at,
    rawItem?.finished_at,
    rawItem?.completed_at,
    profile?.test_finished_at,
    profile?.assessment_finished_at,
    rawItem?.assessment?.finished_at,
    rawItem?.test_result?.finished_at,
  );
  const assessmentScore = pickFirstValue(
    rawItem?.score,
    rawItem?.assessment_score,
    rawItem?.test_score,
    rawItem?.hasil_test,
    rawItem?.nilai,
    rawItem?.assessment?.score,
    rawItem?.test_result?.score,
    profile?.assessment_score,
    profile?.test_score,
  );
  const assessmentAnswers = normalizeList(
    rawItem?.answers ||
    rawItem?.jawaban ||
    rawItem?.assessment?.answers ||
    rawItem?.test_result?.answers,
  );
  const assessmentQuestions = normalizeList(
    rawItem?.questions ||
    rawItem?.soal ||
    rawItem?.assessment?.questions ||
    rawItem?.test_result?.questions,
  );
  const hasAssessment = Boolean(
    testStartedAt ||
    testFinishedAt ||
    assessmentScore ||
    rawItem?.assessment ||
    rawItem?.test_result ||
    assessmentAnswers.length > 0,
  );

  // ─── Return ───────────────────────────────────────────────────────────────
  return {
    id: String(
      rawItem?.user_id ||
      rawItem?.id ||
      user?.user_id ||
      user?.id ||
      "",
    ),
    name,
    email,
    phone,
    photo,
    about,
    gender,
    birthPlace,
    birthDate,
    birthPlaceAndDate: formatBirthPlaceAndDate(birthPlace, birthDate),
    address,
    linkedin,
    instagram,
    position,
    university,
    major,
    ipk,
    registeredAt: formatTalentDate(registeredAt),
    status: normalizeTalentStatus(
      rawItem?.status ||
      rawItem?.application_status ||
      rawItem?.review_status,
    ),
    experiences,
    certifications,
    skills,
    documents: {
      cv:             buildTalentDocument(cvUrl,             "Curriculum Vitae"),
      portfolio:      buildTalentDocument(portfolioUrl,      "Portofolio"),
      identity:       buildTalentDocument(identityUrl,       "KTP / Identitas Diri"),
      recommendation: buildTalentDocument(recommendationUrl, "Surat Rekomendasi"),
      transcript:     buildTalentDocument(transcriptUrl,     "Transkrip Nilai"),
      ktm:            buildTalentDocument(ktmUrl,            "Kartu Tanda Mahasiswa (KTM)"),
    },
    assessment: {
      available: hasAssessment,
      score:     assessmentScore || null,
      answers:   assessmentAnswers,
      questions: assessmentQuestions,
      subtitle: testFinishedAt
        ? `Kandidat menyelesaikan tes pada ${formatTalentDate(testFinishedAt)}`
        : testStartedAt
          ? `Tes dimulai pada ${formatTalentDate(testStartedAt)}`
          : assessmentScore
            ? `Skor assessment tercatat: ${assessmentScore}`
            : "Belum ada hasil assessment",
      summary: hasAssessment
        ? "Data online assessment sudah tersedia di backend dan dapat ditinjau lebih lanjut."
        : "Belum ada hasil assessment untuk ditampilkan.",
    },
  };
}