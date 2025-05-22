import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { checkAuthStatus } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Cookies from "js-cookie";
import MyProjectsPage from "./pages/MyProjectsPage";
import MyProjectDetailsPage from "./pages/MyProjectDetailsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import FreelancerProjectDetailsPage from "./pages/FreelancerProjectDetails";
import UserProfilePage from "./pages/UserProfilePage";
import ProposalsPage from "./pages/ProposalsPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      const { isAuth, role } = await checkAuthStatus();
      setIsAuth(isAuth);
      setRole(role);

      if (isAuth) {
        Cookies.set("role", role);
      } else {
        Cookies.remove("role");
        Cookies.remove("accessToken");
      }
    };

    initializeAuth();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      <Router>
        <Header isAuth={isAuth} setIsAuth={setIsAuth} role={role} />
        <main className="container py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<AuthPage setIsAuth={setIsAuth} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-projects"
              element={isAuth ? <MyProjectsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-projects/:id"
              element={
                isAuth ? (
                  Cookies.get("role") === "CLIENT" ? (
                    <MyProjectDetailsPage />
                  ) : (
                    <FreelancerProjectDetailsPage />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/user/profile/:id" element={<UserProfilePage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
