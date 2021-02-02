import styled from 'styled-components/macro'
import './index.css'

const MainDiv = styled.div`
  max-width: 100%;
  max-height: 100%;
  text-align: center;
  align-items: center;
  justify-items: center;
  font-family: avenir;
`

const HeadPhoto = styled.img`
  position: relative;
  border-radius: 50%;
  max-height: 70%;
  max-width: 80%;
  top: 8%;
`

const Name = styled.p`
  font-family: Proxima Nova;
  font-weight: bold;
  font-size: 2.5vh;
  margin: 0;
  margin-top: 15%;
  padding: 2vh 0;
  line-height: 90%;
`

const Position = styled.p`
  font-family: Proxima Nova;
  font-size: 2vh;
  margin: 0;
  padding: 0;
  line-height: 90%;
`

const HeadShot = ({ src, name, position }) => {
  return (
    <MainDiv className='emphasize'>
      <HeadPhoto src={src} />
      <Name>{name}</Name>
      <Position>{position}</Position>
    </MainDiv>
  )
}

export default HeadShot
