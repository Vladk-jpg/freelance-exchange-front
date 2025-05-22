import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById, fetchSendApproval } from "../api";
import { useNavigate } from "react-router-dom";

const FreelancerProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectRes = await fetchProjectById(id);
        const projectData = await projectRes.json();
        setProject(projectData);
        console.log(projectData);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  const handleSendApproval = async () => {
    try {
      const res = await fetchSendApproval(project.id);

      if (!res.ok) {
        alert("Ошибка при отправке заявки на одобрение.");
        return;
      }

      alert("Заявка на одобрение отправлена.");

      const updatedRes = await fetchProjectById(id);
      const updatedProject = await updatedRes.json();
      setProject(updatedProject);
    } catch (error) {
      console.error("Ошибка при отправке одобрения:", error);
    }
  };

  if (!project) {
    return <div className="text-light text-center mt-5">Загрузка...</div>;
  }

  return (
    <div className="bg-light text-dark min-vh-100 p-4 p-md-5 mt-5">
      <div className="bg-white p-4 rounded-4 shadow mb-5 border position-relative">
        <h2 className="fw-bold">{project.title}</h2>
        <p className="text-muted small">
          Создан:{" "}
          {new Date(project.createdAt).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mb-2">
          Категория: <strong>{project.category.category}</strong>
        </p>
        <p className="mb-2">
          Статус:{" "}
          <span className="badge bg-info text-dark">{project.status}</span>
        </p>
        <p className="mb-2">
          Бюджет: <strong>{project.price} BYN</strong>
        </p>
        <p className="mt-4">{project.description}</p>
        <p>
          Заказчик:{" "}
          <span
            onClick={() => navigate(`/user/profile/${project.client.id}`)}
            className="text-primary text-decoration-underline"
            role="button"
            style={{ cursor: "pointer" }}
          >
            {project.client.username}
          </span>
        </p>
        <span className="mt-2 text-end small text-muted d-block">
          ID: {project.id}
        </span>
        {project.status === "IN_PROGRESS" && (
          <button onClick={handleSendApproval} className="btn btn-success mt-3">
            Отправить на одобрение
          </button>
        )}
      </div>
    </div>
  );
};

export default FreelancerProjectDetailsPage;
