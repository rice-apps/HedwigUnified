import styled from 'styled-components/macro'
import HedwigLogoFinal from '../../../images/HedwigLogoFinal.png'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-weight:600;
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
  font-family: Omnes;
`

const HedwigLogo = styled.img`
  height: 4.6vh;
  width: 4.6vh;
  margin-right: 5px;
  margin-top: 0.15vh;
`

const HedwigWrapper = styled.div`
  font-size: 3.8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3725b;
`

function BuyerHeader (props) {
  const navigate = useNavigate()

  return (
    <HeaderWrapper>
      <HedwigWrapper>
        {props.showBackButton ? (
          <IoMdArrowRoundBack
            onClick={() => navigate(props.backLink, { state: props.state })}
            style={{
              position: 'fixed',
              left: '22px',
              fontSize: '25px',
              verticalAlign: 'middle',
              cursor: 'pointer'
            }}
          />
        ) : null}
        <HedwigLogo src={HedwigLogoFinal} /> <span>hedwig</span>
      </HedwigWrapper>
    </HeaderWrapper>
  )
}

export default BuyerHeader
