import { useState } from 'react'
import { apiLogin } from '../serivces/api'
import { jwtDecode } from 'jwt-decode'
import getErrorMessage from '../utils/errors'
import { useNavigate } from 'react-router'
import '../styles/Login.css'
import { ToastContainer, toast } from 'react-toastify'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const gotoSignUp = () => {
    navigate('/signup')
  }

  const login = async (event) => {
    event.preventDefault()
    const payload = {
      email,
      password
    }

    const { success, data } = await apiLogin(payload)

    if (success) {
      const decoded = jwtDecode(data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(decoded))

      navigate('/home')
    }

    toast(getErrorMessage(data))
  }

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Descomente o bloco abaixo e ajuste o caminho se for usar a imagem como logo dentro do form */}
        {/* <div className="logo-container">
          <img src={logo} alt="Logo do Site" />
        </div> */}
        <h2>Login</h2>
        <form onSubmit={login}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <button className="signup-button" onClick={gotoSignUp}>Criar conta</button>
        <ToastContainer />
      </div>
    </div>
  );
}
