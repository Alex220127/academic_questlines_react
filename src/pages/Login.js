import { useState } from 'react'
import { apiLogin } from '../serivces/api'
import { jwtDecode } from 'jwt-decode'
import getErrorMessage from '../utils/errors'
import Modal from '../components/Modal'
import { useNavigate } from 'react-router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loginFailMessage, setLoginFailMessage] = useState('')
  const navigate = useNavigate()

  const login = async () => {
    const payload = {
      email,
      password
    }

    const { success, data } = await apiLogin(payload)

    if (success) {
      // modal de login
      const decoded = jwtDecode(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(decoded))

      navigate('/home')
    }

    setLoginFailMessage(getErrorMessage(data))
    setShowModal(true)
  }

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Erro no login"
      >
        <p>{loginFailMessage}</p>
      </Modal>
      <input type="text" placeholder="Digite seu email" value={email} onChange={handleEmail} />
      <input type="password" placeholder="Digite sua senha" value={password} onChange={handlePassword} />
      <button type="button" onClick={login}>Entrar</button>
    </div>
  )
}
