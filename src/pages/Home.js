import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"

export default function Home () {
  const [ navItems, setNavItems ] = useState([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user.scope === 'admin') {
      setNavItems([
        {
          className: 'nav-item',
          text: 'Home',
          goto: '/home'
        }
      ])
    } else {
      setNavItems([
        {
          className: 'nav-item',
          text: 'Minhas trilhas',
          goto: '/home'
        }
      ])
    }
  }, [ setNavItems ])

  return (
    <>
    <Navbar items={navItems}/>
    </>
  )
}
