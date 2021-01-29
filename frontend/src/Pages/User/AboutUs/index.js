import styled from 'styled-components/macro'
import { IoMdArrowRoundBack } from 'react-icons/io'
import hedwigLogo from './HedwigLogoFinal.svg'
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
  width: 100vw;
  display: grid;
  grid-template-rows: auto auto auto; //have to use max of 50% or user width? or maybe min
  text-align: center;
  align-items: center;
  justify-items: center;
  background-color: #faf6f2;
  max-width: 100%;
`

const HeaderWrapper = styled.div`
  position: fixed;
  height: 11vh;
  font-size: 4vh;
  width: 100vw;
  top: 0;
  display: grid;
  grid-template-columns: 10% 1fr 10%;
  grid-template-areas: 'back text .';
  align-items: center;
  justify-items: center;
  text-align: center;
  z-index: 1;
  background-color: white;
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
`

const BackSection = styled.div`
  grid-area: back;
  justify-self: start;
  padding-left: 3vh;
`

const AboutText = styled.div`
  position: absolute;
  grid-area: text;
  text-align: center;
  font-family: Proxima Nova;
  justify-self: center;
  top: 20%;
  font-weight: bold;
`
const TitleLogoWrapper = styled.div`
  grid-row: 2/3;
  background-color: #faf6f2;
  padding-top: 5vh;
  width: 100%;
  height: 40vh;
  text-align: center;
`

const MeetHedwigText = styled.p`
  position: relative;
  color: #f3725b;
  font-family: Proxima Nova;
  font-size: 4vh;
  text-align: center;
  line-height: 100%;
  font-weight: bold;
  top: 35%;
  height: 5vh;
`

const HedwigLogo = styled.img`
  position: relative;
  max-height: 40%;
  max-width: 40%;
  top: 50%;
  transform: translateY(-50%);
`
const PhotoGrid = styled.div`
  position: relative;
  background-color: #faf6f2;
  grid-row: 3/4;
  width: 100%;
  height: auto;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  padding: 0vh 4% 2vh 4%;
`
const DescriptionBlock = styled.div`
  position: relative;
  background-color: #faf6f2;
  width: 100%;
  height: 100%;
  grid-row: 4/5;
`

const GoalTitle = styled.p`
  position: relative;
  color: #f3725b;
  font-size: 18pt;
  text-align: center;
  line-height: 100%;
  font-weight: bold;
  margin: 2%;
`
const GoalText = styled.p`
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 3%;
  font-size: 12pt;
  text-align: justify;
`

const ContactText = styled.p`
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 0%;
  font-size: 12pt;
`

const AboutUs = () => {
  const navigate = useNavigate()

  return (
    <MainDiv>
      <HeaderWrapper>
        <BackSection>
          <IoMdArrowRoundBack
            onClick={() => navigate('/')}
            style={{
              position: 'relative',
              fontSize: '4vh',
              cursor: 'pointer',
              left: '1%'
            }}
          />
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
          position='Project Manager'
        />
        <HeadShot
          src={Melinda}
          name='Melinda Ding'
          position='Project Manager'
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
        <GoalTitle>What is Hedwig?</GoalTitle>
        <GoalText>
          Hedwig is a web application built by RiceApps that enables members of
          the Rice community to order food for pickup on campus from Rice
          vendors such as Cohen House and East West Tea. In just a few clicks,
          any member of the Rice community can place an order for pickup, pay
          using credit card or Rice specific forms of payment such as Tetra or
          Cohen House Club Card, and receive updates on its status in real-time.
          Similarly, vendors can view and interact with orders in real-time,
          with a comprehensive order management solution backed by a powerful
          publicly-traded company. Hedwig currently only services breakfast and
          lunch from Cohen House Curbside at the Club.
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
