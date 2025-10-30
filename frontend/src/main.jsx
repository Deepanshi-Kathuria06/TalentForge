// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./Pages/Auth/AuthContext";
import { FeedProvider } from "./components/Feed/FeedContext";

import { Landing } from "./Pages/LandingPage/Landing";
import Signup from "./Pages/Auth/signup";
import { Login } from "./Pages/Auth/Login";
import ATS from "./Pages/ATS CHECKER/ATS";
import Resume from "./Pages/ResumeBuilder/resumeEditor";
import Starting from "./Pages/ResumeBuilder/Starting";
import CompanyDashboard from "./Pages/CompanyDashboard/CompanyDashboard";
import Udashboard from "./Pages/UserDashboard/Udashboard";
import SavedDesign from "./Pages/ResumeBuilder/saveddesign";
import Challenges from "./Pages/UserDashboard/Sections/Challenges/Challenges";
import ProblemSolve from "./Pages/UserDashboard/Sections/Challenges/ProblemSolve";
import Profile from "./Pages/UserDashboard/Sections/Profile/Profile";

function MainApp() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ATS" element={<ATS />} />
      <Route path="/starting" element={<Starting />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
      <Route path="/Udashboard" element={<Udashboard />} />
      <Route path="/resume-builder/saveddesign" element={<SavedDesign />} />
      <Route path="/solve/:problemId" element={<ProblemSolve />} />
      <Route path="/ResumeBuilder/resumeEditor" element={<Resume />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <FeedProvider>
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </FeedProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
