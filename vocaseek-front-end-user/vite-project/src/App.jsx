import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardMitra from "./pages/DashboardMitra";
import JobPostings from "./pages/JobPostings";
import CreateJob from "./pages/CreateJob";
import CreateJobPreview from "./pages/CreateJobPreview";
import JobApplicants from "./pages/JobApplicants";
import TalentManagement from "./pages/TalentManagement";
import DetailTalent from "./pages/DetailTalent";
import ReviewDokumen from "./pages/ReviewDokumen";
import AssessmentReview from "./pages/AssessmentReview";
import TambahKandidat from "./pages/TambahKandidat";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyProfileSettings from "./pages/CompanyProfileSettings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardMitra />} />

        <Route path="/lowongan" element={<JobPostings />} />
        <Route path="/lowongan/tambah" element={<CreateJob />} />
        <Route path="/lowongan/pratinjau" element={<CreateJobPreview />} />
        <Route path="/lowongan/applicants" element={<JobApplicants />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/company-profile/settings" element={<CompanyProfileSettings />}/>

        <Route path="/talent" element={<Navigate to="/talent/semua-kandidat" replace />} />
<Route path="/tambah-kandidat"              element={<TambahKandidat />} />
<Route path="/talent/semua-kandidat"        element={<TalentManagement mode="all" />} />
<Route path="/talent/kandidat-terpilih"     element={<TalentManagement mode="shortlisted" />} />
<Route path="/talent/:id/detail"            element={<DetailTalent />} />
<Route path="/talent/:id/review-dokumen"    element={<ReviewDokumen />} />
<Route path="/talent/:id/assessment-review" element={<AssessmentReview />} />
      </Routes>
    </BrowserRouter>
  );
}