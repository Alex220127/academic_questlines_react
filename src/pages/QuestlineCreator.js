import React, { useEffect, useState } from 'react';
import '../styles/QuestlineCreator.css'; // Importa o arquivo CSS
import { createQuestline } from '../serivces/api';
import { useNavigate } from 'react-router';
import { getNavElements } from '../utils/getNavElements';
import Navbar from '../components/Navbar';
import { isConnected } from '../utils/isConnected';

const QuestlineCreator = () => {
  const [questline, setQuestline] = useState({
    name: '',
    subject: '',
    start_at: '',
    end_at: '',
    active: false,
    reward: 0,
    nodes: []
  });
  const [navElements, setNavElements] = useState([])
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestline(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNodeChange = (index, e) => {
    const { name, value } = e.target;
    const newNodes = [...questline.nodes];
    newNodes[index] = {
      ...newNodes[index],
      [name]: value
    };
    setQuestline(prev => ({ ...prev, nodes: newNodes }));
  };

  const handleQuestionChange = (nodeIndex, e) => {
    const { name, value } = e.target;
    const newNodes = [...questline.nodes];
    newNodes[nodeIndex] = {
      ...newNodes[nodeIndex],
      question: {
        ...newNodes[nodeIndex].question,
        [name]: value
      }
    };
    setQuestline(prev => ({ ...prev, nodes: newNodes }));
  };

  const handleAlternativeChange = (nodeIndex, altIndex, e) => {
    const { value } = e.target;
    const newNodes = [...questline.nodes];
    const newAlternatives = [...(newNodes[nodeIndex].question?.alternatives || [])];
    newAlternatives[altIndex] = value;
    newNodes[nodeIndex] = {
      ...newNodes[nodeIndex],
      question: {
        ...newNodes[nodeIndex].question,
        alternatives: newAlternatives
      }
    };
    setQuestline(prev => ({ ...prev, nodes: newNodes }));
  };

  const handleContentChange = (nodeIndex, e) => {
    const { name, value } = e.target;
    const newNodes = [...questline.nodes];
    newNodes[nodeIndex] = {
      ...newNodes[nodeIndex],
      content: {
        ...newNodes[nodeIndex].content,
        [name]: value
      }
    };
    setQuestline(prev => ({ ...prev, nodes: newNodes }));
  };

  const addNode = () => {
    setQuestline(prev => ({
      ...prev,
      nodes: [
        ...prev.nodes,
        {
          name: '',
          type: 'text',
        }
      ]
    }));
  };

  const removeNode = (index) => {
    setQuestline(prev => ({
      ...prev,
      nodes: prev.nodes.filter((_, i) => i !== index)
    }));
  };

  const addAlternative = (nodeIndex) => {
    const newNodes = [...questline.nodes];

    if (!newNodes[nodeIndex].question) {
      newNodes[nodeIndex].question = { title: '', alternatives: [], correct_answer: '' };
    }

    if (!Array.isArray(newNodes[nodeIndex].question.alternatives)) {
      newNodes[nodeIndex].question.alternatives = [];
    }

    newNodes[nodeIndex].question.alternatives.push('');

    setQuestline(prev => ({ ...prev, nodes: newNodes }));
  }

  const removeAlternative = (nodeIndex, altIndex) => {
    const newNodes = [...questline.nodes];
    newNodes[nodeIndex].question.alternatives = newNodes[nodeIndex].question.alternatives.filter((_, i) => i !== altIndex);
    setQuestline(prev => ({ ...prev, nodes: newNodes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createQuestline(questline, localStorage.getItem('token'))
    console.log(response.data)

    if (!response.success) {
      alert(response.data)
    }

    navigate('/home')
  };

  useEffect(() => {
    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    setNavElements(getNavElements(connectedUser.user))
  }, [navigate])

  return (
    <>
      <Navbar items={navElements}/>
      <div className="questline-creator-container">
        <h1 className="questline-creator-title">Criar Nova Trilha Acadêmica</h1>
        <form onSubmit={handleSubmit} className="questline-form">
          <div className="form-group">
            <label htmlFor="name">Nome da Trilha:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={questline.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Assunto:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={questline.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="start_at">Data de Início:</label>
            <input
              type="date"
              id="start_at"
              name="start_at"
              value={questline.start_at}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end_at">Data de Término:</label>
            <input
              type="date"
              id="end_at"
              name="end_at"
              value={questline.end_at}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={questline.active}
              onChange={handleChange}
            />
            <label htmlFor="active">Ativa</label>
          </div>
          <div className="form-group">
            <label htmlFor="reward">Recompensa:</label>
            <input
              type="number"
              id="reward"
              name="reward"
              value={questline.reward}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="nodes-section">
            <h2 className="nodes-section-title">Nós da Trilha</h2>
            {questline.nodes.map((node, nodeIndex) => (
              <div key={nodeIndex} className="node-card">
                <h3>Nó #{nodeIndex + 1}</h3>
                <div className="form-group">
                  <label htmlFor={`node-name-${nodeIndex}`}>Nome do Nó:</label>
                  <input
                    type="text"
                    id={`node-name-${nodeIndex}`}
                    name="name"
                    value={node.name}
                    onChange={(e) => handleNodeChange(nodeIndex, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`node-type-${nodeIndex}`}>Tipo:</label>
                  <select
                    id={`node-type-${nodeIndex}`}
                    name="type"
                    value={node.type}
                    onChange={(e) => handleNodeChange(nodeIndex, e)}
                    required
                  >
                    <option value="text">Texto</option>
                    <option value="video">Vídeo</option>
                    <option value="question">Questão</option>
                  </select>
                </div>

                {node.type === 'question' && (
                  <div className="question-details">
                    <h4>Detalhes da Questão</h4>
                    <div className="form-group">
                      <label htmlFor={`question-title-${nodeIndex}`}>Título da Questão:</label>
                      <input
                        type="text"
                        id={`question-title-${nodeIndex}`}
                        name="title"
                        value={node.question?.title || ''}
                        onChange={(e) => handleQuestionChange(nodeIndex, e)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Alternativas:</label>
                      {node.question?.alternatives?.map((alt, altIndex) => (
                        <div key={altIndex} className="alternative-item">
                          <input
                            type="text"
                            value={alt}
                            onChange={(e) => handleAlternativeChange(nodeIndex, altIndex, e)}
                            required
                          />
                          <button type="button" onClick={() => removeAlternative(nodeIndex, altIndex)} className="remove-button">Remover</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addAlternative(nodeIndex)} className="add-alternative-button">Adicionar Alternativa</button>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`correct-answer-${nodeIndex}`}>Resposta Correta:</label>
                      <input
                        type="text"
                        id={`correct-answer-${nodeIndex}`}
                        name="correct_answer"
                        value={node.question?.correct_answer || ''}
                        onChange={(e) => handleQuestionChange(nodeIndex, e)}
                        required
                      />
                    </div>
                  </div>
                )}

                {['text', 'video'].includes(node.type) && (
                  <div className="content-details">
                    <h4>Detalhes do Conteúdo</h4>
                    <div className="form-group">
                      <label htmlFor={`content-ref-${nodeIndex}`}>Referência (URL/ID):</label>
                      <input
                        type="text"
                        id={`content-ref-${nodeIndex}`}
                        name="ref"
                        value={node.content?.ref || ''}
                        onChange={(e) => handleContentChange(nodeIndex, e)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`content-filename-${nodeIndex}`}>Nome do Arquivo:</label>
                      <input
                        type="text"
                        id={`content-filename-${nodeIndex}`}
                        name="file_name"
                        value={node.content?.file_name || ''}
                        onChange={(e) => handleContentChange(nodeIndex, e)}
                      />
                    </div>
                  </div>
                )}
                <button type="button" onClick={() => removeNode(nodeIndex)} className="remove-node-button">Remover Nó</button>
              </div>
            ))}
            <button type="button" onClick={addNode} className="add-node-button">Adicionar Nó</button>
          </div>

          <button type="submit" className="submit-button">Criar Trilha</button>
        </form>
      </div>
    </>
  );
};

export default QuestlineCreator;
