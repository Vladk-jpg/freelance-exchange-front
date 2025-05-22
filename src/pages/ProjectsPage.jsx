import React, { useEffect, useState, useCallback } from "react";
import { fetchFilteredProjects, searchProjects, fetchCategories } from "../api";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 9;

  const fetchProjects = useCallback(async () => {
    const filters = {
      categories: selectedCategory ? [selectedCategory] : undefined,
      sortBy,
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    };
    const response = await fetchFilteredProjects(filters);
    const data = await response.json();
    setProjects(data.data);
    setTotalPages(Math.ceil(data.total / itemsPerPage));
  }, [selectedCategory, sortBy, currentPage]);

  const fetchAllCategories = async () => {
    const response = await fetchCategories();
    const data = await response.json();
    setCategories(data);
  };

  const handleSearch = async () => {
    const response = await searchProjects(searchQuery);
    const data = await response.json();
    setProjects(data.data);
    setTotalPages(1);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Назад
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Далее
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Проекты</h1>

      {/* Поиск и фильтры */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Поиск
          </button>
        </div>
        <div className="col-md-4 d-md-flex gap-2">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
          <select
            className="form-select mt-2 mt-md-0"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Новые</option>
            <option value="oldest">Старые</option>
            <option value="cheapest">Дешевые</option>
            <option value="most_expensive">Дорогие</option>
            <option value="random">Случайные</option>
          </select>
        </div>
      </div>

      {/* Список проектов */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
        {projects.map((project) => (
          <div
            className="col"
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text text-muted mb-2">
                  Категория: {project.category?.category}
                </p>
                <p className="card-text small text-muted">
                  Бюджет: {project.price || "не указан"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {renderPagination()}
    </div>
  );
};

export default ProjectsPage;
