import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import ListQuestlines from './ListQuestlines'
import { useNavigate } from "react-router"
import DashboardStudent from "./DashboardStudent"
import { getNavElements } from "../utils/getNavElements"
import { isConnected } from "../utils/isConnected"

export default function Home () {
  const [ navItems, setNavItems ] = useState([])
  const [ user, setUser ] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const connectedUser = isConnected()

    if (!connectedUser) {
      navigate('/login')
    }

    setUser(connectedUser.user)
    setNavItems(getNavElements(connectedUser.user))

  }, [ setNavItems, navigate ])

  if (user.scope === 'admin') {
    return (
      <>
        <Navbar items={navItems} />
        <DashboardStudent />
      </>
    )
  }

  return (
    <>
    <Navbar items={navItems}/>
    <ListQuestlines />
    </>
  )
}
