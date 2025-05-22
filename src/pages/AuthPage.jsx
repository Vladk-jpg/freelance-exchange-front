import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import Cookies from "js-cookie";

function AuthPage({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);

      if (response.ok) {
        const data = await response.json();
        Cookies.set("accessToken", data.token, { expires: 1 });

        Cookies.set("role", data.role, { expires: 1 });
        setIsAuth(true);
        navigate("/");
      } else {
        alert("Ошибка входа. Проверьте данные.");
      }
    } catch (error) {
      alert("Ошибка сервера.");
    }
  };

  return (
    <div className="bg-light text-dark vh-100 d-flex justify-content-center align-items-center">
      <form
        className="bg-white border rounded-4 shadow p-4 p-md-5 w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={handleLogin}
      >
        <h2 className="mb-4 text-center fw-semibold">Вход</h2>

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

        <div className="mb-4">
          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-bold rounded-3"
        >
          Войти
        </button>

        <p className="mt-4 text-center small">
          Нет аккаунта?{" "}
          <a href="/register" className="text-decoration-underline">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
