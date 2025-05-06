import { useState } from "react"
import { apiSignUp } from "../serivces/api"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router"
import Modal from "../components/Modal"
import getErrorMessage from "../utils/errors"

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loginFailMessage, setLoginFailMessage] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleName = (e) => {
    setName(e.target.value)
  }

  const signUp = async () => {
    const payload = {
      name,
      role: 'student',
      email,
      password
    }

    const { success, data } = await apiSignUp(payload)

    console.log(data)

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

  return (
    <div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Erro no login"
      >
        <p>{loginFailMessage}</p>
      </Modal>
      <input type="text" placeholder="Digite seu nome" value={name} onChange={handleName} />
      <input type="text" placeholder="Digite seu email" value={email} onChange={handleEmail} />
      <input type="password" placeholder="Digite sua senha" value={password} onChange={handlePassword} />
      <button type="button" onClick={signUp}>Entrar</button>
    </div>
  )
}
