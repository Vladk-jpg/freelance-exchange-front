import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { fetchNotifications } from "../api";
import NotificationsSidebar from "./Notifications";

function Header({ isAuth, setIsAuth }) {
  const navigate = useNavigate();
  const role = Cookies.get("role");
  const [showSidebar, setShowSidebar] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleAuthAction = () => {
    if (isAuth) {
      Cookies.remove("accessToken");
      Cookies.remove("role");
      setIsAuth(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const updateUnreadCount = () => {
    fetchNotifications()
      .then((res) => res.json())
      .then((data) => {
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      })
      .catch(() => setUnreadCount(0));
  };

  useEffect(() => {
    if (isAuth) {
      updateUnreadCount();
    }
  }, [isAuth]);

  return (
    <>
      <header className="bg-light text-dark py-3 shadow-sm border-bottom fixed-top">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {isAuth && (
              <div className="position-relative me-3">
                <button
                  className="btn btn-link text-dark p-0 position-relative"
                  onClick={() => setShowSidebar(true)}
                  title="Уведомления"
                >
                  <i className="bi bi-bell fs-5"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            <h1 className="h5 mb-0">
              <Link to="/" className="text-dark text-decoration-none">
                Freelance Exchange
              </Link>
            </h1>
          </div>
          <nav className="d-flex flex-wrap align-items-center">
            <Link to="/" className="text-dark text-decoration-none me-3">
              Главная
            </Link>
            <Link
              to="/projects"
              className="text-dark text-decoration-none me-3"
            >
              Искать проекты
            </Link>

            {isAuth && (
              <>
                <Link
                  to="/profile"
                  className="text-dark text-decoration-none me-3"
                >
                  Профиль
                </Link>
                <Link
                  to="/my-projects"
                  className="text-dark text-decoration-none me-3"
                >
                  Мои Проекты
                </Link>
                {role === "FREELANCER" && (
                  <Link
                    to="/proposals"
                    className="text-dark text-decoration-none me-3"
                  >
                    Мои Заявки
                  </Link>
                )}
              </>
            )}

            <button
              className={`btn ${
                isAuth ? "btn-outline-dark" : "btn-primary"
              } mt-2 mt-md-0`}
              onClick={handleAuthAction}
            >
              {isAuth ? "Выйти" : "Войти"}
            </button>
          </nav>
        </div>
      </header>

      {showSidebar && (
        <div
          className="position-fixed top-0 start-0 bg-white border-end shadow h-100 overflow-auto"
          style={{ width: "300px", zIndex: 1050 }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">Уведомления</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setShowSidebar(false);
                updateUnreadCount(); // обновим счётчик после закрытия
              }}
            >
              &times;
            </button>
          </div>
          <NotificationsSidebar />
        </div>
      )}
    </>
  );
}

export default Header;
