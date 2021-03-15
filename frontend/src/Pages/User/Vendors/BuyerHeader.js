import styled, { css } from 'styled-components/macro'
import HedwigLogoFinal from '../../../Pages/Login/HedwigLogoFinal_02.svg'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-weight: 600;
  width: 100vw;
  top: 0;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: ${props => (props.transparent ? 'transparent' : 'white')};
  z-index: 1;
  padding-top: 1vh;
  box-shadow: ${props =>
    props.transparent ? 'none' : '0px 0px 15px 1px rgba(0, 0, 0, 0.2)'};
  font-family: 'Omnes', sans-serif;
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

const RoundedWrapper = styled.div`
  padding: 0.5vh 3vh;
  background-color: white;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props =>
    props.backarrow &&
    css`
      position: fixed;
      left: 22px;
      font-size: 25px;
      vertical-align: middle;
    `}
`

function BuyerHeader (props) {
  const navigate = useNavigate()

  return (
    <HeaderWrapper transparent={props.transparent}>
      {/* Transparent is true when you do not want a white background for header */}
      {props.transparent ? (
        <HedwigWrapper>
          {props.showBackButton ? (
            <RoundedWrapper backarrow>
              <IoMdArrowRoundBack
                onClick={() => navigate(props.backLink, { state: props.state })}
                style={{
                  cursor: 'pointer'
                }}
              />
            </RoundedWrapper>
          ) : null}
          <RoundedWrapper>
            <HedwigLogo src={HedwigLogoFinal} /> <span>hedwig</span>
          </RoundedWrapper>
        </HedwigWrapper>
      ) : (
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
      )}
    </HeaderWrapper>
  )
}

export default BuyerHeader
