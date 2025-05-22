import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById, sendProposal } from "../api";
import Cookies from "js-cookie";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const role = Cookies.get("role");

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetchProjectById(id);
      const data = await response.json();
      setProject(data);
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const resp = await sendProposal({ message, projectId: id });
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Ошибка при отправке заявки");
      }
      setMessage("");
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  if (!project) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-secondary">Загрузка проекта...</p>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="mb-3 mt-5 text-dark">{project.title}</h1>
        <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
          {project.description}
        </p>

        <div className="row g-3 mb-5">
          <InfoBox label="Категория" value={project.category?.category} />
          <InfoBox
            label="Бюджет"
            value={project.price ? `${project.price} BYN` : "Не указан"}
          />
          <InfoBox label="Статус" value={project.status} />
          <InfoBox
            label="Создан"
            value={new Date(project.createdAt).toLocaleString()}
          />
          <InfoBox
            label="Обновлён"
            value={new Date(project.updatedAt).toLocaleString()}
          />
        </div>

        <div className="p-4 rounded-3 bg-white shadow-sm">
          <h4 className="mb-4 text-dark">Заказчик</h4>
          <div className="d-flex align-items-center gap-4">
            <img
              src={project.client.profilePicture || "/default-avatar.png"}
              alt="Аватар клиента"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #dee2e6",
              }}
            />
            <div>
              <ClientInfo label="Имя" value={project.client.username} />
              <ClientInfo label="Email" value={project.client.email} />
              <ClientInfo label="Статус" value={project.client.status} />
            </div>
          </div>
        </div>

        {role === "FREELANCER" && (
          <div className="p-4 rounded-3 mt-5 bg-white shadow-sm">
            <h4 className="mb-3 text-dark">Откликнуться на проект</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="message" className="form-label text-secondary">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              {submitError && (
                <div className="alert alert-danger py-2">{submitError}</div>
              )}
              {submitSuccess && (
                <div className="alert alert-success py-2">
                  Заявка отправлена!
                </div>
              )}
              <button type="submit" className="btn btn-primary">
                Отправить заявку
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="col-md-6 col-lg-4">
    <div className="p-3 rounded-3 border-start border-4 border-primary bg-white shadow-sm">
      <div
        style={{
          color: "#6c757d",
          fontSize: "0.9rem",
          fontWeight: "bold",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </div>
      <div className="text-dark">{value}</div>
    </div>
  </div>
);

const ClientInfo = ({ label, value }) => (
  <p className="mb-2">
    <span style={{ color: "#6c757d", fontWeight: "bold" }}>{label}:</span>{" "}
    <span className="text-dark">{value}</span>
  </p>
);

export default ProjectDetailsPage;
