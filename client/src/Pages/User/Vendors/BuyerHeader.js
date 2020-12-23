import styled from 'styled-components'
import { FaUserCircle } from 'react-icons/fa'
import HedwigLogoFinal from './../../../images/HedwigLogoFinal.png'
import RalewayFont from './../../../fonts/Raleway/RalewayFont'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-size: 26px;
  width: 100vw;
  top: 0;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: white;
  z-index: 1;
  padding-top: 1vh;
`

const HedwigLogo = styled.img`
  height: 4.5vh;
  width: 4.5vh;
  margin-right: 5px;
  margin-top: 0l5vh;
`

const HedwigWrapper = styled.div`
  font-family: 'Raleway';
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #db6142;
`

function BuyerHeader (props) {
  const navigate = useNavigate()

  return (
    <HeaderWrapper>
      <RalewayFont />
      <HedwigWrapper>
        {props.showBackButton ? (
          <IoMdArrowRoundBack
            onClick={() => navigate(props.backLink)}
            style={{
              position: 'fixed',
              left: '22px',
              fontSize: '25px',
              verticalAlign: 'middle',
              cursor: 'pointer'
            }}
          />
        ) : null}
        <HedwigLogo src={HedwigLogoFinal} /> hedwig
        <FaUserCircle
          style={{
            position: 'fixed',
            right: '22px',
            fontSize: '25px',
            verticalAlign: 'middle'
          }}
        />
      </HedwigWrapper>
    </HeaderWrapper>
  )
}

export default BuyerHeader
