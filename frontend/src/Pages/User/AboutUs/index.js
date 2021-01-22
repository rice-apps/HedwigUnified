import react from 'react'
import styled from 'styled-components/macro'
import { IoMdArrowRoundBack } from 'react-icons/io'
import hedwigLogo from './HedwigLogoFinal.svg'
import BuyerHeader from '../Vendors/BuyerHeader.js'
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
  grid-template-rows: 3% 15% 64%; //have to use max of 50% or user width? or maybe min
  text-align: center;
  align-items: center;
  justify-items: center;
  background-color: #faf6f2;
  max-width: 100%;
  font-family: 'Raleway', sans-serif;
`

const HeaderWrapper = styled.div`
  position: fixed;
  height: 10vh;
  font-size: 30px;
  width: 100vw;
  top: 0;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  z-index: 1;
  background-color: white;
  padding-top: 1vh;
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
`
const AboutText = styled.p`
  position: absolute;
  font-family: 'Raleway';
  text-align: center;
  justify-content: center;
  top: 25%;
  left: 47.5%;
  transform: translate(-47.5%, 0);
  font-weight: bold;
`
const TitleLogoWrapper = styled.div`
  grid-row: 2/3;
  background-color: #faf6f2;
  width: 100%;
  height: 100%;
  text-align: center;
`

const MeetHedwigText = styled.p`
  position: relative;
  color: #f49f86;
  font-size: 18pt;
  text-align: center;
  font-family: 'Raleway';
  line-height: 100%;
  font-weight: bold;
  top: 35%;
  height: 5vh;

  text-shadow: 0px 15px 5px rgba(0,0,0,0.1),
  10px 20px 5px rgba(0,0,0,0.05),
  -10px 20px 5px rgba(0,0,0,0.05);
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
  height: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  padding-left: 4%;
  padding-right: 4%;
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
  color: #f49f86;
  font-size: 18pt;
  text-align: center;
  font-family: 'Raleway';
  line-height: 100%;
  font-weight: bold;
  margin: 2%;
  
  text-shadow: 0px 15px 5px rgba(0,0,0,0.1),
  10px 20px 5px rgba(0,0,0,0.05),
  -10px 20px 5px rgba(0,0,0,0.05);
`
const GoalText = styled.p`
  font-family: 'Raleway';
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 3%;
  font-size: 12pt;
  text-align: justify;
`

const ContactText = styled.p`
  font-family: 'Raleway';
  margin-left: 6%;
  margin-right: 6%;
  margin-top: 0%;
  font-size: 12pt;
`

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <MainDiv>
      <HeaderWrapper>
        <IoMdArrowRoundBack
          onClick={() => navigate('/')}
          style={{
            position: 'relative',
            fontSize: '25px',
            cursor: 'pointer',
            left: '1%'
          }}
        />
        <AboutText>About the Creators</AboutText>
      </HeaderWrapper>
      <TitleLogoWrapper>
        <HedwigLogo src={hedwigLogo}></HedwigLogo>
        <MeetHedwigText>Meet the Hedwig Team!</MeetHedwigText>
      </TitleLogoWrapper>
      <PhotoGrid>
        <HeadShot
          src={Nikhita}
          name={'Nikhita Gangla'}
          position={'Project Manager'}
        />
        <HeadShot
          src={Melinda}
          name={'Melinda Ding'}
          position={'Project Manager'}
        />
        <HeadShot src={Victor} name={'Victor Song'} position={'Team Lead'}  />
        <HeadShot src={Newton} name={'Newton Huynh'} position={'Team Lead'}  />
        <HeadShot src={Riley} name={'Riley Holmes'} position={'Designer'} />
        <HeadShot src={Henry} name={'Henry Qin'} position={'Developer'} />
        <HeadShot src={Lorraine} name={'Lorraine Lyu'} position={'Developer'} />
        <HeadShot src={Brandon} name={'Brandon Zhang'} position={'Developer'} />
        <HeadShot src={Ananya} name={'Ananya Vaidya'} position={'Developer'} />
        <HeadShot
          src={Vinay}
          name={'Vinay Tummarakota'}
          position={'Developer'}
        />
        <HeadShot src={Angus} name={'Angus Jelinek'} position={'Developer'} />
        <HeadShot src={Helena} name={'Helena Hu'} position={'Developer'} />
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
