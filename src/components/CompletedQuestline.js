// TrailCompletionModal.js
import React from 'react';
import '../styles/CompletedQuestline.css'; // Importa o arquivo CSS

// Função auxiliar para formatar as datas
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  // Formata para data e hora local, ex: "26/06/2025 00:43:43"
  return date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Formato 24 horas
  });
};

function TrailCompletionModal({ isOpen, onClose, registerData }) {
  if (!isOpen || !registerData) return null;

  const { questline, nodes, createdAt, completedAt } = registerData;

  console.log(registerData)

  return (
    <div className="completion-modal-overlay" onClick={onClose}>
      <div className="completion-modal-content" onClick={e => e.stopPropagation()}>
        <div className="completion-modal-header">
          <h3 className="completion-modal-title">
            Parabéns, você finalizou a trilha "{questline.name}"!
          </h3>
          <button className="completion-modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="completion-modal-body">
          <div className="summary-section">
            <p><strong>Início da Trilha:</strong> {formatDateTime(createdAt)}</p>
            <p><strong>Final da Trilha:</strong> {formatDateTime(completedAt)}</p>
            <p className="reward-info">
              <strong>Recompensa Recebida:</strong> {questline.reward} pontos
            </p>
          </div>

          <div className="nodes-section">
            <h4>Detalhes das Atividades:</h4>
            {nodes.length > 0 ? (
              <ul className="nodes-list">
                {nodes.map(node => (
                  <li key={node._id} className="node-item">
                    <span>{node.name}</span>
                    <span className="node-status">
                      {node.status === 'completed' ? `Concluída em: ${formatDateTime(node.updated_at)}` : `Status: ${node.status}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma atividade registrada nesta trilha.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrailCompletionModal;
