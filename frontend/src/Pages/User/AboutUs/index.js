import styled from 'styled-components/macro'
import { IoMdArrowRoundBack } from 'react-icons/io'
import hedwigLogo from './../../Login/HedwigLogoFinal_02.svg'
import HeadShot from './HeadShot'
import { useNavigate } from 'react-router-dom'
import './index.css'

import Brandon from '../../../images/Brandon.jpg'
import Newton from '../../../images/Newton.JPG'
import Victor from '../../../images/Victor.jpg'
import Nikhita from '../../../images/Nikhita.jpg'
import Melinda from '../../../images/melinda.jpg'
import Henry from '../../../images/henry.jpg'
import Lorraine from '../../../images/Lorraine.jpg'
import Ananya from '../../../images/Ananya.JPG'
import Riley from '../../../images/riley.jpg'
import Vinay from '../../../images/Vinay.jpg'
import Angus from '../../../images/angus.png'
import Helena from '../../../images/Helena.jpeg'

const MainDiv = styled.div`
  width: 100%;
  display: grid;
  grid-template-rows: auto auto auto;
  text-align: center;
  align-items: center;
  justify-items: center;
  background-color: #faf8f8;
`

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-size: 3.1vh;
  width: 100vw;
  top: 0;
  display: grid;
  grid-template-columns: 10vh 1fr 10vh;
  grid-template-areas: 'back text .';
  align-items: center;
  justify-items: center;
  text-align: center;
  z-index: 1;
  font-family: 'avenir', sans-serif;
  background-color: white;
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.2);
`

const BackSection = styled.div`
  grid-area: back;
  display: grid;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-items: center;
`

const AboutText = styled.div`
  position: absolute;
  grid-area: text;
  text-align: center;
  font-family: Proxima Nova, sans-serif;
  justify-self: center;
  top: 20%;
  font-weight: bold;
`
const TitleLogoWrapper = styled.div`
  grid-row: 2/3;
  padding-top: 10vh;
  width: 100%;
  height: 30vh;
  text-align: center;
`

const MeetHedwigText = styled.p`
  position: relative;
  color: #f3725b;
  font-family: Proxima Nova, sans-serif;
  font-size: 3vh;
  text-align: center;
  line-height: 100%;
  font-weight: bold;
  height: 5vh;
`

const HedwigLogo = styled.img`
  position: relative;
  height: 12vh;
  width: 12vh;
  margin: 1.2vh 0vh;
`
const PhotoGrid = styled.div`
  position: relative;
  grid-row: 3/4;
  width: 90%;
  height: auto;
  padding: 0vh 1vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  @media (min-width: 750px) {
    width: 40%;
  }
`
const DescriptionBlock = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-row: 4/5;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GoalTitle = styled.p`
  position: relative;
  color: #f3725b;
  font-size: 4vh;
  text-align: center;
  line-height: 100%;
  font-weight: bold;
  margin: 3vh 1vh 1vh 1vh;
  padding: 2vh 0vw 1vh 0vw;
`
const GoalText = styled.div`
  font-size: 2.5vh;
  line-height: 3vh;
  margin-bottom: 2.8vh;
  text-align: left;
  width: 85%;
  @media (min-width: 750px) {
    width: 40%;
  }
`

const ContactText = styled.p`
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 0%;
  font-size: 2.2vh;
  padding-bottom: 2vh;
`

const AboutUs = () => {
  const navigate = useNavigate()

  return (
    <MainDiv>
      <HeaderWrapper>
        <BackSection>
          <IoMdArrowRoundBack onClick={() => navigate('/eat')} />
        </BackSection>
        <AboutText>About Us</AboutText>
      </HeaderWrapper>
      <TitleLogoWrapper>
        <HedwigLogo src={hedwigLogo} />
        <MeetHedwigText>Meet the Hedwig Team!</MeetHedwigText>
      </TitleLogoWrapper>
      <PhotoGrid>
        <HeadShot
          src={Nikhita}
          name='Nikhita Gangla'
          position='Product Manager'
        />
        <HeadShot
          src={Melinda}
          name='Melinda Ding'
          position='Product Manager'
        />
        <HeadShot src={Victor} name='Victor Song' position='Team Lead' />
        <HeadShot src={Newton} name='Newton Huynh' position='Team Lead' />
        <HeadShot src={Riley} name='Riley Holmes' position='Designer' />
        <HeadShot src={Henry} name='Henry Qin' position='Developer' />
        <HeadShot src={Lorraine} name='Lorraine Lyu' position='Developer' />
        <HeadShot src={Brandon} name='Brandon Zhang' position='Developer' />
        <HeadShot src={Ananya} name='Ananya Vaidya' position='Developer' />
        <HeadShot src={Vinay} name='Vinay Tummarakota' position='Developer' />
        <HeadShot src={Angus} name='Angus Jelinek' position='Developer' />
        <HeadShot src={Helena} name='Helena Hu' position='Developer' />
      </PhotoGrid>
      <DescriptionBlock>
        <GoalTitle>Our Goal</GoalTitle>
        <GoalText>
          A revolutionary project designed from the ground up by Rice students
          for the Rice Community.
        </GoalText>
        <GoalText>
          In this challenging time, it is imperative that we take all necessary
          precautions as we begin to navigate life inside the “new normal” of
          the post COVID-19 era. That is why we have built Hedwig, a web
          experience which enables Rice students, faculty, and staff to engage
          with campus food establishments in a safe and frictionless manner.{' '}
        </GoalText>{' '}
        <GoalText>
          In just a few clicks, any member of the Rice community can place an
          order and receive updates on its status in real-time; similarly,
          vendors can view and interact with new orders in real-time, with a
          comprehensive order management solution backed by a powerful
          publicly-traded company.
        </GoalText>
        <GoalTitle>Contact us</GoalTitle>
        <ContactText>
          Contact us with any questions, feedbacks, or suggestions using this
          form: <br />
          <a href='https://forms.gle/2ahMabUqo36P1ddh8 '>
            https://forms.gle/2ahMabUqo36P1ddh8
          </a>
        </ContactText>
      </DescriptionBlock>
    </MainDiv>
  )
}

export default AboutUs
