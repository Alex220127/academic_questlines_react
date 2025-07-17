// TrilhaAcademica.js
import React, { useEffect, useState } from 'react';
import '../styles/QuestlineDetails.css';
import { useLocation, useNavigate } from 'react-router';
import { updateNodeStatus, apiGetRegisteDetails } from '../serivces/api'
import QuestlineModal from '../components/QuestlineModal';
import QuestionLayout from '../components/Question';
import PdfActivity from '../components/Pdf';
import TrailCompletionModal from '../components/CompletedQuestline';
import Navbar from '../components/Navbar';
import { getNavElements } from '../utils/getNavElements';
import { isConnected } from '../utils/isConnected';

const QuestlineDetails = () => {
  const [questline, setQuestline] = useState({ nodes: [] })
  const [loading, setLoading] = useState(true)
  const [focusNode, setFocusNode] = useState(null)
  const [showEndModal, setShowEndModal] = useState(false)
  const [navItems, setNavItems] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    async function getRegisterDetails() {
      const questValue = location.state
      const register = await apiGetRegisteDetails(questValue._id, localStorage.getItem('token'))

      if (!register.success) {
        navigate('/home')
      }

      setQuestline(register.data)
      setLoading(false)
    }

    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    setNavItems(getNavElements(connectedUser.user))

    getRegisterDetails()
  }, [setQuestline, location.state, navigate])

  const clickOpenButton = (event) => {
    console.log(event)
    setFocusNode(event)
  }

  const completeActivity = async () => {
    if (focusNode.status !== 'completed') {
      const response = await updateNodeStatus(questline._id, focusNode._id, 'completed', token)

      if (response.success) {
        const node = questline.nodes.find(node => node._id === focusNode._id)
        node.status = 'completed'
        setFocusNode(null)
        setQuestline(questline)
      }
    }
  }

  const handleQuestionSubmission = async () => {
    await completeActivity()
  }

  if (loading) {
    return (
      <div className="app-container">
        <p>Carregando trilha...</p>
        {/* You can add a loading spinner here */}
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar items={navItems} />
      <div className="academic-track-container">
        <h2>Trilha: {questline.questline.name} ({questline.questline.subject})</h2>
        <p className="track-status">Status: {questline.status === 'in_progress' ? 'Em Progresso' : 'Concluída'}</p>

        {questline.nodes.map((node, index) => (
          <React.Fragment key={node._id || index}>
            <div className={`track-stage ${node.status === 'completed' ? 'completed-stage' : ''}`}>
              <div className="stage-header">
                <h3>{node.name}</h3>
                <button className="stage-button" onClick={() => clickOpenButton(node)}>
                  {node.status === 'completed' ? 'Concluído' : 'Abrir'}
                </button>
              </div>
              <p className="stage-description">
                Tipo: {node.type === 'text' ? 'Material de Leitura' : 'Questão'}
              </p>
              {node.content && node.content.ref && (
                <p className="stage-details">
                  Referência: <em>{node.content.ref}</em>
                </p>
              )}
              {node.status === 'completed' && node.updated_at && (
                <p className="stage-details completion-date">
                  Concluído em: {new Date(node.updated_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            {index < questline.nodes.length - 1 && <div className="track-separator"></div>}
          </React.Fragment>
        ))}

        <div className="track-separator"></div>

        {
          questline.nodes.every(node => node.status === 'completed') && <div className="track-stage final-stage">
            <div className="stage-header">
              <h3>Fim da Trilha</h3>
              <button onClick={() => setShowEndModal(true)} className="stage-button">Visão Geral</button>
            </div>
            <p className="stage-description">
              Você atingiu o final da trilha acadêmica "{questline.questline.name}".
            </p>
          </div>
        }
      </div>
      {focusNode && <QuestlineModal
        node={focusNode}
        onClose={() => setFocusNode(null)}
        title={focusNode?.name}
        completeActivity={() => completeActivity()}
      >
        {focusNode.type === 'video' ? <iframe src={focusNode.content.ref} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          : focusNode.type === 'question' ? <QuestionLayout questionData={focusNode} handleQuestionSubmission={handleQuestionSubmission} /> : <PdfActivity pdfUrl={'https://drive.google.com/file/d/1b7eg9he7sPFhCs7HQxyQ2KG6YpdWo3y_/preview'} />
        }
      </QuestlineModal>
      }
      <TrailCompletionModal isOpen={showEndModal} onClose={() => setShowEndModal(false)} registerData={questline} />
    </div>
  )
};

export default QuestlineDetails;
