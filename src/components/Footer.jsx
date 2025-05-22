import React from "react";

function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-3 border-top mt-auto">
      <div className="container">
        <p className="mb-1">
          &copy; {new Date().getFullYear()} Freelance Exchange. Все права
          защищены.
        </p>
        <p className="mb-0 small">
          <a href="/terms" className="text-decoration-none me-3">
            Условия использования
          </a>
          <a href="/privacy" className="text-decoration-none">
            Политика конфиденциальности
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
