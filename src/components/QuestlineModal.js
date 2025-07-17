import React, { useEffect } from 'react';
import '../styles/Modal.css';

const Modal = ({ onClose, title, children, completeActivity, node }) => {
  useEffect(() => {
    if (node) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [node]);

  if (!node) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h2 className="modal-title">{title || 'Título do Modal'}</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* BODY (onde o seu vídeo/conteúdo vai) */}
        <div className="modal-body">
          {children} {/* CONTEÚDO QUE VOCÊ PASSA */}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="button-secondary" onClick={onClose}>
            Fechar
          </button>
          { node?.status === 'pending' && node?.type !== 'question' && <button onClick={completeActivity} className="button-primary">Concluir atividade</button> }
        </div>
      </div>
    </div>
  );
};

export default Modal;
