import styled from 'styled-components/macro'
import HedwigLogoFinal from './../../../images/HedwigLogoFinal.png'
import RalewayFont from '../../../fonts/GlobalFont.js'
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
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.2);
`

const HedwigLogo = styled.img`
  height: 4.5vh;
  width: 4.5vh;
  margin-right: 5px;
  margin-top: 0.15vh;
`

const HedwigWrapper = styled.div`
  font-family: 'Raleway';
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3725b;
`

function BuyerHeader (props) {
  const navigate = useNavigate()

  return (
    <HeaderWrapper>
      <RalewayFont />
      <HedwigWrapper>
        {props.showBackButton ? (
          <IoMdArrowRoundBack
<<<<<<< HEAD
            onClick={() => navigate(props.backLink, { state: props.state})}
=======
            onClick={() => navigate(props.backLink, { state: props.state })}
>>>>>>> master
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
      </HedwigWrapper>
    </HeaderWrapper>
  )
}

export default BuyerHeader
