import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают.");
      return;
    }

    try {
      const response = await registerUser(
        email,
        password,
        confirmPassword,
        username,
        role
      );

      if (response.ok) {
        alert("Регистрация успешна. Теперь вы можете войти.");
        navigate("/login");
      } else {
        alert("Ошибка регистрации. Попробуйте снова.");
      }
    } catch (error) {
      alert("Ошибка сервера.");
    }
  };

  return (
    <div className="bg-light vh-100 d-flex justify-content-center align-items-center">
      <form
        className="bg-white p-4 p-md-5 rounded-4 shadow-lg w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleRegister}
      >
        <h2 className="mb-4 text-center fw-semibold text-dark">Регистрация</h2>

        <div className="mb-3">
          <select
            className="form-select rounded-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="CLIENT">Клиент</option>
            <option value="FREELANCER">Фрилансер</option>
          </select>
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control rounded-3"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control rounded-3"
            placeholder="Введите username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-bold rounded-3"
        >
          Зарегистрироваться
        </button>

        <p className="mt-4 text-center small text-dark">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-primary text-decoration-underline">
            Войти
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
