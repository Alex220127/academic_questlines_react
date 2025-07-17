import { useState } from 'react'
import { apiSignUp } from '../serivces/api'
import { jwtDecode } from 'jwt-decode'
import getErrorMessage from '../utils/errors'
import { useNavigate } from 'react-router'
import '../styles/Login.css'
import { ToastContainer, toast } from 'react-toastify'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const gotoLogin = () => {
    navigate('/login')
  }

  const login = async (event) => {
    event.preventDefault()
    const payload = {
      name,
      role: 'student',
      email,
      password
    }

    const { success, data } = await apiSignUp(payload)

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
    <h2>Login</h2>
    <form onSubmit={login}>
    <div className="input-group">
    <label htmlFor="name">Nome:</label>
    <input
    type="text"
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    />
    </div>
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
    <button type="submit" className="login-button">Registrar</button>
    <button className="signup-button" onClick={gotoLogin}>Já tenho uma conta</button>
    </form>
    <ToastContainer />
    </div>
    </div>
  );
}
