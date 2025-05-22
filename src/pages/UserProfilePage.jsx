import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserProfile } from "../api";

const UserProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadProfile();
  }, [id]);

  if (error) {
    return (
      <div className="container py-5">
        <h2 className="text-danger mb-3">Ошибка</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container text-center py-5 mt-5">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3 fs-5 text-secondary">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <h1 className="mb-4 text-primary">Профиль пользователя</h1>
      <div
        className="d-flex align-items-center gap-4 p-4 shadow rounded"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <img
          src={profile.profilePicture || "/avatar.png"}
          alt="Аватар пользователя"
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #007bff",
          }}
        />
        <div style={{ flex: 1 }}>
          <ProfileInfo label="Имя" value={profile.username} />
          <ProfileInfo label="Email" value={profile.email} />
          <ProfileInfo label="Роль" value={profile.role} />
          <ProfileInfo
            label="Зарегистрирован"
            value={new Date(profile.createdAt).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = ({ label, value }) => (
  <p className="mb-3" style={{ fontSize: "1.1rem" }}>
    <span style={{ color: "#555", fontWeight: "600" }}>{label}:</span>{" "}
    <span style={{ color: "#222" }}>{value}</span>
  </p>
);

export default UserProfilePage;
