import styled from 'styled-components/macro'
import './index.css'

const MainDiv = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 6.7vh 5vh;
  text-align: center;
  align-items: center;
  align-content: center;
  justify-items: center;
  font-family: avenir;
  margin:1vh 0vh;
`

const HeadPhoto = styled.img`
  position: relative;
  border-radius: 50%;
  object-fit: cover;
  width: 85%;
  margin-bottom: 0.5vh;
  height: auto;
`

const Name = styled.div`
  font-family: Proxima Nova;
  font-weight: bold;
  font-size: 2.5vh;
  line-height: 2.8vh;
  align-self: flex-end;
`

const Position = styled.div`
  font-family: Proxima Nova;
  font-size: 2.1vh;
  margin: 0;
  padding: 0;
  opacity: 0.7;
  line-height: 90%;
  width: 90%;
`

const HeadShot = ({ src, name, position }) => {
  const splitName = name.split(' ')
  const splitPosition = position.split(' ')
  console.log(splitName)
  return (
    <MainDiv className='emphasize'>
      <HeadPhoto src={src} />
      <Name>
        {splitName[0]}
        <br />
        {splitName[1]}
      </Name>

      <Position>{position}</Position>
    </MainDiv>
  )
}

export default HeadShot
