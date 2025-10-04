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
import  Starting  from "./Pages/ResumeBuilder/starting"
import SavedDesign from "./Pages/ResumeBuilder/saveddesign";
import Udashboard from  "./Pages/UserDashboard/Udashboard"
// Wrap all routes in a function component
function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ATS" element={<ATS />} />
        <Route path="/starting" element={<Starting />} />
      <Route path="/resume-builder/saveddesign" element={<SavedDesign />} />
<Route path="/ResumeBuilder/resumeEditor" element={<Resume />} />
<Route path="/Udashboard" element={<Udashboard />} />      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);