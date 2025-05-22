import React, { useEffect, useState } from "react";
import { fetchProposalsByUserId, updateProposal, deleteProposal } from "../api";

const ProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const res = await fetchProposalsByUserId();
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        setError("Ошибка при загрузке заявок");
      }
    };

    loadProposals();
  }, []);

  const handleEdit = (proposal) => {
    setEditingId(proposal.id);
    setEditMessage(proposal.message);
  };

  const handleSave = async (proposalId) => {
    try {
      await updateProposal(proposalId, { message: editMessage });
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId ? { ...p, message: editMessage } : p
        )
      );
      setEditingId(null);
      setEditMessage("");
    } catch (err) {
      setError("Ошибка при обновлении заявки");
    }
  };

  const handleDelete = async (proposalId) => {
    try {
      await deleteProposal(proposalId);
      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
    } catch (err) {
      setError("Ошибка при удалении заявки");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Мои заявки</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {proposals.length === 0 ? (
        <p className="text-muted">Заявок пока нет.</p>
      ) : (
        <div className="row g-4">
          {proposals.map((proposal) => (
            <div className="col-md-6" key={proposal.id}>
              <div className="card border-0 shadow rounded-3">
                <div className="card-body">
                  <h5 className="card-title">
                    Проект: {proposal.project?.title}
                  </h5>
                  <p className="card-text text-muted mb-2">
                    Статус:{" "}
                    <span className="badge bg-info">{proposal.status}</span>
                  </p>
                  <p className="card-text">
                    Сообщение:
                    {editingId === proposal.id ? (
                      <textarea
                        className="form-control mt-2"
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                      />
                    ) : (
                      <span className="d-block mt-1">{proposal.message}</span>
                    )}
                  </p>

                  <p className="card-text small text-muted opacity-75">
                    Отправлено:{" "}
                    {new Date(proposal.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <div className="d-flex gap-2 mt-3">
                    {editingId === proposal.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(proposal.id)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        {proposal.status === "PENDING" && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(proposal)}
                          >
                            Изменить
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(proposal.id)}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
