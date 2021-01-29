import { useState } from 'react'
import './index.css'
import logo from '../../Login/HedwigLogoFinal_02.svg'
import { ElemDiv, Logo } from '../../Login/Login.styles'
import { Navigate } from 'react-router-dom'

function Launch () {
  const [nav, setNav] = useState(null)
  if (nav) {
    return <Navigate to='/eat' />
  }
  return (
    <div id='main-div-launch'>
      <ElemDiv>
        <Logo style={{ marginTop: '30%' }} src={logo} />
        <h1 id='title'>Thank you!</h1>
        <h2 id='sub-title'> Let's start your first order</h2>
      </ElemDiv>
      <button
        className='home-btn'
        onClick={() => {
          setNav(true)
        }}
      >
        Home
      </button>
    </div>
  )
}

export default Launch
