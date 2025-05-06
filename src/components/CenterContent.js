import './style.css'

export default function CenterContent (props) {
  return (
    <div className='center'>
      {props.children}
    </div>
  )
}
