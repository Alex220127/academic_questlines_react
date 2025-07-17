import { useEffect, useState } from "react";
import "../styles/ListQuestlines.css";
import { apiGetQuestlineRegister, joiToQuestline } from '../serivces/api'
import { useNavigate } from "react-router";
import Modal from "../components/Modal";
import getErrorMessage from "../utils/errors";
import { ToastContainer, toast } from 'react-toastify';
import { isConnected } from "../utils/isConnected";

export default function ListQuestlines() {
  const [registers, setRegisters] = useState([])
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [questlineCode, setQuestlineCode] = useState('')
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function getRegisters() {
      const registers = await apiGetQuestlineRegister(token)
      setRegisters(registers.data)
    }

    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    const { token } = connectedUser

    getRegisters(token)
    setToken(token)
  }, [ navigate ])

  const gotoDetails = (questline) => {
    navigate('/questline-details', { state: questline })
  }

  const reloadRegisters = async () => {
    const registers = await apiGetQuestlineRegister(token)
    setRegisters(registers.data)
  }

  const joinToQuestline = async (event) => {
    event.preventDefault()
    const response = await joiToQuestline(questlineCode, token)

    if (response.success) {
      setQuestlineCode('')
      setShowRegisterModal(false)
      reloadRegisters()
    } else {
      const error = getErrorMessage(response.data)
      toast(error)
    }
  }

  return (
    <>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="titulo">Minhas Trilhas</h1>
          <button className="botao" onClick={() => setShowRegisterModal(true)}>Entrar em uma nova trilha</button>
        </div>
        <div className="grid">
          {registers.map((register) => (
            <div className="card" key={register._id}>
              <div className="card-header">
                <h2>{register.questline.name}</h2>
                <span className="badge">{register.questline.subject}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${register.questline.progress}%` }}
                ></div>
              </div>
              <div className="progresso-texto">
                Progresso: {register.questline.progress}%
              </div>
              <button className="botao" onClick={() => gotoDetails(register)}>Continuar</button>
            </div>
          ))}
        </div>
      </div>
      {showRegisterModal &&
        <Modal isOpen={showRegisterModal} title="Entrar em uma nova trilha" onClose={() => setShowRegisterModal(false)}>
          <div className="modal-body">
          <p>Para acessar uma nova trilha, por favor, insira o código de acesso abaixo:</p>
          <form onSubmit={joinToQuestline}>
            <div className="modal-input-group">
              <input
                type="text"
                className="modal-input"
                placeholder="Código da Trilha"
                value={questlineCode}
                onChange={(e) => setQuestlineCode(e.target.value)}
                required
              />
              <button type="submit" className="modal-enter-button">Entrar</button>
            </div>
          </form>
        </div>
          <ToastContainer />
        </Modal>}
    </>
  );
}
