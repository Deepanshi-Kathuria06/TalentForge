// main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Landing } from "./Pages/LandingPage/Landing";
import Signup from "./Pages/Auth/signup";
import { Login } from "./Pages/Auth/Login";
import ATS from "./Pages/ATS CHECKER/ATS";
import Resume from "./Pages/ResumeBuilder/resumeEditor"
import Resume from "./Pages/ResumeBuilder/resumeEditor"
import  Starting  from "./Pages/ResumeBuilder/starting"
import CompanyDashboard from "./Pages/CompanyDashboard/CompanyDashboard.jsx";
import Udashboard from "./Pages/UserDashboard/Udashboard";
import Dashboard from "./Pages/UserDashboard/Dashboard";
import SavedDesign from "./Pages/ResumeBuilder/saveddesign";


import SavedDesign from "./Pages/ResumeBuilder/saveddesign";
// Wrap all routes in a function component
function MainApp() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ATS" element={<ATS />} />
        <Route path="/starting" element={<Starting />} />
        <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
        <Route path="/Udashboard" element={<Udashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/resume-builder/saveddesign" element={<SavedDesign />} />
          <Route path="/ResumeBuilder/resumeEditor" element={<Resume />} />
      <Route path="/resume-builder/saveddesign" element={<SavedDesign />} />
<Route path="/ResumeBuilder/resumeEditor" element={<Resume />} />
      </Routes>
  
  
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);