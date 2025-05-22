import React, { useEffect, useState } from "react";
import { fetchProfile, uploadProfilePicture, fetchWallet } from "../api";
import Cookies from "js-cookie";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfileAndWallet = async () => {
      const token = Cookies.get("accessToken");

      try {
        // Загрузка профиля
        const profileResponse = await fetchProfile(token);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        } else {
          alert("Ошибка получения профиля.");
        }

        // Загрузка кошелька
        const walletResponse = await fetchWallet();
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          setWallet(walletData);
        } else {
          alert("Ошибка получения кошелька.");
        }
      } catch (error) {
        alert("Ошибка сервера.");
      }
    };

    loadProfileAndWallet();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadProfilePicture(file);
      if (response.ok) {
        alert("Фото профиля успешно обновлено.");
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
      } else {
        alert("Ошибка загрузки фото.");
      }
    } catch (error) {
      alert("Ошибка сервера.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeposit = () => {
    alert("Функция Пополнить пока не реализована");
  };

  const handleWithdraw = () => {
    alert("Функция Вывести пока не реализована");
  };

  if (!profile || !wallet) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "500px", borderRadius: "1rem" }}
      >
        {/* Блок кошелька */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
          <div>
            <strong>Баланс:</strong>{" "}
            <span>{wallet.balance?.toFixed(2)} BYN</span>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={handleDeposit}>
              Пополнить
            </button>
            <button className="btn btn-warning btn-sm" onClick={handleWithdraw}>
              Вывести
            </button>
          </div>
        </div>

        {/* Профиль */}
        <div className="text-center mb-4">
          <img
            src={profile.profilePicture || "./avatar.png"}
            alt="Avatar"
            className="rounded-circle shadow"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <div className="mt-3">
            <label className="btn btn-outline-primary btn-sm">
              Загрузить новое фото
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
        <h3 className="text-center text-dark">{profile.username}</h3>
        <p className="text-center mb-4 text-muted">{profile.email}</p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <strong>Роль:</strong> <span>{profile.role}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <strong>Дата регистрации:</strong>
            <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;
