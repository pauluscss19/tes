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
  // ─── Cari objek user & profile dari berbagai kemungkinan struktur backend ───
  const user =
    rawItem?.user ||
    rawItem?.intern ||
    rawItem?.candidate ||
    rawItem?.data?.user ||
    rawItem?.data?.intern ||
    {};

  const profile =
    user?.intern_profile ||
    user?.internProfile ||
    user?.profile ||
    rawItem?.intern_profile ||
    rawItem?.internProfile ||
    rawItem?.profile ||
    rawItem?.data?.profile ||
    rawItem?.data?.intern_profile ||
    {};

  // ─── Data Pribadi ───────────────────────────────────────────────────────────
  const name = pickFirstValue(
    rawItem?.nama,
    rawItem?.name,
    rawItem?.full_name,
    user?.nama,
    user?.name,
    user?.full_name,
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
    user?.no_hp,
    profile?.notelp,
    profile?.phone,
    profile?.phone_number,
    profile?.no_hp,
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
    user?.tentang_saya,
    user?.bio,
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
    user?.avatar_url,
  );

  const gender = pickFirstValue(
    rawItem?.jenis_kelamin,
    rawItem?.gender,
    rawItem?.jenisKelamin,
    profile?.jenis_kelamin,
    profile?.gender,
    profile?.jenisKelamin,
    user?.jenis_kelamin,
    user?.gender,
    "-",
  );

  const birthPlace = pickFirstValue(
    rawItem?.tempat_lahir,
    rawItem?.place_of_birth,
    rawItem?.birth_place,
    profile?.tempat_lahir,
    profile?.place_of_birth,
    profile?.birth_place,
    user?.tempat_lahir,
    "-",
  );

  const birthDate = pickFirstValue(
    rawItem?.tanggal_lahir,
    rawItem?.date_of_birth,
    rawItem?.birth_date,
    profile?.tanggal_lahir,
    profile?.date_of_birth,
    profile?.birth_date,
    user?.tanggal_lahir,
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
      user?.alamat,
      user?.address,
    ),
    kabupaten: pickFirstValue(
      rawItem?.kabupaten,
      rawItem?.kota,
      rawItem?.city,
      profile?.kabupaten,
      profile?.kota,
      profile?.city,
      user?.kabupaten,
      user?.kota,
    ),
    provinsi: pickFirstValue(
      rawItem?.provinsi,
      rawItem?.province,
      rawItem?.state,
      profile?.provinsi,
      profile?.province,
      profile?.state,
      user?.provinsi,
      user?.province,
    ),
  });

  const linkedin = pickFirstValue(
    rawItem?.linkedin,
    rawItem?.linkedin_url,
    profile?.linkedin,
    profile?.linkedin_url,
    user?.linkedin,
    user?.linkedin_url,
  );

  const instagram = pickFirstValue(
    rawItem?.instagram,
    rawItem?.instagram_url,
    profile?.instagram,
    profile?.instagram_url,
    user?.instagram,
    user?.instagram_url,
  );

  // ─── Data Pekerjaan / Posisi ────────────────────────────────────────────────
  const position = pickFirstValue(
    rawItem?.posisi,
    rawItem?.position,
    rawItem?.job_title,
    rawItem?.lowongan?.judul_posisi,
    rawItem?.job?.judul_posisi,
    rawItem?.lowongan?.title,
    rawItem?.job?.title,
    "-",
  );

  // ─── Data Akademik ──────────────────────────────────────────────────────────
  const university = pickFirstValue(
    rawItem?.universitas,
    rawItem?.university,
    rawItem?.campus,
    rawItem?.perguruan_tinggi,
    profile?.universitas,
    profile?.university,
    profile?.campus,
    profile?.perguruan_tinggi,
    user?.universitas,
    user?.university,
    "-",
  );

  const major = pickFirstValue(
    rawItem?.jurusan,
    rawItem?.major,
    rawItem?.program_studi,
    rawItem?.prodi,
    profile?.jurusan,
    profile?.major,
    profile?.program_studi,
    profile?.prodi,
    user?.jurusan,
    user?.major,
    "-",
  );

  const ipk = pickFirstValue(
    rawItem?.ipk,
    rawItem?.gpa,
    profile?.ipk,
    profile?.gpa,
    user?.ipk,
  );

  const semester = pickFirstValue(
    rawItem?.semester,
    profile?.semester,
    user?.semester,
  );

  const registeredAt = pickFirstValue(
    rawItem?.created_at,
    rawItem?.registered_at,
    rawItem?.tanggal_daftar,
    user?.created_at,
  );

  // ─── Pengalaman, Sertifikasi, Skill ────────────────────────────────────────
  const experiences = normalizeList(
    rawItem?.pengalaman_kerja ||
      rawItem?.pengalaman ||
      rawItem?.experiences ||
      rawItem?.work_experiences ||
      profile?.pengalaman ||
      profile?.experiences,
  );

  const certifications = normalizeList(
    rawItem?.lisensi_keahlian ||
      rawItem?.sertifikasi ||
      rawItem?.certifications ||
      rawItem?.licenses ||
      profile?.sertifikasi ||
      profile?.certifications,
  );

  const skills = normalizeList(
    rawItem?.lisensi_keahlian ||
      rawItem?.skills ||
      rawItem?.keahlian ||
      profile?.skills ||
      profile?.keahlian ||
      user?.skills,
  );

  // ─── Dokumen ────────────────────────────────────────────────────────────────
  // Cari URL dokumen dari rawItem, profile, maupun user langsung
  const cvUrl = pickFirstValue(
    rawItem?.cv,
    rawItem?.cv_url,
    rawItem?.cv_pdf,
    profile?.cv,
    profile?.cv_url,
    profile?.cv_pdf,
    user?.cv,
    user?.cv_pdf,
  );

  const portfolioUrl = pickFirstValue(
    rawItem?.portofolio,
    rawItem?.portfolio,
    rawItem?.portfolio_url,
    rawItem?.portofolio_pdf,
    profile?.portofolio_pdf,
    profile?.portofolio,
    profile?.portfolio_url,
    user?.portofolio_pdf,
    user?.portofolio,
  );

  const transcriptUrl = pickFirstValue(
    rawItem?.transkrip,
    rawItem?.transcript,
    rawItem?.transcript_url,
    rawItem?.transkrip_pdf,
    profile?.transkrip_pdf,
    profile?.transkrip,
    profile?.transcript_url,
    user?.transkrip_pdf,
    user?.transkrip,
  );

  const identityUrl = pickFirstValue(
    rawItem?.ktp,
    rawItem?.identity,
    rawItem?.identity_url,
    rawItem?.ktp_pdf,
    profile?.ktp_pdf,
    profile?.ktp,
    profile?.identity_url,
    user?.ktp_pdf,
    user?.ktp,
  );

  const recommendationUrl = pickFirstValue(
    rawItem?.surat_rekomendasi,
    rawItem?.recommendation,
    rawItem?.recommendation_url,
    rawItem?.surat_rekomendasi_pdf,
    profile?.surat_rekomendasi_pdf,
    profile?.surat_rekomendasi,
    profile?.recommendation_url,
    user?.surat_rekomendasi_pdf,
    user?.surat_rekomendasi,
  );

  const ktmUrl = pickFirstValue(
    rawItem?.ktm,
    rawItem?.ktm_pdf,
    rawItem?.student_card,
    profile?.ktm_pdf,
    profile?.ktm,
    user?.ktm_pdf,
    user?.ktm,
  );

  // ─── Assessment / Review Jawaban ────────────────────────────────────────────
  const testStartedAt = pickFirstValue(
    rawItem?.test_started_at,
    rawItem?.assessment_started_at,
    rawItem?.started_at,
    profile?.test_started_at,
    profile?.assessment_started_at,
    user?.test_started_at,
  );

  const testFinishedAt = pickFirstValue(
    rawItem?.test_finished_at,
    rawItem?.assessment_finished_at,
    rawItem?.finished_at,
    rawItem?.completed_at,
    profile?.test_finished_at,
    profile?.assessment_finished_at,
    user?.test_finished_at,
  );

  const assessmentScore = pickFirstValue(
    rawItem?.score,
    rawItem?.assessment_score,
    rawItem?.test_score,
    rawItem?.hasil_test,
    rawItem?.nilai,
    profile?.score,
    profile?.assessment_score,
    profile?.test_score,
    user?.score,
    user?.assessment_score,
  );

  // ✅ Tambah: tangkap array jawaban jika backend mengirimnya
  const assessmentAnswers = normalizeList(
    rawItem?.jawaban ||
      rawItem?.answers ||
      rawItem?.assessment_answers ||
      rawItem?.test_answers ||
      rawItem?.assessment?.answers ||
      rawItem?.test_result?.answers ||
      profile?.jawaban ||
      profile?.answers,
  );

  const hasAssessment = Boolean(
    testStartedAt ||
      testFinishedAt ||
      assessmentScore ||
      assessmentAnswers.length > 0 ||
      rawItem?.assessment ||
      rawItem?.test_result,
  );

  // ─── Return ─────────────────────────────────────────────────────────────────
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
    semester,
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
      ktm:            buildTalentDocument(ktmUrl,            "Kartu Tanda Mahasiswa"),
    },
    assessment: {
      available: hasAssessment,
      score: assessmentScore || "-",
      answers: assessmentAnswers,
      startedAt: formatTalentDate(testStartedAt),
      finishedAt: formatTalentDate(testFinishedAt),
      subtitle: testFinishedAt
        ? `Kandidat menyelesaikan tes pada ${formatTalentDate(testFinishedAt)}`
        : testStartedAt
          ? `Tes dimulai pada ${formatTalentDate(testStartedAt)}`
          : assessmentScore
            ? `Skor assessment: ${assessmentScore}`
            : "Belum ada hasil assessment",
      summary: hasAssessment
        ? "Data online assessment sudah tersedia dan dapat ditinjau."
        : "Belum ada hasil assessment untuk ditampilkan.",
    },
  };
}