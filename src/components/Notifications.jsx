import React, { useEffect, useState } from "react";
import { fetchNotifications, fetchMarkNotification } from "../api";

const NotificationsSidebar = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchNotifications();
      if (!response.ok) throw new Error("Ошибка загрузки уведомлений");
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, isRead: true } : notif
      )
    );

    try {
      const response = await fetchMarkNotification(id);
      if (!response.ok) {
        throw new Error("Ошибка при отметке уведомления");
      }
    } catch (err) {
      setError(err.message);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: false } : notif
        )
      );
    }
  };

  return (
    <div
      className="border-start bg-light h-100 overflow-auto p-3"
      style={{ width: "300px" }}
    >
      <h5 className="mb-3">Уведомления</h5>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Загрузка...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && notifications.length === 0 && (
        <div className="text-muted">Нет новых уведомлений</div>
      )}

      <ul className="list-group">
        {notifications.map(({ _id, title, content, createdAt, isRead }) => (
          <li
            key={_id}
            className={`list-group-item list-group-item-action ${
              isRead ? "text-muted bg-secondary-subtle" : ""
            }`}
            role="button"
            onClick={() => !isRead && handleNotificationClick(_id)}
            title={content}
          >
            <div className="fw-semibold">{title}</div>
            <small className="text-muted">
              {new Date(createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsSidebar;
