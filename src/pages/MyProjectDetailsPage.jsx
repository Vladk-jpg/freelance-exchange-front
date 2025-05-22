import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProjectById,
  fetchProposalsByProjectId,
  acceptProposal,
  rejectProposal,
  fetchCategories,
  updateProject,
  deleteProject,
  fetchApproveProject,
  fetchCancelProject,
} from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const MyProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectRes = await fetchProjectById(id);
        const projectData = await projectRes.json();
        setProject(projectData);
        console.log(projectData);

        const proposalsRes = await fetchProposalsByProjectId(id);
        const proposalsData = await proposalsRes.json();
        setProposals(proposalsData);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Ошибка при загрузке категорий:", err);
      }
    };

    loadCategories();
  }, []);

  const handleAccept = async (proposalId) => {
    setError(null);
    const res = await acceptProposal(proposalId);
    if (!res.ok) {
      setError(
        "Ошибка при принятии заявки, возможно у вас недостаточно средств"
      );
    } else {
      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
      const projectRes = await fetchProjectById(id);
      const projectData = await projectRes.json();
      setProject(projectData);
    }
  };

  const handleReject = async (proposalId) => {
    setError(null);
    const res = await rejectProposal(proposalId);
    if (!res.ok) {
      setError("Ошибка при отклонении заявки");
    } else {
      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    }
  };

  const handleEditClick = () => {
    setEditForm({
      title: project.title,
      description: project.description,
      price: project.price,
      categoryId: project.category.id,
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const updatedForm = {
        ...editForm,
        price: editForm.price.toString(),
      };
      console.log(updatedForm);
      await updateProject(project.id, updatedForm);
      setProject((prev) => ({ ...prev, ...updatedForm }));
      setIsEditing(false);
    } catch (err) {
      const errorResponse = await err.response.json();
      console.error("Validation errors:", errorResponse);
      setError("Ошибка при обновлении проекта: " + errorResponse.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить проект?")) {
      try {
        await deleteProject(project.id);
        navigate("/my-projects");
      } catch (err) {
        setError("Ошибка при удалении проекта: " + err.message);
      }
    }
  };

  const handleApprove = async () => {
    try {
      await fetchApproveProject(project.id);

      // Повторная загрузка проекта
      const updatedRes = await fetchProjectById(id);
      const updatedProject = await updatedRes.json();
      setProject(updatedProject);
    } catch (err) {
      setError("Ошибка при отправке на одобрение: " + err.message);
    }
  };

  const handleCancel = async () => {
    try {
      await fetchCancelProject(project.id);

      // Повторная загрузка проекта
      const updatedRes = await fetchProjectById(id);
      const updatedProject = await updatedRes.json();
      setProject(updatedProject);
    } catch (err) {
      setError("Ошибка при отмене проекта: " + err.message);
    }
  };

  if (!project) {
    return <div className="text-light text-center mt-5">Загрузка...</div>;
  }

  return (
    <div className="bg-light text-dark min-vh-100 p-4 p-md-5 mt-5">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="bg-white border p-4 rounded-4 shadow-sm mb-5 position-relative">
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
        {project.freelancer && (
          <p>
            Исполнитель:{" "}
            <span
              onClick={() => navigate(`/user/profile/${project.freelancer.id}`)}
              className="text-primary text-decoration-underline"
              role="button"
              style={{ cursor: "pointer" }}
            >
              {project.freelancer.username}
            </span>
          </p>
        )}
        <span className="mt-2 text-end small text-muted d-block">
          ID: {project.id}
        </span>
        {project.status === "CREATED" && (
          <div className="text-end mt-3 d-flex gap-2 justify-content-end">
            <button className="btn btn-warning" onClick={handleEditClick}>
              Изменить проект
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Удалить проект
            </button>
          </div>
        )}
        {project.status === "AWAITING_APPROVAL" && (
          <div className="text-end mt-3 d-flex gap-2 justify-content-end">
            <button className="btn btn-success" onClick={handleApprove}>
              Подтвердить завершение
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Отклонить завершение
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <form
          className="bg-white border p-4 rounded-4 shadow-sm mb-5"
          onSubmit={handleEditSubmit}
        >
          <h4>Редактировать проект</h4>
          <div className="mb-3">
            <label className="form-label">Название</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Описание</label>
            <textarea
              className="form-control"
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Бюджет</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={editForm.price}
              onChange={handleEditChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Категория</label>
            <select
              className="form-select"
              name="categoryId"
              value={editForm.categoryId}
              onChange={handleEditChange}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success">
            Сохранить
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setIsEditing(false)}
          >
            Отмена
          </button>
        </form>
      )}

      <h4 className="mb-3">Заявки</h4>
      {proposals.length === 0 ? (
        <p className="text-muted">Заявок пока нет.</p>
      ) : (
        <ul className="list-group">
          {proposals.map((proposal) => (
            <li
              key={proposal.id}
              className="list-group-item bg-white border rounded-3 mb-2"
            >
              <p className="mb-1">
                <Link
                  to={`/user/profile/${proposal.freelancer?.id}`}
                  className="text-primary text-decoration-underline"
                >
                  {proposal.freelancer?.username}
                </Link>
                : {proposal.message}
              </p>
              <p className="small text-dark mb-0">
                Статус:{" "}
                <span className="badge bg-info text-dark">
                  {proposal.status}
                </span>
              </p>
              <p className="small text-muted mb-2">
                Отправлено:{" "}
                {new Date(proposal.createdAt).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleAccept(proposal.id)}
                >
                  Принять
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(proposal.id)}
                >
                  Отклонить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProjectDetailsPage;
