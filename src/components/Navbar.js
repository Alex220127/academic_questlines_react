import { useNavigate } from 'react-router'
import './style.css'

export default function Navbar(props) {
  const navigate = useNavigate()

  return (
    <div className='nav-container'>
      {props.items.map((item, index) => {
        return (
          <div key={index} className={item.className} onClick={ () => navigate(item.goto) }>
            {item.text}
          </div>
        )
      })}
    </div>
  )
}
