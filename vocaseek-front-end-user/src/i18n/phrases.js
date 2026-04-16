const entries = [
  { sources: ["Beranda", "Home"], id: "Beranda", en: "Home" },
  { sources: ["Lowongan", "Vacancies"], id: "Lowongan", en: "Vacancies" },
  { sources: ["Mitra", "Partners"], id: "Mitra", en: "Partners" },
  { sources: ["Kontak", "Contact"], id: "Kontak", en: "Contact" },
  { sources: ["Masuk", "Login", "Sign in"], id: "Masuk", en: "Login" },
  { sources: ["Masuk ke Akun Vocaseek", "Sign in to Your Vocaseek Account"], id: "Masuk ke Akun Vocaseek", en: "Sign in to Your Vocaseek Account" },
  { sources: ["Masuk ke Akun Vokasik"], id: "Masuk ke Akun Vocaseek", en: "Sign in to Your Vocaseek Account" },
  { sources: ["Masuk untuk melanjutkan pencarian dan pengelolaan lamaran magangmu.", "Sign in to continue your internship search and application management."], id: "Masuk untuk melanjutkan pencarian dan pengelolaan lamaran magangmu.", en: "Sign in to continue your internship search and application management." },
  { sources: ["Masuk dengan Google", "Continue with Google"], id: "Masuk dengan Google", en: "Continue with Google" },
  { sources: ["Belum punya akun?", "Don't have an account?"], id: "Belum punya akun?", en: "Don't have an account?" },
  { sources: ["Daftar sekarang", "Register now"], id: "Daftar sekarang", en: "Register now" },
  { sources: ["Lupa Password?", "Forgot Password?"], id: "Lupa Password?", en: "Forgot Password?" },
  { sources: ["Ingat saya", "Remember me"], id: "Ingat saya", en: "Remember me" },
  { sources: ["Memproses...", "Processing..."], id: "Memproses...", en: "Processing..." },
  { sources: ["Memproses Google...", "Processing Google..."], id: "Memproses Google...", en: "Processing Google..." },
  { sources: ["Temukan Magang", "Discover Internships"], id: "Temukan Magang", en: "Discover Internships" },
  { sources: ["Impianmu Bersama", "That Match Your Dreams with"], id: "Impianmu Bersama", en: "That Match Your Dreams with" },
  { sources: ["Platform yang menghubungkan talenta muda dengan perusahaan untuk membangun pengalaman dan kesiapan kerja.", "A platform that connects young talent with companies to build experience and career readiness."], id: "Platform yang menghubungkan talenta muda dengan perusahaan untuk membangun pengalaman dan kesiapan kerja.", en: "A platform that connects young talent with companies to build experience and career readiness." },
  { sources: ["Get Started"], id: "Mulai Sekarang", en: "Get Started" },
  { sources: ["Silakan isi Role Anda dan berikan detail Anda.", "Please choose your role and fill in your details."], id: "Silakan isi Role Anda dan berikan detail Anda.", en: "Please choose your role and fill in your details." },
  { sources: ["Pelamar", "Applicant"], id: "Pelamar", en: "Applicant" },
  { sources: ["Company"], id: "Perusahaan", en: "Company" },
  { sources: ["Full Name", "Nama Lengkap"], id: "Nama Lengkap", en: "Full Name" },
  { sources: ["Email Address", "Alamat Email"], id: "Alamat Email", en: "Email Address" },
  { sources: ["Phone Number", "Nomor Telepon"], id: "Nomor Telepon", en: "Phone Number" },
  { sources: ["Create Password", "Buat Password"], id: "Buat Password", en: "Create Password" },
  { sources: ["Daftar Sebagai Pelamar", "Register as Applicant"], id: "Daftar Sebagai Pelamar", en: "Register as Applicant" },
  { sources: ["OR CONTINUE WITH", "ATAU LANJUTKAN DENGAN"], id: "ATAU LANJUTKAN DENGAN", en: "OR CONTINUE WITH" },
  { sources: ["Do you have an account?", "Sudah punya akun?"], id: "Sudah punya akun?", en: "Do you have an account?" },
  { sources: ["Partner With Us", "Bermitra Bersama Kami"], id: "Bermitra Bersama Kami", en: "Partner With Us" },
  { sources: ["Complete legal registration to start a professional partnership.", "Lengkapi registrasi legal untuk memulai kemitraan profesional."], id: "Lengkapi registrasi legal untuk memulai kemitraan profesional.", en: "Complete legal registration to start a professional partnership." },
  { sources: ["Company Name", "Nama Perusahaan"], id: "Nama Perusahaan", en: "Company Name" },
  { sources: ["Company Email", "Email Perusahaan"], id: "Email Perusahaan", en: "Company Email" },
  { sources: ["Company Phone", "Telepon Perusahaan"], id: "Telepon Perusahaan", en: "Company Phone" },
  { sources: ["Nomor Induk Berusaha (NIB)"], id: "Nomor Induk Berusaha (NIB)", en: "Business Identification Number (NIB)" },
  { sources: ["Confirm Password", "Konfirmasi Password"], id: "Konfirmasi Password", en: "Confirm Password" },
  { sources: ["Letter of Acceptance (LoA)"], id: "Letter of Acceptance (LoA)", en: "Letter of Acceptance (LoA)" },
  { sources: ["Upload LoA (PDF)"], id: "Unggah LoA (PDF)", en: "Upload LoA (PDF)" },
  { sources: ["Maximum file size: 5MB"], id: "Ukuran file maksimum: 5MB", en: "Maximum file size: 5MB" },
  { sources: ["Akta Pendirian (SK)"], id: "Akta Pendirian (SK)", en: "Deed of Establishment" },
  { sources: ["Upload Deed of Establishment (PDF)"], id: "Unggah Akta Pendirian (PDF)", en: "Upload Deed of Establishment (PDF)" },
  { sources: ["I agree to the Terms of Partnership and legal compliance requirements.", "Saya setuju dengan Syarat Kemitraan dan persyaratan kepatuhan hukum."], id: "Saya setuju dengan Syarat Kemitraan dan persyaratan kepatuhan hukum.", en: "I agree to the Terms of Partnership and legal compliance requirements." },
  { sources: ["Terms of Partnership", "Syarat Kemitraan"], id: "Syarat Kemitraan", en: "Terms of Partnership" },
  { sources: ["Register Company", "Daftar Perusahaan"], id: "Daftar Perusahaan", en: "Register Company" },
  { sources: ["Already a partner?", "Sudah menjadi mitra?"], id: "Sudah menjadi mitra?", en: "Already a partner?" },
  { sources: ["Global search for talents, partners, or meetings...", "Cari talenta, mitra, atau meeting secara global..."], id: "Cari talenta, mitra, atau meeting secara global...", en: "Global search for talents, partners, or meetings..." },
  { sources: ["Core Menu", "Menu Utama"], id: "Menu Utama", en: "Core Menu" },
  { sources: ["Talent Management", "Manajemen Talenta"], id: "Manajemen Talenta", en: "Talent Management" },
  { sources: ["User Management", "Manajemen Pengguna"], id: "Manajemen Pengguna", en: "User Management" },
  { sources: ["Verifikasi Perusahaan", "Company Verification"], id: "Verifikasi Perusahaan", en: "Company Verification" },
  { sources: ["Profil", "Profile"], id: "Profil", en: "Profile" },
  { sources: ["ADMIN", "Admin"], id: "ADMIN", en: "Admin" },
  { sources: ["MASTER DASHBOARD", "Master Dashboard"], id: "DASHBOARD UTAMA", en: "MASTER DASHBOARD" },
  { sources: ["Overview Dashboard", "Ringkasan Dashboard"], id: "Ringkasan Dashboard", en: "Overview Dashboard" },
  { sources: ["TOTAL TALENTS", "Total Talenta"], id: "TOTAL TALENTA", en: "TOTAL TALENTS" },
  { sources: ["PARTNERS", "Mitra"], id: "MITRA", en: "PARTNERS" },
  { sources: ["OPENINGS", "Lowongan"], id: "LOWONGAN", en: "OPENINGS" },
  { sources: ["MEETINGS", "Pertemuan"], id: "PERTEMUAN", en: "MEETINGS" },
  { sources: ["Belum ada data talenta", "No talent data yet"], id: "Belum ada data talenta", en: "No talent data yet" },
  { sources: ["Belum ada data mitra", "No partner data yet"], id: "Belum ada data mitra", en: "No partner data yet" },
  { sources: ["Belum ada lowongan", "No openings yet"], id: "Belum ada lowongan", en: "No openings yet" },
  { sources: ["Belum ada meeting", "No meetings yet"], id: "Belum ada meeting", en: "No meetings yet" },
  { sources: ["Recent Activity", "Aktivitas Terbaru"], id: "Aktivitas Terbaru", en: "Recent Activity" },
  { sources: ["Unified view of talent applications and partner updates.", "Tampilan terpadu untuk lamaran talenta dan pembaruan mitra."], id: "Tampilan terpadu untuk lamaran talenta dan pembaruan mitra.", en: "Unified view of talent applications and partner updates." },
  { sources: ["Filter"], id: "Filter", en: "Filter" },
  { sources: ["See All", "Lihat Semua"], id: "Lihat Semua", en: "See All" },
  { sources: ["IDENTITY", "IDENTITAS"], id: "IDENTITAS", en: "IDENTITY" },
  { sources: ["ROLE/CATEGORY", "PERAN/KATEGORI"], id: "PERAN/KATEGORI", en: "ROLE/CATEGORY" },
  { sources: ["ORGANIZATION", "ORGANISASI"], id: "ORGANISASI", en: "ORGANIZATION" },
  { sources: ["STATUS"], id: "STATUS", en: "STATUS" },
  { sources: ["No recent activity", "Belum ada aktivitas terbaru"], id: "Belum ada aktivitas terbaru", en: "No recent activity" },
  { sources: ["Partner Management", "Manajemen Mitra"], id: "Manajemen Mitra", en: "Partner Management" },
  { sources: ["Tambah Admin Baru", "Add New Admin"], id: "Tambah Admin Baru", en: "Add New Admin" },
  { sources: ["Tambah Admin Website Baru", "Add New Website Admin"], id: "Tambah Admin Website Baru", en: "Add New Website Admin" },
  { sources: ["Informasi Admin Baru", "New Admin Information"], id: "Informasi Admin Baru", en: "New Admin Information" },
  { sources: ["Silakan lengkapi detail informasi untuk membuat akun administrasi baru.", "Please complete the details below to create a new admin account."], id: "Silakan lengkapi detail informasi untuk membuat akun administrasi baru.", en: "Please complete the details below to create a new admin account." },
  { sources: ["Informasi Akun", "Account Information"], id: "Informasi Akun", en: "Account Information" },
  { sources: ["NAMA LENGKAP", "FULL NAME"], id: "NAMA LENGKAP", en: "FULL NAME" },
  { sources: ["ALAMAT EMAIL", "EMAIL ADDRESS"], id: "ALAMAT EMAIL", en: "EMAIL ADDRESS" },
  { sources: ["NOMOR TELEPON", "PHONE NUMBER"], id: "NOMOR TELEPON", en: "PHONE NUMBER" },
  { sources: ["Masukkan nama lengkap admin", "Enter admin full name"], id: "Masukkan nama lengkap admin", en: "Enter admin full name" },
  { sources: ["contoh@vokaseek.id", "example@vocaseek.id"], id: "contoh@vocaseek.id", en: "example@vocaseek.id" },
  { sources: ["Pengaturan Peran", "Role Settings"], id: "Pengaturan Peran", en: "Role Settings" },
  { sources: ["PILIH ROLE / PERAN", "SELECT ROLE"], id: "PILIH ROLE / PERAN", en: "SELECT ROLE" },
  { sources: ["Admin Staff", "Staff Admin"], id: "Admin Staff", en: "Staff Admin" },
  { sources: ["Peran menentukan tingkat akses dan izin di dashboard internal.", "Role determines access level and permissions in the internal dashboard."], id: "Peran menentukan tingkat akses dan izin di dashboard internal.", en: "Role determines access level and permissions in the internal dashboard." },
  { sources: ["KONFIRMASI PASSWORD", "CONFIRM PASSWORD"], id: "KONFIRMASI PASSWORD", en: "CONFIRM PASSWORD" },
  { sources: ["Masukkan password", "Enter password"], id: "Masukkan password", en: "Enter password" },
  { sources: ["Ulangi password", "Repeat password"], id: "Ulangi password", en: "Repeat password" },
  { sources: ["Batal", "Cancel"], id: "Batal", en: "Cancel" },
  { sources: ["Simpan", "Save"], id: "Simpan", en: "Save" },
  { sources: ["Tambah Admin Baru?", "Add New Admin?"], id: "Tambah Admin Baru?", en: "Add New Admin?" },
  { sources: ["Admin staff baru akan dibuat dengan password yang Anda tetapkan.", "A new staff admin will be created with the password you set."], id: "Admin staff baru akan dibuat dengan password yang Anda tetapkan.", en: "A new staff admin will be created with the password you set." },
  { sources: ["Ya, Tambahkan", "Yes, Add"], id: "Ya, Tambahkan", en: "Yes, Add" },
  { sources: ["Verifikasi Perusahaan Mitra", "Partner Company Verification"], id: "Verifikasi Perusahaan Mitra", en: "Partner Company Verification" },
  { sources: ["Tinjau dan setujui pendaftaran perusahaan baru untuk bergabung dengan ekosistem Vocaseek.", "Review and approve new company registrations to join the Vocaseek ecosystem."], id: "Tinjau dan setujui pendaftaran perusahaan baru untuk bergabung dengan ekosistem Vocaseek.", en: "Review and approve new company registrations to join the Vocaseek ecosystem." },
  { sources: ["Total Pending", "Pending Total"], id: "Total Pending", en: "Pending Total" },
  { sources: ["Total Ditolak", "Total Rejected"], id: "Total Ditolak", en: "Total Rejected" },
  { sources: ["Daftar Pengajuan", "Submission List"], id: "Daftar Pengajuan", en: "Submission List" },
  { sources: ["Cari perusahaan...", "Search companies..."], id: "Cari perusahaan...", en: "Search companies..." },
  { sources: ["ID PERUSAHAAN", "COMPANY ID"], id: "ID PERUSAHAAN", en: "COMPANY ID" },
  { sources: ["NAMA PERUSAHAAN", "COMPANY NAME"], id: "NAMA PERUSAHAAN", en: "COMPANY NAME" },
  { sources: ["TANGGAL PENGAJUAN", "SUBMISSION DATE"], id: "TANGGAL PENGAJUAN", en: "SUBMISSION DATE" },
  { sources: ["STATUS VERIFIKASI", "VERIFICATION STATUS"], id: "STATUS VERIFIKASI", en: "VERIFICATION STATUS" },
  { sources: ["AKSI", "ACTION"], id: "AKSI", en: "ACTION" },
  { sources: ["Ubah Status", "Change Status"], id: "Ubah Status", en: "Change Status" },
  { sources: ["Pending"], id: "Pending", en: "Pending" },
  { sources: ["Reviewed"], id: "Direview", en: "Reviewed" },
  { sources: ["Active"], id: "Aktif", en: "Active" },
  { sources: ["Rejected"], id: "Ditolak", en: "Rejected" },
  { sources: ["Approved"], id: "Disetujui", en: "Approved" },
  { sources: ["Review"], id: "Review", en: "Review" },
  { sources: ["Ubah Status Verifikasi Mitra", "Change Partner Verification Status"], id: "Ubah Status Verifikasi Mitra", en: "Change Partner Verification Status" },
  { sources: ["Pilih Status Baru", "Select New Status"], id: "Pilih Status Baru", en: "Select New Status" },
  { sources: ["Simpan Perubahan", "Save Changes"], id: "Simpan Perubahan", en: "Save Changes" },
  { sources: ["Previous"], id: "Sebelumnya", en: "Previous" },
  { sources: ["Next"], id: "Berikutnya", en: "Next" },
  { sources: ["Overview", "Ringkasan"], id: "Ringkasan", en: "Overview" },
  { sources: ["Dashboard", "Dasbor"], id: "Dashboard", en: "Dashboard" },
  { sources: ["Manajemen Lowongan", "Job Management"], id: "Manajemen Lowongan", en: "Job Management" },
  { sources: ["Manajemen Talent", "Talent Management"], id: "Manajemen Talent", en: "Talent Management" },
  { sources: ["Profil Perusahaan", "Company Profile"], id: "Profil Perusahaan", en: "Company Profile" },
  { sources: ["Semua Kandidat", "All Candidates"], id: "Semua Kandidat", en: "All Candidates" },
  { sources: ["Kandidat Terpilih", "Selected Candidates"], id: "Kandidat Terpilih", en: "Selected Candidates" },
  { sources: ["Most Popular Vacancies"], id: "Lowongan Paling Populer", en: "Most Popular Vacancies" },
  { sources: ["Open Positions", "Posisi Terbuka"], id: "Posisi Terbuka", en: "Open Positions" },
  { sources: ["Langkah Kerja", "How It Works"], id: "Langkah Kerja", en: "How It Works" },
  { sources: ["Create account"], id: "Buat akun", en: "Create account" },
  { sources: ["Upload CV/Resume"], id: "Unggah CV/Resume", en: "Upload CV/Resume" },
  { sources: ["Find suitable job"], id: "Cari pekerjaan yang sesuai", en: "Find suitable job" },
  { sources: ["Apply job"], id: "Lamar pekerjaan", en: "Apply job" },
  { sources: ["Daftar dan lengkapi profil kamu.", "Register and complete your profile."], id: "Daftar dan lengkapi profil kamu.", en: "Register and complete your profile." },
  { sources: ["Unggah CV terbaikmu.", "Upload your best CV."], id: "Unggah CV terbaikmu.", en: "Upload your best CV." },
  { sources: ["Pilih pekerjaan sesuai minat.", "Choose jobs that match your interest."], id: "Pilih pekerjaan sesuai minat.", en: "Choose jobs that match your interest." },
  { sources: ["Lamar pekerjaan dengan mudah.", "Apply for jobs easily."], id: "Lamar pekerjaan dengan mudah.", en: "Apply for jobs easily." },
  { sources: ["Bidang Kategori", "Category"], id: "Bidang Kategori", en: "Category" },
  { sources: ["Tampilkan semua →", "View All →"], id: "Tampilkan semua →", en: "View All →" },
  { sources: ["Featured Job"], id: "Lowongan Unggulan", en: "Featured Job" },
  { sources: ["View All →"], id: "Lihat Semua →", en: "View All →" },
  { sources: ["Gabung Sekarang! →", "Join Now! →"], id: "Gabung Sekarang! →", en: "Join Now! →" },
  { sources: ["Gabung sekarang! →"], id: "Gabung sekarang! →", en: "Join now! →" },
  { sources: ["Jadilah Kandidat!", "Become a Candidate!"], id: "Jadilah Kandidat!", en: "Become a Candidate!" },
  { sources: ["Kamu bisa menjadi salah satu kandidat terpilih Vocaseek. Cobalah mendaftar segera!", "You can become one of Vocaseek's selected candidates. Try registering now!"], id: "Kamu bisa menjadi salah satu kandidat terpilih Vocaseek. Cobalah mendaftar segera!", en: "You can become one of Vocaseek's selected candidates. Try registering now!" },
  { sources: ["Daftar Sekarang →", "Register Now →"], id: "Daftar Sekarang →", en: "Register Now →" },
  { sources: ["Gabung Menjadi Mitra", "Become a Partner"], id: "Gabung Menjadi Mitra", en: "Become a Partner" },
  { sources: ["Calon mitra yang mendaftar, dipersilahkan untuk segera mendaftar sesuai ketentuan yang tertera!", "Prospective partners are invited to register according to the listed requirements!"], id: "Calon mitra yang mendaftar, dipersilahkan untuk segera mendaftar sesuai ketentuan yang tertera!", en: "Prospective partners are invited to register according to the listed requirements!" },
  { sources: ["About Us", "Tentang Kami"], id: "Tentang Kami", en: "About Us" },
  { sources: ["Vocaseek berdedikasi dalam mengembangkan kapasitas talenta muda Indonesia melalui program pelatihan, mentoring, dan penyaluran karir yang terintegrasi.", "Vocaseek is dedicated to developing the capacity of Indonesia's young talent through integrated training, mentoring, and career placement programs."], id: "Vocaseek berdedikasi dalam mengembangkan kapasitas talenta muda Indonesia melalui program pelatihan, mentoring, dan penyaluran karir yang terintegrasi.", en: "Vocaseek is dedicated to developing the capacity of Indonesia's young talent through integrated training, mentoring, and career placement programs." },
  { sources: ["Contact Info", "Informasi Kontak"], id: "Informasi Kontak", en: "Contact Info" },
  { sources: ["© 2026 Vocaseek. All rights reserved.", "© 2026 Vocaseek. Semua hak dilindungi."], id: "© 2026 Vocaseek. Semua hak dilindungi.", en: "© 2026 Vocaseek. All rights reserved." },
  { sources: ["VOKASIK EST. 2026", "VOCASEEK EST. 2026"], id: "VOCASEEK EST. 2026", en: "VOCASEEK EST. 2026" },
  { sources: ["© 2026 VOCASEEK INC. ALL RIGHTS RESERVED.", "© 2026 VOCASEEK INC. Semua hak dilindungi."], id: "© 2026 VOCASEEK INC. Semua hak dilindungi.", en: "© 2026 VOCASEEK INC. ALL RIGHTS RESERVED." },
  { sources: ["Email", "Surel"], id: "Email", en: "Email" },
  { sources: ["Password", "Kata Sandi"], id: "Kata Sandi", en: "Password" },
  { sources: ["Masukkan email", "Enter email"], id: "Masukkan email", en: "Enter email" },
  { sources: ["Masukkan password", "Enter password"], id: "Masukkan password", en: "Enter password" },
];

function normalizeText(value) {
  return String(value || "")
    .replace(/Â©/g, "©")
    .replace(/â†’/g, "→")
    .replace(/â€º/g, "›")
    .replace(/\s+/g, " ")
    .trim();
}

const phraseMap = new Map();

entries.forEach((entry) => {
  entry.sources.forEach((source) => {
    const normalizedSource = normalizeText(source);
    if (!phraseMap.has(normalizedSource)) {
      phraseMap.set(normalizedSource, {
        id: entry.id,
        en: entry.en,
      });
    }
  });
});

const dynamicRules = [
  {
    test: /^(Open Positions|Posisi Terbuka)$/i,
    translate: (_, locale) => (locale === "en" ? "Open Positions" : "Posisi Terbuka"),
  },
  {
    test: /^(\d+)\s+Total$/i,
    translate: (text, locale) => {
      const [, count] = text.match(/^(\d+)\s+Total$/i) || [];
      return locale === "en" ? `${count} Total` : `${count} Total`;
    },
  },
  {
    test: /^Menampilkan\s+(\d+)-(\d+)\s+dari\s+(\d+)\s+data$/i,
    translate: (text, locale) => {
      const [, start, end, total] = text.match(/^Menampilkan\s+(\d+)-(\d+)\s+dari\s+(\d+)\s+data$/i) || [];
      return locale === "en"
        ? `Showing ${start}-${end} of ${total} items`
        : `Menampilkan ${start}-${end} dari ${total} data`;
    },
  },
  {
    test: /^Showing\s+(\d+)-(\d+)\s+of\s+(\d+)\s+items$/i,
    translate: (text, locale) => {
      const [, start, end, total] = text.match(/^Showing\s+(\d+)-(\d+)\s+of\s+(\d+)\s+items$/i) || [];
      return locale === "en"
        ? `Showing ${start}-${end} of ${total} items`
        : `Menampilkan ${start}-${end} dari ${total} data`;
    },
  },
];

export function translatePhrase(text, locale) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return null;
  }

  const entry = phraseMap.get(normalized);
  if (entry) {
    return entry[locale] || entry.id;
  }

  const matchingRule = dynamicRules.find((rule) => rule.test.test(normalized));
  if (matchingRule) {
    return matchingRule.translate(normalized, locale);
  }

  return null;
}

export function normalizeTranslatableText(text) {
  return normalizeText(text);
}
