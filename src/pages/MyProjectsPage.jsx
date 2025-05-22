import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyProjects, createProject, fetchCategories } from "../api";
import Cookies from "js-cookie";

// Универсальное поле формы
const FormField = ({ label, name, value, onChange, as = "input", rows }) => {
  const Tag = as;
  return (
    <div className="mb-3">
      <label className="form-label text-secondary">{label}</label>
      <Tag
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="form-control"
        required
      />
    </div>
  );
};

const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const navigate = useNavigate();
  const role = Cookies.get("role");

  useEffect(() => {
    const load = async () => {
      try {
        const projRes = await fetchMyProjects();
        const projData = await projRes.json();
        setProjects(projData);

        const catRes = await fetchCategories();
        const catData = await catRes.json();
        setCategories(catData);
      } catch {
        alert("Ошибка сервера при загрузке данных.");
      }
    };
    load();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProject({
        ...formData,
        skillsRequired: formData.skillsRequired
          ?.split(",")
          .map((s) => s.trim()),
      });
      if (!res.ok) throw new Error();
      const updated = await (await fetchMyProjects()).json();
      setProjects(updated);
      setShowForm(false);
      setFormData({ title: "", description: "", price: "", categoryId: "" });
      alert("Проект создан!");
    } catch {
      alert("Ошибка при создании проекта.");
    }
  };

  return (
    <div className="bg-light text-dark min-vh-100 py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Мои проекты</h2>
          {role === "CLIENT" && (
            <button
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => setShowForm(true)}
            >
              +
            </button>
          )}
        </div>

        {showForm && role === "CLIENT" && (
          <div className="bg-white border p-4 rounded-4 shadow-sm mb-5">
            <h4 className="mb-4">Новый проект</h4>
            <form onSubmit={handleFormSubmit}>
              <FormField
                label="Название"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
              />
              <FormField
                label="Описание"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                as="textarea"
                rows={3}
              />
              <FormField
                label="Цена"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
              <div className="mb-3">
                <label className="form-label text-secondary">Категория</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled>
                    Выберите категорию
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setShowForm(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="btn btn-success">
                  Создать
                </button>
              </div>
            </form>
          </div>
        )}

        {projects.length === 0 ? (
          <p className="text-center text-muted">У вас пока нет проектов.</p>
        ) : (
          <div className="row g-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="col-md-6 col-lg-4"
                onClick={() => navigate(`/my-projects/${proj.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="bg-white border p-3 h-100 rounded-4 shadow-sm d-flex flex-column justify-content-between">
                  <h5 className="mb-2">{proj.title}</h5>
                  <p className="mb-2">
                    Статус: <span className="badge bg-info">{proj.status}</span>
                  </p>
                  <small className="text-muted">
                    {new Date(proj.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </small>
                  <p className="text-secondary mt-2 mb-3 flex-grow-1">
                    {proj.description?.slice(0, 80)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-dark">
                      ID: {proj.id}
                    </span>
                    <span className="fw-semibold text-success">
                      {proj.price} BYN
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectsPage;
