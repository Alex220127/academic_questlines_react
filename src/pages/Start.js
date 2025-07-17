import { useNavigate } from "react-router"
import { useEffect } from "react"
import CenterContent from "../components/CenterContent"

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/login')

    // ver se é valido
    // se invalido tenta renovar o token
    // se não renovar manda para o login

  }, [ navigate ])

  return (
    <CenterContent>
      <img src="123" alt="Logo" />
      <div>
        <button onClick={ () => navigate('/login') }>Login</button>
        <button onClick={ () => navigate('/signup') }>Criar conta</button>
      </div>
    </CenterContent>
  )
}
