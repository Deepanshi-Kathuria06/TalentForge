// main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Landing } from "./Pages/LandingPage/Landing";
import Signup from "./Pages/Auth/signup";
import { Login } from "./Pages/Auth/Login";
import ATS from "./Pages/ATS CHECKER/ATS";
import Resume from "./Pages/ResumeBuilder/resumeEditor";
import Starting from "../src/Pages/ResumeBuilder/Starting.jsx";
import CompanyDashboard from "./Pages/CompanyDashboard/CompanyDashboard.jsx";
import Udashboard from "./Pages/UserDashboard/Udashboard.jsx"
import Dashboard from "./Pages/UserDashboard/Dashboard";
import SavedDesign from "./Pages/ResumeBuilder/saveddesign";
import Challenges from "./Pages/UserDashboard/Sections/Challenges/Challenges.jsx";
import ProblemSolve from './Pages/UserDashboard/Sections/Challenges/ProblemSolve.jsx';
import { AuthProvider } from '../src/Pages/Auth/AuthContext';
import { FeedProvider } from './components/Feed/FeedContext';



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
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
        <Route path="/Udashboard" element={<Udashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/resume-builder/saveddesign" element={<SavedDesign />} />
        <Route path="/solve/:problemId" element={<ProblemSolve />} />
        <Route path="/ResumeBuilder/resumeEditor" element={<Resume />} />
        
        
      </Routes>
  
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
   
      <AuthProvider> {/* Wrap everything with AuthProvider */}
        <FeedProvider>
          <MainApp />
          
        </FeedProvider>
      </AuthProvider>
   
  </StrictMode>
);