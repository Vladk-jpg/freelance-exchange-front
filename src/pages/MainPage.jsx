import React from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center px-3">
      <div
        className="bg-white border rounded-4 p-4 p-md-5 shadow text-center"
        style={{ maxWidth: "700px" }}
      >
        <h1 className="mb-4 display-5 fw-bold">
          Добро пожаловать в{" "}
          <span className="text-primary">Freelance Exchange</span>
        </h1>
        <p className="mb-4 fs-5">
          Freelance Exchange — это платформа, которая соединяет{" "}
          <strong>фрилансеров</strong> и <strong>заказчиков</strong>. Находите
          проекты, нанимайте специалистов и достигайте своих целей вместе с
          нами.
        </p>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
          <button className="btn btn-outline-primary btn-lg px-4">
            Узнать больше
          </button>
          <button className="btn btn-primary btn-lg px-4" onClick={handleStart}>
            Начать сейчас
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
