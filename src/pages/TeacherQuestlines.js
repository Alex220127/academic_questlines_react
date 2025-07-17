import React, { useState, useEffect } from 'react';
import '../styles/TeacherQuestline.css';
import { useNavigate } from 'react-router';
import { getNavElements } from '../utils/getNavElements';
import Navbar from '../components/Navbar';
import { getQuestlines, shareQuestline } from '../serivces/api';
import { isConnected } from '../utils/isConnected';

const TeacherQuestline = () => {
  const [questlines, setQuestlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState('')
  const [navElements, setNavElements] = useState([])
  const navigate = useNavigate()

  const handleCreateQuestlineClick = () => {
    navigate('/questlines/create')
  }

  const handleGenerateCodeAndCopy = async (questlineId) => {
    const response = await shareQuestline(questlineId, localStorage.getItem('token'))

    if (response.success) {
      await navigator.clipboard.writeText(response.data.short_code);
      setCopiedMessage(`Código '${response.data.short_code}' copiado!`);
      setTimeout(() => setCopiedMessage(null), 3000);
    } else {
      console.error('Falha ao copiar o código:');
      setCopiedMessage('Falha ao copiar o código.');
      setTimeout(() => setCopiedMessage(null), 3000);
    }
  }

  useEffect(() => {
    const fetchQuestlines = async () => {
      setLoading(true);
      const response = await getQuestlines(localStorage.getItem('token'))

      if (response.success) {
        setQuestlines(response.data)
      } else {
        setError("Falha ao carregar as trilhas.")
      }

      setLoading(false)
    };

    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    setNavElements(getNavElements(connectedUser.user))
    fetchQuestlines();
  }, [navigate]);

  if (loading) {
    return <div className="questline-list-message">Carregando trilhas...</div>;
  }

  if (error) {
    return <div className="questline-list-message error">{error}</div>;
  }

  if (questlines.length === 0) {
    return <>
    <Navbar items={navElements} />
    <div className="professor-questline-list-container">
      <div className="list-header">
          <h1 className="list-title">Minhas Trilhas Acadêmicas</h1>
          <button
            className="create-questline-button"
            onClick={handleCreateQuestlineClick}
          >
            + Criar Nova Trilha
          </button>
        </div>
      <div className="questline-list-message">Nenhuma trilha encontrada para este professor.</div>
      </div>
      </>
  }

  return (
    <>
      <Navbar items={navElements} />
      <div className="professor-questline-list-container">
        <div className="list-header">
          <h1 className="list-title">Minhas Trilhas Acadêmicas</h1>
          <button
            className="create-questline-button"
            onClick={handleCreateQuestlineClick}
          >
            + Criar Nova Trilha
          </button>
        </div>

        {copiedMessage && (
          <div className="copied-confirmation-message">
            {copiedMessage}
          </div>
        )}

        {questlines.length === 0 ? (
          <div className="questline-list-message">Nenhuma trilha encontrada para este professor.</div>
        ) : (
          <div className="questline-cards-grid">
            {questlines.map((questline) => (
              <div key={questline._id} className="questline-card">
                <h2 className="card-title">{questline.name}</h2>
                <p><strong>Assunto:</strong> {questline.subject}</p>
                <p><strong>Recompensa:</strong> {questline.reward}</p>
                <p><strong>Ativa:</strong> <span className={`status-badge ${questline.active ? 'active' : 'inactive'}`}>
                  {questline.active ? 'Sim' : 'Não'}
                </span></p>
                <p><strong>Início:</strong> {new Date(questline.start_at).toLocaleDateString('pt-BR')}</p>
                <p><strong>Término:</strong> {new Date(questline.end_at).toLocaleDateString('pt-BR')}</p>

                <div className="node-summary">
                  <h3>Nós da Trilha ({questline.nodes.length})</h3>
                  <ul>
                    {questline.nodes.map((node, nodeIndex) => (
                      <li key={nodeIndex}>
                        <strong>{node.name}</strong> (Tipo: {node.type})
                        {node.type === 'question' && (
                          <span className="node-type-detail"> - {node.question.title}</span>
                        )}
                        {['text', 'video'].includes(node.type) && node.content?.ref && (
                          <span className="node-type-detail"> - {node.content.ref.substring(0, 30)}...</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="generate-code-button"
                  onClick={() => handleGenerateCodeAndCopy(questline._id)}
                >
                  Gerar Código e Copiar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
};

export default TeacherQuestline;
